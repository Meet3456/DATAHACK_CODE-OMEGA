from langchain.chat_models import ChatOpenAI
from langchain.schema import StrOutputParser
from langchain.chains import LLMChain
from dotenv import load_dotenv
from PyPDF2 import PdfReader

# from PyPDF2 import PdfFileReader
from langchain.text_splitter import CharacterTextSplitter
from langchain.embeddings import OpenAIEmbeddings, HuggingFaceInstructEmbeddings
from langchain.vectorstores import FAISS
from langchain.chat_models import ChatOpenAI
from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationalRetrievalChain
from langchain.prompts import PromptTemplate
from langchain.llms import HuggingFaceHub
from io import BytesIO
import openai
from langchain.prompts import (
    ChatPromptTemplate,
    HumanMessagePromptTemplate,
    SystemMessagePromptTemplate,
)
import chainlit as cl

system_message_prompt = SystemMessagePromptTemplate.from_template(
    "In want you to act as a law agent, understanding all laws and related jargon, and explaining them in a simpler and descriptive way. Return a list of all the related laws drafted for the user_input question and provide proper penal codes if applicable from the ingested PDF, and explain the process and terms in a simpler way. The context is:\n{context}"
)
human_message_prompt = HumanMessagePromptTemplate.from_template("{question}")


def get_text_from_pdf(pdf):
    print("inside pdf")
    ## empty string(variable) to store all the text:
    pdf_file_object = BytesIO(pdf.content)
    # Create a PdfFileReader object
    pdf = PdfReader(pdf_file_object)
    # Initialize an empty string to store the extracted text
    pdf_text = ""
    # Loop over all the pages in the PDF and extract the text
    for page_number in range(len(pdf.pages)):
        page = pdf.pages[page_number]
        pdf_text += page.extract_text()

    return pdf_text


def get_text_chunks_raw(text):
    print("inside chunks")
    ## LANGCHAIN TEXT SPLITTER:
    text_splitter = CharacterTextSplitter(
        separator="\n",
        ## MAX CHUNK OF SIZE CREATED 1000
        chunk_size=1000,
        ## IF SOME INFORMATION IS EXTRACTED AND MISSED BETWEEN 1000 CHUNKS WE MOVE BACK 200 WORDS(OVERLAP BACKWARDS)
        chunk_overlap=200,
        length_function=len,
    )

    chunks = text_splitter.split_text(text)
    return chunks


def store_vector_embeddings(get_text_chunks):
    print("inside embedding")
    ## USING OPENAI EMBEDDINGS , WHICH CALLS THE OPENAI SERVERS -> FAST , DOSENT STORES ON LOCAL MACHINE
    embeddings = OpenAIEmbeddings()
    ## HUGGING FACE EMBEDDINGS , STORES THE EMBEDDINGS IN OUR LOCAL MACHINE -> SLOW BUT MORE ACCURATE
    ## new_embeddings = HuggingFaceInstructEmbeddings(model_name = 'hkunlp/instructor-xl')
    ## STORING THE  IN FAISS STORAGE
    vectorstore = FAISS.from_texts(texts=get_text_chunks, embedding=embeddings)
    return vectorstore


def get_conversation_chain(vectorstore):
    print("inside chaining")
    llm = ChatOpenAI(temperature=0)
    memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)
    conversation_chain = ConversationalRetrievalChain.from_llm(
        llm=llm,
        retriever=vectorstore.as_retriever(),
        memory=memory,
        combine_docs_chain_kwargs={
            "prompt": ChatPromptTemplate.from_messages(
                [
                    system_message_prompt,
                    human_message_prompt,
                ]
            ),
        },
    )
    return conversation_chain


@cl.on_chat_start
async def on_chat_start():
    print("inside main")
    files = None
    # Wait for the user to upload a file
    while files == None:
        files = await cl.AskFileMessage(
            content="Please upload a text file to begin!",
            accept=["application/pdf"],
            timeout=180,
        ).send()
    get_raw_text = get_text_from_pdf(files[0])
    ## CONVERT IT INTO SMALL CHUNKS by CALLING 'get_text_chunks_raw' -> TAKES INPUT THE RAW TEXT AND RETURNS CHUNKS OF IT:
    get_text_chunks = get_text_chunks_raw(get_raw_text)
    vectorstore = store_vector_embeddings(get_text_chunks)
    ## CREATE EMBEDIINGS(REPRESENT CHUNKS INTO VECTOR) AND STORE IT IN DATABASE AS VECTORS:
    chain = get_conversation_chain(vectorstore)
    cl.user_session.set("chain", chain)


@cl.on_message
async def on_message(message: cl.Message):
    chain = cl.user_session.get("chain")  # type: LLMChain

    res = await cl.make_async(chain.run)(
        question=message.content, callbacks=[cl.LangchainCallbackHandler()]
    )

    await cl.Message(content=res).send()

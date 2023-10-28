from flask import Flask,jsonify,request,session,url_for,redirect
from dotenv import load_dotenv
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.vectorstores import FAISS
from langchain.chat_models import ChatOpenAI
from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationalRetrievalChain
from langchain.chains.question_answering import load_qa_chain
from langchain.prompts import (
    ChatPromptTemplate,
    HumanMessagePromptTemplate,
    SystemMessagePromptTemplate,
)
import openai
import os
from pymongo import MongoClient
from convert2text import Convert2Text

load_dotenv()

app = Flask(__name__)
passw = os.getenv("MONGO_PASS")
app.secret_key = os.getenv("SECRET_KEY")

def auth_middleware():
   if 'user_id' not in session:
       return redirect(url_for('login'))

connection_string = f"mongodb+srv://codeomega:{passw}@cluster0.hnyk6mi.mongodb.net/?retryWrites=true&w=majority"
def MongoDB(collection_name):
    client = MongoClient(connection_string)
    db = client.get_database('SIH')
    collection = db.get_collection(collection_name)
    return collection

def ingest(path : str):
    converter = Convert2Text(path)
    text = converter.convert_to_text()
    text_splitter = RecursiveCharacterTextSplitter(separators='\n', chunk_size = 1000, chunk_overlap = 200)
    chunks = text_splitter.split_text(text)
    embeddings = OpenAIEmbeddings()
    vector_db = FAISS.from_texts(chunks, embedding=embeddings)
    return vector_db

vector_db = ingest('database/Indian Constituition.pdf')

system_prompt = "As a legal chatbot, your role is to simplify and provide clear explanation for various laws and legal terminology. Your task is to return the list of relevant laws related to the user's query, and if applicable, provide the corresponding penal codes sourced from the knowledge base provided to you. Additionally, explain the legal processes and terms in a user-friendly manner. The context for your responses should be based on the following:\n{context}"
# system_prompt = "You are a Legal Consultant. Based on the given sceanrio, explain the related articles and laws that are violated in brief. and if applicable, Use the corresponding penal codes sourced from the knowledge base provided to you. The context for your responses should be based on the following:\n{context}"
# system_prompt = "I want you to act as a law agent, understanding all laws and related jargon, and explaining them in a simpler and descriptive way. Return a list of all the related laws drafted for the user_input question and provide proper penal codes if applicable from the ingested PDF, and explain the process and terms in a simpler way. The context is:\n{context}"
# human_prompt = "{question}"

# system_message_prompt = SystemMessagePromptTemplate.from_template(
# "In want you to act as a law agent, understanding all laws and related jargon, and explaining them in a simpler and descriptive way. Return a list of all the related laws drafted for the user_input question and provide proper penal codes if applicable from the ingested PDF, and explain the process and terms in a simpler way. The context is:\n{context}"
# )
# human_message_prompt = HumanMessagePromptTemplate.from_template(
#     "{question}"
# )

def question_answering(user_query, vector_db, system_prompt, human_prompt):
    system_message_prompt = SystemMessagePromptTemplate.from_template(system_prompt)
    human_message_prompt = HumanMessagePromptTemplate.from_template(human_prompt)



    # messages = [system_message_prompt, human_message_prompt]
    # final_prompt = ChatPromptTemplate.from_messages(messages=messages)

    final_prompt = ChatPromptTemplate.from_messages([
        ("system", system_prompt),
        ("human", human_prompt),
    ])
    rel_docs = vector_db.similarity_search(user_query)
    print("=============================================\n",rel_docs)
    llm = ChatOpenAI(temperature=0)
    memory = ConversationBufferMemory(memory_key='chat_history', return_messages=True)
    retriever = vector_db.as_retriever()
    conversation_chain = ConversationalRetrievalChain.from_llm(
        llm, 
        memory=memory, 
        retriever=retriever,
        combine_docs_chain_kwargs={
            'prompt': final_prompt
        })
    #     combine_docs_chain_kwargs={
    #         "prompt": ChatPromptTemplate.from_messages([
    #              system_message_prompt,
    #              human_message_prompt,
    #     ]),
    # })
    return conversation_chain(user_query)['answer']

@app.route("/home2")
def hello_world():
    response = {"message": "failed"}
    return jsonify(response)


@app.route('/register-post',methods=['POST'])
def registerpost():
    new_record = {
    'first_name' : request.form.get('firstName'),
    'last_name' : request.form.get('lastName'),
    'age' : request.form.get('age'),
    'gender' : request.form.get('gender'),
    'email' : request.form.get('emailAddress'),
    'phone_number' : request.form.get('phoneNumber'),
    'location' : request.form.get('phoneNumber'),
    'password' : request.form.get('password'),
    }
    collection = MongoDB('applicant')
    existing_user = collection.find_one({'email': new_record['email']})  
    if existing_user:
      response = {'message': 'exists'}
      return jsonify(response)
    
    result = collection.insert_one(new_record)
    if result.inserted_id:
        session['user_id'] = str(result.inserted_id)
        return jsonify({'message': True})
    else:
        response = {'message': False}
        return jsonify(response)
    
@app.route('/login',methods=['POST'])
def loginpost():
    record = {
    'password' : request.form.get('logpass'),
    'email' : request.form.get('logemail'),
    'type': request.form.get('type'),
    }
    collection_name = 'applicant' if record['type'] == 'applicant' else 'recruiter'
    collection = MongoDB(collection_name)
    existing_user = collection.find_one({'email': record['email']})
    if existing_user:
        if existing_user['password'] == record['password']:
            response = {'success': True}
            session['user_id'] = str(existing_user['_id'])
            print(session['user_id'])
            return jsonify(response)
        else:
            response = {'success': 'password_mismatch'}
            return jsonify(response)
    else :
        response = {'success': False}
        return jsonify(response)
    

@app.route('/answer', methods=['POST'])
def answer_query():
    try:
        data = request.get_json()
        user_query = data.get('query', '')
        print("user Query:- ",user_query)

        # response_data = {'answer': "The customers in the database are Customer 0 (42, Male), Customer 1 (44, Female), Customer 2 (47, Male), Customer 3 (59, Female), Customer 4 (49, Female), Customer 5 (37, Other), Customer 6 (69, Other), Customer 7 (54, Other), Customer 8 (62, Male), and Customer 9 (37, Other)."}

        response = question_answering(user_query,vector_db,system_prompt, human_prompt)
        print(response)
        response_data = {'answer': response}

        return jsonify(response_data)
    except Exception as e:
        return jsonify({'error': str(e)})



def vedant_raita(in_pdf,out_pdf):
    #========================DO NOT CHANGE==========================
    import PyPDF2
    from reportlab.pdfgen import canvas
    from transformers import AutoTokenizer, AutoModelForSeq2SeqLM

    from PyPDF2 import PdfReader

    from reportlab.lib.pagesizes import letter
    from reportlab.pdfgen import canvas
    from reportlab.lib.styles import getSampleStyleSheet
    from reportlab.platypus import Paragraph
    from fpdf import FPDF
    import textwrap

    from reportlab.lib.pagesizes import letter
    from reportlab.platypus import SimpleDocTemplate, PageTemplate, BaseDocTemplate, Frame, PageBreak, Paragraph
    from reportlab.lib.styles import getSampleStyleSheet
    from reportlab.lib import colors
    from langdetect import detect

    def extract_text_from_pdf(file_path):
        reader = PdfReader(file_path)
        text = ""
        for page in reader.pages:
            text += page.extract_text()
        code=detect(text)
        print(code)

        # d={'fr':'fra_Latn',}


        return text,code

    def translate_text(text, source_lang, target_lang= 'eng_Latn'):
        tokenizer = AutoTokenizer.from_pretrained("facebook/nllb-200-distilled-600M", src_lang = source_lang)
        model = AutoModelForSeq2SeqLM.from_pretrained("facebook/nllb-200-distilled-600M")
        inputs = tokenizer(text, return_tensors="pt")
        translated_tokens = model.generate(
            inputs['input_ids'], forced_bos_token_id=tokenizer.lang_code_to_id[target_lang], max_length=1024
        )
        result = tokenizer.batch_decode(translated_tokens, skip_special_tokens=True)[0]
        print(result)
        return result

    def translate_pdf_to_english(file_path):
        text,code = extract_text_from_pdf(file_path)
        # Split the text into chunks of approximately 1000 characters
        chunks = textwrap.wrap(text, width=1000)
        translated_text = ""
        for chunk in chunks:
            translated_text += translate_text(chunk,code)
        return translated_text

    def create_pdf(text, output_path):
        pdf_filename = "output.pdf"

        class MyDocTemplate(BaseDocTemplate):
            def afterFlowable(self, flowable):
                if isinstance(flowable, Paragraph):
                    if flowable.getKeepWithNext():
                        self.canv.restoreState()
                        self.canv.showPage()
                        self.handle_flowable(flowable)

        doc = MyDocTemplate(pdf_filename, pagesize=letter)

        frame = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id='normal')
        template = PageTemplate(id='test', frames=frame)
        doc.addPageTemplates([template])

        # Create a list of flowables (content elements)
        story = []
        styles = getSampleStyleSheet()
        paragraphs = text.split('\n\n')

        # Customize the font size
        custom_style = styles["Normal"]
        custom_style.fontName = 'Helvetica'
        custom_style.fontSize = 12 # Set the font size here
        custom_style.alignment = 0 

        for paragraph in paragraphs:
            story.append(Paragraph(paragraph, custom_style))
            story.append(PageBreak())

        # Remove the page break after the last paragraph
        story.pop()

        # Build the PDF
        doc.build(story)
        print(f"PDF saved as {pdf_filename}")


    translated_text = translate_pdf_to_english(in_pdf)
    create_pdf(translated_text, out_pdf)
    #++++++++++++++++++++++++++++DO NOT CHANGE+++++++++++++++++++++++++++++






if __name__ == "__main__":
    app.run(debug=True, port=5000)
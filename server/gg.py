import PyPDF2
from reportlab.pdfgen import canvas
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
from PyPDF2 import PdfReader
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import Paragraph, PageBreak
from fpdf import FPDF
import textwrap
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, PageTemplate, BaseDocTemplate, Frame
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib import colors
from langdetect import detect

def vedant_raita(in_pdf, out_pdf):
    def extract_text_from_pdf(file_path):
        reader = PdfReader(file_path)
        text = ""
        for page in reader.pages:
            text += page.extract_text()
        code = detect(text)
        return text, code

    def translate_text(text, source_lang, target_lang='eng_Latn'):
        tokenizer = AutoTokenizer.from_pretrained("facebook/nllb-200-distilled-600M", src_lang=source_lang,)
        model = AutoModelForSeq2SeqLM.from_pretrained("facebook/nllb-200-distilled-600M").to(device)
        inputs = tokenizer(text, return_tensors="pt").to(device)
        translated_tokens = model.generate(
            inputs['input_ids'], forced_bos_token_id=tokenizer.lang_code_to_id[target_lang], max_length=1024
        )
        result = tokenizer.batch_decode(translated_tokens, skip_special_tokens=True)[0]
        return result

    def remove_duplicate_words(text):
        return ' '.join(dict.fromkeys(text.split()))

    def translate_pdf_to_english(file_path):
        text, code = extract_text_from_pdf(file_path)
        chunks = textwrap.wrap(text, width=1000)
        translated_text = ""
        for chunk in chunks:
            translated_chunk = translate_text(chunk, code)
            translated_chunk = remove_duplicate_words(translated_chunk)
            translated_text += translated_chunk
        return translated_text

    def create_pdf(text, output_path):
        pdf_filename = output_path
        doc = BaseDocTemplate(pdf_filename, pagesize=letter)
        frame = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id='normal')
        template = PageTemplate(id='test', frames=frame)
        doc.addPageTemplates([template])
        story = []
        styles = getSampleStyleSheet()
        custom_style = styles["Normal"]
        custom_style.fontName = 'Helvetica'
        custom_style.fontSize = 12
        custom_style.alignment = 0
        paragraphs = text.split('\n\n')
        for paragraph in paragraphs:
            story.append(Paragraph(paragraph, custom_style))
            story.append(PageBreak())
        story.pop()
        doc.build(story)

    translated_text = translate_pdf_to_english(in_pdf)
    create_pdf(translated_text, out_pdf)

vedant_raita('French_Test.pdf','output.pdf')
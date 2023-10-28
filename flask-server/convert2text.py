import docx2txt
import os
from PyPDF2 import PdfReader

class Convert2Text:
    def __init__(self, file_path):
        self.file_path = file_path

    def check_file_extension(self):
        _, file_extension = os.path.splitext(self.file_path)
        return file_extension.lower()

    def convert_to_text(self):
        file_extension = self.check_file_extension()
        if file_extension == '.pdf':
            return self.pdftotext(self.file_path)
        elif file_extension == '.docx':
            return self.doctotext(self.file_path)
        else:
            raise ValueError(f"Unsupported file format: {file_extension}. Only .pdf and .docx files are supported.")

    def doctotext(self, m):
        temp = docx2txt.process(m)
        resume_text = [line.replace('\t', ' ') for line in temp.split('\n') if line]
        text = ' '.join(resume_text)
        return text

    def pdftotext(self, m):
        pdfFileObj = open(m, 'rb')
        pdfFileReader = PdfReader(pdfFileObj)
        num_pages = len(pdfFileReader.pages)
        currentPageNumber = 0
        text = ''
        while currentPageNumber < num_pages:
            pdfPage = pdfFileReader.pages[currentPageNumber]
            text = text + pdfPage.extract_text()
            currentPageNumber += 1
        pdfFileObj.close()
        return text
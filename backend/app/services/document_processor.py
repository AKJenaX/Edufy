import PyPDF2
import docx
from typing import Optional
import logging

logger = logging.getLogger(__name__)


class DocumentProcessor:
    @staticmethod
    def extract_text_from_pdf(file_path: str) -> str:
        """Extract text from PDF file"""
        try:
            text = ""
            with open(file_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                for page in pdf_reader.pages:
                    text += page.extract_text() + "\n"
            return text.strip()
        except Exception as e:
            logger.error(f"Error extracting text from PDF: {e}")
            raise Exception(f"Failed to process PDF: {str(e)}")
    
    @staticmethod
    def extract_text_from_docx(file_path: str) -> str:
        """Extract text from DOCX file"""
        try:
            doc = docx.Document(file_path)
            text = "\n".join([paragraph.text for paragraph in doc.paragraphs])
            return text.strip()
        except Exception as e:
            logger.error(f"Error extracting text from DOCX: {e}")
            raise Exception(f"Failed to process DOCX: {str(e)}")
    
    @staticmethod
    def extract_text_from_txt(file_path: str) -> str:
        """Extract text from TXT file"""
        try:
            with open(file_path, 'r', encoding='utf-8') as file:
                text = file.read()
            return text.strip()
        except Exception as e:
            logger.error(f"Error reading text file: {e}")
            raise Exception(f"Failed to process text file: {str(e)}")
    
    @staticmethod
    def process_document(file_path: str, file_type: str) -> str:
        """Process document based on file type"""
        file_type = file_type.lower()
        
        if file_type == 'pdf':
            return DocumentProcessor.extract_text_from_pdf(file_path)
        elif file_type in ['docx', 'doc']:
            return DocumentProcessor.extract_text_from_docx(file_path)
        elif file_type == 'txt':
            return DocumentProcessor.extract_text_from_txt(file_path)
        else:
            raise ValueError(f"Unsupported file type: {file_type}")
    
    @staticmethod
    def chunk_text(text: str, chunk_size: int = 1000, overlap: int = 200) -> list:
        """Split text into chunks for processing"""
        chunks = []
        start = 0
        text_length = len(text)
        
        while start < text_length:
            end = start + chunk_size
            chunk = text[start:end]
            chunks.append(chunk)
            start = end - overlap
        
        return chunks


# Singleton instance
document_processor = DocumentProcessor()

# Made with Bob

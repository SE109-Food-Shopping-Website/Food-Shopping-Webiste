from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_experimental.text_splitter import SemanticChunker
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from pymongo import MongoClient
from dotenv import load_dotenv
from PyPDF2 import PdfReader
from docx import Document
import zipfile
from lxml import etree
from datetime import datetime
from file_loader import read_file
import os

# Load biến môi trường
load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

# Kết nối MongoDB
client = MongoClient("mongodb://localhost:27017")
db = client["rag_db"]
collection = db["embedding"]

# Khởi tạo embedding model từ Google Generative AI
embedding_model = GoogleGenerativeAIEmbeddings(
    model="models/embedding-001",
    google_api_key=GOOGLE_API_KEY
)

# Chunker
semantic_chunker = SemanticChunker(embeddings=embedding_model)
recursive_chunker = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=100)

# ---------------------- Đọc file PDF ----------------------
def read_pdf(file_path):
    reader = PdfReader(file_path)
    text = ""
    for page in reader.pages:
        text += page.extract_text() or ""

    raw_metadata = reader.metadata
    metadata = {}
    if raw_metadata:
        metadata = {key[1:] if key.startswith("/") else key: str(value) for key, value in raw_metadata.items()}

    return text, metadata

# ---------------------- Đọc file DOCX ----------------------
def read_docx(file_path):
    doc = Document(file_path)
    sections = []
    current_heading = None
    current_content = []

    for p in doc.paragraphs:
        style = p.style.name

        # Nếu là heading
        if style.startswith("Heading"):
            # Nếu đã có section trước đó, lưu lại
            if current_heading or current_content:
                sections.append({
                    "heading": current_heading,
                    "content": "\n".join(current_content).strip()
                })
                current_content = []

            current_heading = p.text.strip()
        else:
            # Gom đoạn văn bản không phải heading
            if p.text.strip():
                current_content.append(p.text.strip())

    # Lưu section cuối cùng
    if current_heading or current_content:
        sections.append({
            "heading": current_heading,
            "content": "\n".join(current_content).strip()
        })

    return sections

# ---------------------- Đọc file bất kỳ ----------------------
def read_file(file_path):
    if file_path.endswith(".pdf"):
        return read_pdf(file_path)
    elif file_path.endswith(".docx"):
        return read_docx(file_path)
    else:
        raise ValueError(f"Unsupported file type: {file_path}")

# ---------------------- Lưu embedding ----------------------
def store_embeddings(docs: list):
    for doc in docs:
        print(f"\n📄 File: {doc['file_name']}")

        sections = doc["sections"]
        metadata = doc.get("metadata", {})

        for idx, sec in enumerate(sections):
            heading = sec.get("heading")
            text = sec.get("content")
            if not text:
                continue

            # Tách chunk
            try:
                chunks = semantic_chunker.split_text(text)
            except Exception as e:
                print(f"Semantic chunking error: {e}")
                chunks = []

            if not chunks:
                print("Semantic chunking failed. Fallback to recursive splitting.")
                chunks = recursive_chunker.split_text(text)

            print(f"Section: {heading} - Created {len(chunks)} chunks.")

            # Tạo embedding
            embeddings = embedding_model.embed_documents(chunks)

            for i, (chunk, emb) in enumerate(zip(chunks, embeddings)):
                collection.insert_one({
                    "file_name": doc["file_name"],
                    "section_heading": heading,
                    "chunk_index": i,
                    "text": chunk,
                    "embedding": emb,
                    "metadata": metadata
                })
                print(f"Inserted chunk {i} (Heading: {heading})")
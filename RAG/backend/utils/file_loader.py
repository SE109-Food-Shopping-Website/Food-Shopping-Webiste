import os
from datetime import datetime
from docx import Document
from PyPDF2 import PdfReader
import zipfile
from lxml import etree

def read_pdf(file_path):
    reader = PdfReader(file_path)
    text = ""
    for page in reader.pages:
        text += page.extract_text() or ""

    metadata = {
        "file_name": os.path.basename(file_path),
        "file_size": os.path.getsize(file_path),
        "last_modified": datetime.fromtimestamp(os.path.getmtime(file_path)).isoformat()
    }

    raw_metadata = reader.metadata
    if raw_metadata:
        metadata.update({
            key[1:] if key.startswith("/") else key: str(value)
            for key, value in raw_metadata.items()
        })

    return text, metadata

def read_docx(file_path):
    doc = Document(file_path)

    # Metadata từ core.xml
    metadata = {}
    try:
        with zipfile.ZipFile(file_path) as docx:
            if "docProps/core.xml" in docx.namelist():
                with docx.open("docProps/core.xml") as core:
                    tree = etree.parse(core)
                    ns = {
                        'cp': 'http://schemas.openxmlformats.org/package/2006/metadata/core-properties',
                        'dc': 'http://purl.org/dc/elements/1.1/',
                        'dcterms': 'http://purl.org/dc/terms/'
                    }
                    metadata = {
                        'title': tree.findtext('.//dc:title', namespaces=ns),
                        'author': tree.findtext('.//dc:creator', namespaces=ns),
                        'created': tree.findtext('.//dcterms:created', namespaces=ns),
                        'modified': tree.findtext('.//dcterms:modified', namespaces=ns),
                        'last_modified_by': tree.findtext('.//cp:lastModifiedBy', namespaces=ns)
                    }
    except Exception as e:
        print(f"Error extracting metadata: {e}")

    # Lấy sections theo heading
    sections = []
    current_heading = None
    current_text = []

    for p in doc.paragraphs:
        if p.style.name.startswith("Heading"):
            if current_heading or current_text:
                sections.append({
                    "heading": current_heading,
                    "content": "\n".join(current_text).strip()
                })
                current_text = []
            current_heading = p.text.strip()
        else:
            if p.text.strip():
                current_text.append(p.text.strip())

    if current_heading or current_text:
        sections.append({
            "heading": current_heading,
            "content": "\n".join(current_text).strip()
        })

    # In thử heading và text (debug)
    print("Extracted sections:")
    for sec in sections:
        print(f"Heading: {sec['heading']}\n   Content: {sec['content'][:50]}...")

    return sections, metadata

def read_file(file_path):
    if file_path.endswith(".pdf"):
        return read_pdf(file_path)
    elif file_path.endswith(".docx"):
        return read_docx(file_path)
    else:
        raise ValueError(f"Unsupported file type: {file_path}")

def load_files_from_directory(directory):
    docs = []
    for filename in os.listdir(directory):
        if filename.endswith(".docx") and not filename.startswith("~$"):
            file_path = os.path.join(directory, filename)
            sections, metadata = read_docx(file_path)
            docs.append({
                "file_name": filename,
                "sections": sections,
                "metadata": metadata
            })
            print(f"✅ Loaded file: {filename}")
    return docs

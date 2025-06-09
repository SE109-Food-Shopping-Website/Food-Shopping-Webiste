import os
import numpy as np
from pymongo import MongoClient
from pyvi import ViTokenizer
from langchain_huggingface import HuggingFaceEmbeddings
from dotenv import load_dotenv
from sklearn.metrics.pairwise import cosine_similarity
from collections import defaultdict

# Load environment variables
load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

# MongoDB connection
client = MongoClient("mongodb://localhost:27017")
collection = client["rag_db"]["embedding"]

# Vietnamese stopwords (danh sách cơ bản, bạn có thể mở rộng)
vietnamese_stopwords = set([
    "và", "là", "của", "trong", "được", "có", "không", "tại", "với", "một",
    "các", "những", "đã", "đang", "sẽ", "bởi", "từ", "cho", "này", "đó"
])

# Embedding model (sử dụng mô hình hỗ trợ đa ngôn ngữ)
embedding_model = HuggingFaceEmbeddings(model_name="intfloat/multilingual-e5-large")

class Retriever:
    def __init__(self):
        # Load documents from MongoDB
        self.docs = list(collection.find({}))
        self.texts = [doc.get("text", "") for doc in self.docs]
        self.file_names = [doc.get("file_name", "unknown.txt") for doc in self.docs]
        self.headings = [doc.get("section_heading", None) for doc in self.docs]
        self.metadata = [doc.get("metadata", {}) for doc in self.docs]

        # Precompute embeddings for all documents
        self.embeddings = embedding_model.embed_documents(self.texts)

    def preprocess_query(self, query):
        """Preprocess query for Vietnamese using pyvi."""
        tokens = ViTokenizer.tokenize(query.lower()).split()
        return [token for token in tokens if token not in vietnamese_stopwords]

    def get_context(self, query, top_k=20, max_total_chars=50000, metadata_filter=None):
        """Retrieve context using only semantic search with multilingual-e5-large"""
        # Apply metadata filter
        filtered_indices = list(range(len(self.docs)))
        if metadata_filter:
            filtered_indices = [
                i for i, doc in enumerate(self.docs)
                if all(doc.get("metadata", {}).get(k) == v for k, v in metadata_filter.items())
            ]
            if not filtered_indices:
                print("No documents match the metadata filter.")
                return ""

        # Get query embedding
        query_embedding = embedding_model.embed_query(query)

        # Calculate similarities with filtered documents
        filtered_embeddings = [self.embeddings[i] for i in filtered_indices]
        similarities = cosine_similarity([query_embedding], filtered_embeddings)[0]

        # Combine with heading bonus
        tokenized_query = self.preprocess_query(query)
        combined_scores = []
        for i, sim_score in zip(filtered_indices, similarities):
            heading = self.headings[i] or ""
            heading_bonus = 0.1 if any(token in heading.lower() for token in tokenized_query) else 0
            combined_score = sim_score + heading_bonus
            combined_scores.append((i, combined_score))

        # Sort by combined score
        combined_scores.sort(key=lambda x: x[1], reverse=True)

        # Group chunks by document and section
        doc_groups = defaultdict(list)
        for i, score in combined_scores:
            fname = self.file_names[i]
            heading = self.headings[i] or "No Heading"
            doc_groups[(fname, heading)].append((score, self.texts[i], self.docs[i]))

        # Sort groups by max score
        sorted_groups = sorted(
            doc_groups.items(),
            key=lambda x: max(score for score, _, _ in x[1]),
            reverse=True
        )

        context = ""
        total_chars = 0
        selected_chunks = []

        for (fname, heading), chunks in sorted_groups:
            chunks = sorted(chunks, key=lambda x: x[0], reverse=True)
            for score, text, doc in chunks:  # No limit per group
                if total_chars >= max_total_chars:
                    break
                if len(text) + total_chars > max_total_chars:
                    text = text[:max_total_chars - total_chars]
                selected_chunks.append((score, fname, heading, text, doc))
                total_chars += len(text)

        # Sort selected chunks by score and take top_k
        selected_chunks = sorted(selected_chunks, key=lambda x: x[0], reverse=True)[:top_k]

        # Build context
        print("\n--- Top Semantic Chunks (multilingual-e5-large) ---")
        for rank, (score, fname, heading, text, doc) in enumerate(selected_chunks):
            context += f"### {fname} | Section: {heading}\n{text}\n\n"
            print(f"[{rank+1}] Score: {score:.4f} | File: {fname} | Section: {heading} | Preview: {text[:100]}...")

        return context

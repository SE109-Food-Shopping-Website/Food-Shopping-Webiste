from file_loader import load_files_from_directory
from embedding_store import store_embeddings

if __name__ == "__main__":
    # Đọc file từ thư mục
    docs = load_files_from_directory("./files")
    # Lưu embeddings
    store_embeddings(docs)
    print("✅ Done storing embeddings to MongoDB.")

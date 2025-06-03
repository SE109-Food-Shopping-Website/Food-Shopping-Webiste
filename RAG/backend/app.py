from flask import Flask, request, jsonify
from flask_cors import CORS
from agents.orchestrator import Orchestrator
from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)
CORS(app)
orchestrator = Orchestrator()

@app.route('/api/query', methods=['POST'])
def query():
    data = request.get_json()
    query = data.get('query')
    context = data.get('context', "")  # Lấy context từ request, nếu không có sẽ mặc định là chuỗi rỗng

    if not query:
        return jsonify({"error": "No query provided!"}), 400

    # Gọi handle_query với đủ hai đối số query và context
    response = orchestrator.handle_query(query, context)
    return jsonify({"response": response})

@app.route("/", methods=["GET"])
def health_check():
    return "API is running"

if __name__ == '__main__':
    app.run(debug=True)

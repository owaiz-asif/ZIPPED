"""
RAG Service - Flask API for RAG Engine
Provides HTTP endpoints for document upload and querying
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from rag_engine import LegalRAG
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for Next.js frontend

# Initialize RAG engine
rag = LegalRAG()

@app.route("/health", methods=["GET"])
def health():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "documents": len(rag.documents)})

@app.route("/upload", methods=["POST"])
def upload_document():
    """Upload a document (text or file) to the RAG index"""
    try:
        # Check if file was uploaded
        if "file" in request.files:
            file = request.files["file"]
            if file.filename:
                # Read file content
                if file.filename.endswith('.pdf'):
                    # For PDF, use the PDF extraction method
                    import tempfile
                    with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as tmp:
                        file.save(tmp.name)
                        success = rag.add_document_from_pdf(tmp.name, filename=file.filename)
                        os.unlink(tmp.name)
                else:
                    # For text files
                    text = file.read().decode("utf-8")
                    success = rag.add_document(text, filename=file.filename)
                
                if success:
                    return jsonify({
                        "status": "success",
                        "message": f"Document '{file.filename}' added successfully",
                        "total_documents": len(rag.documents)
                    })
                else:
                    return jsonify({"status": "failed", "error": "Failed to add document"}), 400
        
        # Check if text was provided directly
        data = request.get_json()
        if data and "text" in data:
            text = data["text"]
            filename = data.get("filename", "uploaded_text")
            success = rag.add_document(text, filename=filename)
            
            if success:
                return jsonify({
                    "status": "success",
                    "message": f"Document '{filename}' added successfully",
                    "total_documents": len(rag.documents)
                })
            else:
                return jsonify({"status": "failed", "error": "Failed to add document"}), 400
        
        return jsonify({"error": "No file or text provided"}), 400
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/query", methods=["POST"])
def query():
    """Query the RAG system"""
    try:
        data = request.get_json()
        question = data.get("question", "") if data else ""
        
        if not question.strip():
            return jsonify({"error": "Empty query"}), 400
        
        top_k = data.get("top_k", 3) if data else 3
        result = rag.query(question, top_k=top_k)
        
        return jsonify(result)
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/search", methods=["POST"])
def search():
    """Search for similar documents without generating an answer"""
    try:
        data = request.get_json()
        query_text = data.get("query", "") if data else ""
        
        if not query_text.strip():
            return jsonify({"error": "Empty query"}), 400
        
        top_k = data.get("top_k", 3) if data else 3
        results = rag.search(query_text, top_k=top_k)
        
        return jsonify({
            "query": query_text,
            "results": results,
            "count": len(results)
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/documents", methods=["GET"])
def list_documents():
    """List all indexed documents"""
    try:
        # Get unique filenames
        filenames = list(set([doc["filename"] for doc in rag.documents]))
        return jsonify({
            "total_chunks": len(rag.documents),
            "unique_documents": len(filenames),
            "documents": filenames
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)


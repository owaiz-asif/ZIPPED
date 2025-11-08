# ingest_business_data.py

import os
import requests
import json

# --- Configuration ---
RAG_SERVICE_URL = "http://localhost:5000"
UPLOAD_ENDPOINT = f"{RAG_SERVICE_URL}/upload"

# Create these directories and place your .txt files inside them
DATA_DIRS = [
    "data/meeting_summaries",
    "data/schedules"
]

# ---------------------

def ingest_text_file(filepath: str, endpoint: str):
    """Reads a text file and uploads its content to the RAG service."""
    filename = os.path.basename(filepath)
    print(f"-> Attempting to ingest: {filename}")
    
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            text_content = f.read()
        
        if not text_content.strip():
            print(f"   [SKIP] File is empty: {filename}")
            return
        
        # Prepare the data payload for the /upload endpoint (text mode)
        payload = {
            "text": text_content,
            "filename": filename
        }
        
        response = requests.post(endpoint, json=payload, timeout=30)
        
        # The RAG service returns a JSON response
        if response.status_code == 200:
            result = response.json()
            print(f"   [SUCCESS] '{filename}' added. Total documents: {result.get('total_documents', 'N/A')}")
        else:
            try:
                error_details = response.json().get('error', response.text)
            except:
                error_details = response.text
            print(f"   [FAILED] {filename}. Status Code: {response.status_code}. Error: {error_details}")
            
    except requests.exceptions.ConnectionError:
        print(f"   [FATAL] Cannot connect to RAG service at {RAG_SERVICE_URL}. Is rag_service.py running?")
    except requests.exceptions.Timeout:
        print(f"   [FATAL] Request timeout. RAG service may be slow or unresponsive.")
    except FileNotFoundError:
        print(f"   [ERROR] File not found: {filepath}")
    except Exception as e:
        print(f"   [ERROR] An unexpected error occurred with {filename}: {e}")

def check_rag_service():
    """Check if RAG service is running."""
    try:
        response = requests.get(f"{RAG_SERVICE_URL}/health", timeout=5)
        if response.status_code == 200:
            health_data = response.json()
            print(f"✅ RAG Service is running. Documents: {health_data.get('documents', 0)}")
            return True
        else:
            print(f"⚠️ RAG Service responded with status {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print(f"❌ Cannot connect to RAG service at {RAG_SERVICE_URL}")
        print("   Please start the RAG service: python rag_service.py")
        return False
    except Exception as e:
        print(f"❌ Error checking RAG service: {e}")
        return False

if __name__ == "__main__":
    
    # 0. Check if RAG service is running
    print("=" * 60)
    print("RAG Business Data Ingestion Script")
    print("=" * 60)
    print()
    
    if not check_rag_service():
        print("\n⚠️ Please start the RAG service before running this script.")
        print("   Run: python rag_service.py")
        exit(1)
    
    print()
    
    # 1. Ensure the necessary directories exist
    for d in DATA_DIRS:
        os.makedirs(d, exist_ok=True)
        print(f"📁 Directory ready: {d}")
    
    print()
    print("--- Starting RAG Ingestion Process ---")
    print()
    
    files_processed = 0
    files_successful = 0
    files_failed = 0
    
    for data_dir in DATA_DIRS:
        if not os.path.exists(data_dir):
            print(f"⚠️ Directory does not exist: {data_dir}")
            continue
            
        print(f"\n📂 Scanning directory: {data_dir}")
        found_files = False
        
        for root, _, files in os.walk(data_dir):
            for file in files:
                if file.endswith(".txt"):
                    found_files = True
                    file_path = os.path.join(root, file)
                    ingest_text_file(file_path, UPLOAD_ENDPOINT)
                    files_processed += 1
                    
                    # Check if it was successful (basic check)
                    # Note: This is a simple check - actual success is printed in the function
                    
        if not found_files:
            print(f"   (No .txt files found in {data_dir})")
    
    print()
    print("=" * 60)
    print("--- Ingestion Summary ---")
    print("=" * 60)
    
    if files_processed == 0:
        print("\n⚠️ No .txt files found to process.")
        print(f"   Please place your .txt files in:")
        for d in DATA_DIRS:
            print(f"   - {d}/")
        print("\n💡 Tip: You can create sample files or use existing ones.")
    else:
        print(f"\n✅ Files processed: {files_processed}")
        print("   Check the output above for success/failure status of each file.")
    
    print()


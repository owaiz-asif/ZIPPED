#!/usr/bin/env python3
"""
Comprehensive RAG Database Population Script
Ingests all data files from the data directory into the RAG system
"""

import os
import requests
import json
import sys
from pathlib import Path

# Configuration
RAG_SERVICE_URL = os.environ.get("RAG_SERVICE_URL", "http://localhost:5000")
UPLOAD_ENDPOINT = f"{RAG_SERVICE_URL}/upload"
HEALTH_ENDPOINT = f"{RAG_SERVICE_URL}/health"
DOCUMENTS_ENDPOINT = f"{RAG_SERVICE_URL}/documents"

# Data directories to scan
DATA_DIRS = [
    "data/meeting_summaries",
    "data/schedules",
    "data/business_policies"
]

def check_rag_service():
    """Check if RAG service is running and return document count"""
    try:
        response = requests.get(HEALTH_ENDPOINT, timeout=5)
        if response.status_code == 200:
            health_data = response.json()
            doc_count = health_data.get('documents', 0)
            print(f"✅ RAG Service is running. Current documents: {doc_count}")
            return True, doc_count
        else:
            print(f"⚠️ RAG Service responded with status {response.status_code}")
            return False, 0
    except requests.exceptions.ConnectionError:
        print(f"❌ Cannot connect to RAG service at {RAG_SERVICE_URL}")
        print("   Please start the RAG service: python rag_service.py")
        return False, 0
    except Exception as e:
        print(f"❌ Error checking RAG service: {e}")
        return False, 0

def ingest_text_file(filepath: str, endpoint: str):
    """Reads a text file and uploads its content to the RAG service"""
    filename = os.path.basename(filepath)
    print(f"  📄 Ingesting: {filename}")
    
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            text_content = f.read()
        
        if not text_content.strip():
            print(f"     [SKIP] File is empty: {filename}")
            return False
        
        # Prepare the data payload
        payload = {
            "text": text_content,
            "filename": filename
        }
        
        response = requests.post(endpoint, json=payload, timeout=60)
        
        if response.status_code == 200:
            result = response.json()
            total_docs = result.get('total_documents', 'N/A')
            print(f"     ✅ Success! Total documents: {total_docs}")
            return True
        else:
            try:
                error_details = response.json().get('error', response.text)
            except:
                error_details = response.text
            print(f"     ❌ Failed. Status: {response.status_code}. Error: {error_details}")
            return False
            
    except requests.exceptions.ConnectionError:
        print(f"     ❌ Cannot connect to RAG service")
        return False
    except FileNotFoundError:
        print(f"     ❌ File not found: {filepath}")
        return False
    except Exception as e:
        print(f"     ❌ Unexpected error: {e}")
        return False

def list_documents():
    """List all documents in the RAG database"""
    try:
        response = requests.get(DOCUMENTS_ENDPOINT, timeout=5)
        if response.status_code == 200:
            data = response.json()
            return data
        return None
    except Exception as e:
        print(f"Warning: Could not list documents: {e}")
        return None

def main():
    print("=" * 70)
    print("RAG Database Population Script")
    print("=" * 70)
    print()
    
    # Check if RAG service is running
    service_running, initial_doc_count = check_rag_service()
    if not service_running:
        print("\n⚠️ Please start the RAG service before running this script.")
        print("   Run: python rag_service.py")
        print("\n   Or in a separate terminal:")
        print("   cd ZIPPED")
        print("   python rag_service.py")
        sys.exit(1)
    
    print()
    
    # Ensure directories exist
    print("📁 Checking data directories...")
    for d in DATA_DIRS:
        if os.path.exists(d):
            print(f"   ✅ {d}")
        else:
            print(f"   ⚠️  {d} (will be created if needed)")
            os.makedirs(d, exist_ok=True)
    
    print()
    print("=" * 70)
    print("Starting RAG Ingestion Process")
    print("=" * 70)
    print()
    
    files_processed = 0
    files_successful = 0
    files_failed = 0
    
    # Process each data directory
    for data_dir in DATA_DIRS:
        if not os.path.exists(data_dir):
            print(f"⚠️ Directory does not exist: {data_dir}")
            continue
            
        print(f"\n📂 Processing directory: {data_dir}")
        found_files = False
        
        # Walk through directory and process all .txt files
        for root, _, files in os.walk(data_dir):
            for file in sorted(files):
                if file.endswith(".txt"):
                    found_files = True
                    file_path = os.path.join(root, file)
                    success = ingest_text_file(file_path, UPLOAD_ENDPOINT)
                    files_processed += 1
                    if success:
                        files_successful += 1
                    else:
                        files_failed += 1
        
        if not found_files:
            print(f"   (No .txt files found in {data_dir})")
    
    print()
    print("=" * 70)
    print("Ingestion Summary")
    print("=" * 70)
    print(f"\n📊 Files processed: {files_processed}")
    print(f"✅ Files successful: {files_successful}")
    print(f"❌ Files failed: {files_failed}")
    
    # Get final document count
    _, final_doc_count = check_rag_service()
    new_docs = final_doc_count - initial_doc_count
    print(f"\n📚 Total documents in RAG: {final_doc_count}")
    if new_docs > 0:
        print(f"📈 New documents added: {new_docs}")
    
    # List all documents
    print("\n" + "=" * 70)
    print("Indexed Documents")
    print("=" * 70)
    doc_info = list_documents()
    if doc_info:
        print(f"\nTotal chunks: {doc_info.get('total_chunks', 0)}")
        print(f"Unique documents: {doc_info.get('unique_documents', 0)}")
        if doc_info.get('documents'):
            print("\nDocument files:")
            for doc in sorted(doc_info['documents']):
                print(f"  • {doc}")
    else:
        print("\n⚠️ Could not retrieve document list")
    
    print()
    print("=" * 70)
    print("✅ Population complete!")
    print("=" * 70)
    print("\n💡 You can now query the RAG system through the AI Assistant.")
    print("   Try asking questions like:")
    print("   - 'What meetings are scheduled for February?'")
    print("   - 'What was discussed in the product launch meeting?'")
    print("   - 'What is the project timeline for Q1?'")
    print()

if __name__ == "__main__":
    main()


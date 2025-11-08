"""
Quick script to upload meeting schedule to RAG
Run this after RAG service is started
"""
import requests
import json

# Read the meeting schedule file
with open("meeting_schedule_guide.txt", "r", encoding="utf-8") as f:
    content = f.read()

# Upload to RAG service
try:
    response = requests.post(
        "http://localhost:5000/upload",
        json={"text": content, "filename": "meeting_schedule_guide.txt"},
        timeout=30
    )
    
    if response.status_code == 200:
        result = response.json()
        print("✅ Successfully uploaded meeting schedule to RAG!")
        print(f"   Total documents: {result.get('total_documents', 0)}")
    else:
        print(f"❌ Error: {response.status_code}")
        print(response.text)
except requests.exceptions.ConnectionError:
    print("❌ Cannot connect to RAG service.")
    print("   Make sure RAG service is running: python rag_service.py")
except Exception as e:
    print(f"❌ Error: {e}")


"""
rag_engine.py — Fixed version with library compatibility
Add this at the very top of your rag_engine.py file (before other imports)
"""

import warnings
import os

# Suppress known deprecation warnings from sentence-transformers
warnings.filterwarnings("ignore", category=FutureWarning)
warnings.filterwarnings("ignore", message=".*clean_up_tokenization_spaces.*")
warnings.filterwarnings("ignore", message=".*model_name_or_path.*")

# Set environment variable to suppress tokenizer warnings
os.environ["TOKENIZERS_PARALLELISM"] = "false"

# Now continue with your regular imports...
import json
import logging
import argparse
from typing import List, Dict, Optional
from datetime import datetime
import re

try:
    import faiss
    import numpy as np
    from sentence_transformers import SentenceTransformer
    
    # Updated transformers import with deprecation handling
    from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
    from transformers import logging as transformers_logging
    transformers_logging.set_verbosity_error()  # Suppress transformers warnings
    
    import PyPDF2
except Exception as e:
    raise RuntimeError(f"Missing Python dependencies: {e}")

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO, format='[%(levelname)s] %(message)s')


def _chunk_text(text: str, chunk_size: int = 1000, overlap: int = 200) -> List[str]:
    """Smart text chunking with sentence boundary detection."""
    if not text:
        return []
    
    text = text.replace('\r\n', '\n')
    sentences = re.split(r'(?<=[.!?])\s+', text)
    
    chunks = []
    current_chunk = ""
    
    for sentence in sentences:
        if len(current_chunk) + len(sentence) < chunk_size:
            current_chunk += sentence + " "
        else:
            if current_chunk.strip():
                chunks.append(current_chunk.strip())
            current_chunk = sentence + " "
    
    if current_chunk.strip():
        chunks.append(current_chunk.strip())
    
    return chunks if chunks else [text]


class QueryClassifier:
    """Enhanced query classification."""
    
    QUERY_TYPES = {
        'meeting': ['meeting', 'call', 'discussion', 'standup', 'sync', 'review', 'presentation'],
        'schedule': ['schedule', 'calendar', 'time', 'when', 'date', 'appointment', 'weekly', 'daily'],
        'task': ['task', 'todo', 'action', 'deliverable', 'deadline', 'priority', 'items'],
        'analysis': ['analyze', 'summarize', 'insights', 'trends', 'overview', 'report', 'summary'],
        'decision': ['decide', 'recommend', 'suggest', 'should', 'best', 'optimal', 'choose'],
        'status': ['status', 'progress', 'update', 'current', 'where are we', 'state']
    }
    
    @classmethod
    def classify(cls, query: str) -> List[str]:
        query_lower = query.lower()
        matches = []
        
        for query_type, keywords in cls.QUERY_TYPES.items():
            if any(keyword in query_lower for keyword in keywords):
                matches.append(query_type)
        
        return matches if matches else ['general']


class LegalRAG:
    """Business Assistant RAG Engine with compatibility fixes."""

    def __init__(
        self,
        vector_store_path: str = "vector_store/business_faiss.index",
        metadata_path: str = "vector_store/business_metadata.json",
        embed_model_name: str = "sentence-transformers/all-MiniLM-L6-v2",
        gen_model_name: str = "pszemraj/led-large-book-summary",
    ):
        self.vector_store_path = vector_store_path
        self.metadata_path = metadata_path
        self.embed_model_name = embed_model_name
        self.gen_model_name = gen_model_name

        logger.info("Initializing AI Heir Business Assistant...")
        
        # Load embedder with explicit device setting
        self.embedder = SentenceTransformer(self.embed_model_name, device='cpu')
        self.dimension = self.embedder.get_sentence_embedding_dimension()

        # Try to load generation model with better error handling
        try:
            logger.info("Loading text generation model (this may take a moment)...")
            self.tokenizer = AutoTokenizer.from_pretrained(
                self.gen_model_name,
                clean_up_tokenization_spaces=True  # Explicit parameter to avoid warning
            )
            self.model = AutoModelForSeq2SeqLM.from_pretrained(self.gen_model_name)
            logger.info("✓ Generation model loaded successfully.")
        except Exception as e:
            logger.warning(f"⚠ Generation model unavailable ({e}). Using enhanced fallback mode.")
            self.tokenizer = None
            self.model = None

        self.index = faiss.IndexFlatL2(self.dimension)
        self.documents: List[dict] = []
        self._load_existing_data()
        
        logger.info(f"✓ AI Heir ready with {len(self.documents)} document chunks.")

    def _load_existing_data(self):
        """Load existing vector index and metadata."""
        if os.path.exists(self.vector_store_path) and os.path.exists(self.metadata_path):
            try:
                self.index = faiss.read_index(self.vector_store_path)
                with open(self.metadata_path, "r", encoding="utf-8") as f:
                    self.documents = json.load(f)
                logger.info(f"✓ Loaded {len(self.documents)} document chunks from index.")
            except Exception as e:
                logger.warning(f"Failed to load existing data: {e}")

    def _save_index(self):
        """Persist vector index and metadata to disk."""
        os.makedirs(os.path.dirname(self.vector_store_path), exist_ok=True)
        faiss.write_index(self.index, self.vector_store_path)
        with open(self.metadata_path, "w", encoding="utf-8") as f:
            json.dump(self.documents, f, indent=2)

    def add_document(self, text: str, filename: str = None, 
                    doc_type: str = "general", chunk_size: int = 1200, 
                    overlap: int = 200) -> bool:
        """Add document with enhanced metadata."""
        try:
            if not text or not text.strip():
                logger.warning("Skipped empty document.")
                return False

            chunks = _chunk_text(text, chunk_size=chunk_size, overlap=overlap)
            if not chunks:
                chunks = [text]

            embeddings = self.embedder.encode(
                chunks, 
                convert_to_numpy=True, 
                show_progress_bar=False,
                normalize_embeddings=True
            )
            embeddings = np.array(embeddings).astype("float32")

            if not hasattr(self.index, "d") or self.index.d != embeddings.shape[1]:
                self.index = faiss.IndexFlatL2(embeddings.shape[1])

            self.index.add(embeddings)

            timestamp = datetime.now().isoformat()
            for chunk in chunks:
                self.documents.append({
                    "filename": filename or "unknown",
                    "content": chunk,
                    "type": doc_type,
                    "timestamp": timestamp
                })

            self._save_index()
            logger.info(f"✓ Added '{filename}' ({doc_type}) with {len(chunks)} chunks.")
            return True
        except Exception as e:
            logger.error(f"Failed to add document: {e}")
            return False

    def add_document_from_pdf(self, pdf_path: str, filename: str = None, 
                             doc_type: str = "general") -> bool:
        """Extract and index PDF document."""
        if not os.path.exists(pdf_path):
            logger.error(f"PDF not found: {pdf_path}")
            return False

        try:
            reader = PyPDF2.PdfReader(pdf_path)
            pages = []
            for p in reader.pages:
                try:
                    pages.append(p.extract_text() or "")
                except Exception:
                    pages.append("")
            text = "\n".join(pages)
            return self.add_document(text, filename=filename or os.path.basename(pdf_path), 
                                    doc_type=doc_type)
        except Exception as e:
            logger.error(f"Failed to read PDF: {e}")
            return False

    def search(self, query: str, top_k: int = 5, doc_type_filter: Optional[str] = None) -> List[dict]:
        """Search with optional document type filtering."""
        if not self.documents:
            logger.warning("No documents indexed.")
            return []
        
        qvec = self.embedder.encode(
            [query], 
            convert_to_numpy=True,
            normalize_embeddings=True
        )
        qvec = np.array(qvec).astype("float32")
        
        try:
            search_k = top_k * 3 if doc_type_filter else top_k
            distances, indices = self.index.search(qvec, min(search_k, len(self.documents)))
        except Exception as e:
            logger.error(f"Search failed: {e}")
            return []

        results = []
        for idx, dist in zip(indices[0], distances[0]):
            if idx < 0 or idx >= len(self.documents):
                continue
            
            doc = self.documents[idx]
            
            if doc_type_filter and doc.get('type') != doc_type_filter:
                continue
                
            results.append({
                "content": doc["content"],
                "filename": doc["filename"],
                "type": doc.get("type", "general"),
                "score": float(dist),
                "timestamp": doc.get("timestamp", "unknown")
            })
            
            if len(results) >= top_k:
                break
        
        return results

    def _extract_action_items(self, text: str) -> List[str]:
        """Extract action items."""
        action_patterns = [
            r'(?:TODO|Action|Task|Action Item|Deliverable):\s*(.+?)(?:\n|$)',
            r'(?:Need to|Must|Should|Will|Plan to)\s+(.+?)(?:\.|$)',
            r'(?:Follow up|Complete|Finish|Prepare|Schedule|Review)\s+(.+?)(?:\.|$)',
            r'(?:Assigned to|Owner:)\s*\w+\s*[-:]\s*(.+?)(?:\.|$)'
        ]
        
        actions = []
        for pattern in action_patterns:
            matches = re.finditer(pattern, text, re.IGNORECASE | re.MULTILINE)
            for match in matches:
                action = match.group(1).strip()
                if action and 10 < len(action) < 200:
                    actions.append(action)
        
        seen = set()
        unique_actions = []
        for action in actions:
            action_lower = action.lower()
            if action_lower not in seen:
                seen.add(action_lower)
                unique_actions.append(action)
        
        return unique_actions[:5]

    def _analyze_sentiment(self, text: str) -> Dict[str, str]:
        """Enhanced sentiment analysis."""
        positive_indicators = {
            'strong': ['success', 'excellent', 'achieved', 'completed', 'great', 'outstanding'],
            'moderate': ['good', 'progress', 'positive', 'improved', 'effective', 'productive']
        }
        
        negative_indicators = {
            'strong': ['failed', 'critical', 'urgent', 'blocker', 'crisis', 'delayed'],
            'moderate': ['issue', 'problem', 'concern', 'risk', 'challenge', 'difficult']
        }
        
        text_lower = text.lower()
        
        pos_strong = sum(1 for word in positive_indicators['strong'] if word in text_lower)
        pos_moderate = sum(1 for word in positive_indicators['moderate'] if word in text_lower)
        neg_strong = sum(1 for word in negative_indicators['strong'] if word in text_lower)
        neg_moderate = sum(1 for word in negative_indicators['moderate'] if word in text_lower)
        
        pos_score = (pos_strong * 2) + pos_moderate
        neg_score = (neg_strong * 2) + neg_moderate
        
        if pos_score > neg_score + 2:
            return {
                "label": "Positive",
                "explanation": "The information indicates successful outcomes and positive progress."
            }
        elif neg_score > pos_score + 2:
            return {
                "label": "Negative", 
                "explanation": "There are challenges and concerns that need attention."
            }
        elif neg_score > pos_score:
            return {
                "label": "Cautious",
                "explanation": "The situation has some concerns but appears manageable."
            }
        else:
            return {
                "label": "Neutral",
                "explanation": "The information is factual and balanced."
            }

    def _extract_key_points(self, context_docs: List[dict], max_points: int = 5) -> List[str]:
        """Extract important sentences."""
        all_text = " ".join([doc["content"] for doc in context_docs])
        sentences = re.split(r'(?<=[.!?])\s+', all_text)
        
        scored_sentences = []
        important_keywords = [
            'important', 'key', 'critical', 'must', 'should', 'will',
            'decided', 'agreed', 'planned', 'scheduled', 'completed',
            'deadline', 'priority', 'focus', 'goal', 'objective'
        ]
        
        for sentence in sentences:
            word_count = len(sentence.split())
            if word_count < 5 or word_count > 30:
                continue
            
            score = 0
            sentence_lower = sentence.lower()
            
            for keyword in important_keywords:
                if keyword in sentence_lower:
                    score += 1
            
            if re.search(r'\d+', sentence):
                score += 0.5
            
            capital_words = re.findall(r'\b[A-Z][a-z]+\b', sentence)
            score += len(capital_words) * 0.3
            
            if score > 0:
                scored_sentences.append((score, sentence.strip()))
        
        scored_sentences.sort(reverse=True, key=lambda x: x[0])
        return [sent for score, sent in scored_sentences[:max_points]]

    def generate_answer(self, query: str, context_docs: List[dict] = None) -> str:
        """Generate polished response."""
        if context_docs is None:
            context_docs = self.search(query, top_k=5)
        
        if not context_docs:
            return self._format_no_data_response(query)

        query_types = QueryClassifier.classify(query)
        context_text = " ".join([doc["content"] for doc in context_docs])
        sentiment = self._analyze_sentiment(context_text)
        action_items = self._extract_action_items(context_text)
        
        return self._format_professional_response(
            query, context_docs, query_types, sentiment, action_items
        )

    def _format_no_data_response(self, query: str) -> str:
        """Response when no data found."""
        return f"""**Sentiment Assessment:** Neutral - No relevant information found.

## 🔍 No Information Available

I couldn't find documents related to: "{query}"

### 💡 Suggestions:
- Upload relevant documents
- Try different keywords
- Check if documents were ingested properly

---
💡 *Add documents to get started!*"""

    def _format_professional_response(
        self, query: str, context_docs: List[dict], 
        query_types: List[str], sentiment: Dict[str, str], 
        action_items: List[str]
    ) -> str:
        """Format professional response."""
        sections = []
        
        # Sentiment
        sections.append(f"**Sentiment Assessment:** {sentiment['label']} - {sentiment['explanation']}")
        sections.append("")
        
        # Header
        if 'meeting' in query_types:
            sections.append("## 📋 Meeting Summary")
        elif 'schedule' in query_types:
            sections.append("## 📅 Schedule Information")
        elif 'task' in query_types:
            sections.append("## ✅ Task Overview")
        elif 'analysis' in query_types:
            sections.append("## 📊 Analysis")
        else:
            sections.append("## 📌 Information Summary")
        sections.append("")
        
        # Key points
        sections.append("### Key Points:")
        sections.append("")
        key_points = self._extract_key_points(context_docs, max_points=5)
        for i, point in enumerate(key_points, 1):
            sections.append(f"{i}. {point}")
        sections.append("")
        
        # Action items
        if action_items:
            sections.append("### 🎯 Action Items:")
            sections.append("")
            for item in action_items:
                sections.append(f"- {item}")
            sections.append("")
        
        # Sources
        unique_files = list(set([doc.get('filename', 'unknown') for doc in context_docs]))
        sections.append("### 📚 Sources:")
        sections.append("")
        for filename in unique_files[:3]:
            sections.append(f"- {filename}")
        sections.append("")
        
        sections.append("---")
        sections.append("💡 *Need more details? Ask me follow-up questions!*")
        
        return "\n".join(sections)

    def query(self, user_query: str, top_k: int = 5) -> dict:
        """Complete RAG pipeline."""
        try:
            query_types = QueryClassifier.classify(user_query)
            context_docs = self.search(user_query, top_k=top_k)
            answer = self.generate_answer(user_query, context_docs)
            
            return {
                "query": user_query,
                "answer": answer,
                "sources": context_docs,
                "query_types": query_types,
                "document_count": len(self.documents),
                "timestamp": datetime.now().isoformat()
            }
        except Exception as e:
            logger.error(f"RAG pipeline error: {e}")
            return {
                "query": user_query,
                "answer": f"⚠️ Error: {str(e)}",
                "sources": [],
                "query_types": ["error"],
                "document_count": len(self.documents),
                "timestamp": datetime.now().isoformat()
            }


def main():
    """CLI for business assistant."""
    parser = argparse.ArgumentParser(description="AI Heir Business Assistant")
    sub = parser.add_subparsers(dest="cmd")

    p_ingest = sub.add_parser("ingest", help="Ingest document")
    p_ingest.add_argument("path")
    p_ingest.add_argument("--name", default=None)
    p_ingest.add_argument("--type", default="general")

    p_query = sub.add_parser("query", help="Query assistant")
    p_query.add_argument("text")
    p_query.add_argument("--k", type=int, default=5)

    p_stats = sub.add_parser("stats", help="Show statistics")

    args = parser.parse_args()
    rag = LegalRAG()

    if args.cmd == "ingest":
        success = rag.add_document_from_pdf(args.path, filename=args.name, doc_type=args.type)
        logger.info("✅ Ingest completed." if success else "❌ Ingest failed.")
    elif args.cmd == "query":
        result = rag.query(args.text, top_k=args.k)
        print("\n" + "="*70)
        print(f"Query: {result['query']}")
        print(f"Classification: {', '.join(result['query_types']).title()}")
        print("="*70 + "\n")
        print(result['answer'])
        print("\n" + "="*70)
        print(f"✓ Retrieved from {len(result['sources'])} chunks")
        print("="*70 + "\n")
    elif args.cmd == "stats":
        print(f"\n📊 AI Heir Statistics")
        print("="*50)
        print(f"Total chunks: {len(rag.documents)}")
        
        types = {}
        for doc in rag.documents:
            doc_type = doc.get('type', 'general')
            types[doc_type] = types.get(doc_type, 0) + 1
        
        print(f"\nBy type:")
        for doc_type, count in sorted(types.items()):
            print(f"  • {doc_type}: {count}")
        
        unique_files = len(set([doc.get('filename') for doc in rag.documents]))
        print(f"\nUnique files: {unique_files}")
        print("="*50 + "\n")
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
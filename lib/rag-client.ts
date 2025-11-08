/**
 * RAG Client - Helper functions for interacting with RAG API
 */

export interface RAGQueryResult {
  query: string
  answer: string
  sources: Array<{
    content: string
    filename: string
    score: number
  }>
}

export interface RAGSearchResult {
  query: string
  results: Array<{
    content: string
    filename: string
    score: number
  }>
  count: number
}

export interface RAGUploadResult {
  status: string
  message: string
  total_documents: number
}

/**
 * Query the RAG system with a question
 */
export async function queryRAG(question: string, topK: number = 3): Promise<RAGQueryResult> {
  try {
    const response = await fetch("/api/rag/query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question, top_k: topK }),
      // Add timeout
      signal: AbortSignal.timeout(30000), // 30 second timeout
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `RAG query failed: ${response.statusText}`)
    }

    return response.json()
  } catch (error: any) {
    // Handle timeout or network errors
    if (error.name === 'AbortError' || error.name === 'TimeoutError') {
      throw new Error("RAG service timeout. Please ensure the RAG service is running on port 5000.")
    }
    if (error.message.includes('fetch')) {
      throw new Error("Cannot connect to RAG service. Please ensure it's running on port 5000.")
    }
    throw error
  }
}

/**
 * Search the RAG system for similar documents
 */
export async function searchRAG(query: string, topK: number = 3): Promise<RAGSearchResult> {
  const response = await fetch("/api/rag/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, top_k: topK }),
  })

  if (!response.ok) {
    throw new Error(`RAG search failed: ${response.statusText}`)
  }

  return response.json()
}

/**
 * Upload a text document to the RAG system
 */
export async function uploadTextToRAG(text: string, filename?: string): Promise<RAGUploadResult> {
  const formData = new FormData()
  formData.append("text", text)
  if (filename) {
    formData.append("filename", filename)
  }

  const response = await fetch("/api/rag/upload", {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    throw new Error(`RAG upload failed: ${response.statusText}`)
  }

  return response.json()
}

/**
 * Upload a file to the RAG system
 */
export async function uploadFileToRAG(file: File): Promise<RAGUploadResult> {
  const formData = new FormData()
  formData.append("file", file)

  const response = await fetch("/api/rag/upload", {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    throw new Error(`RAG upload failed: ${response.statusText}`)
  }

  return response.json()
}


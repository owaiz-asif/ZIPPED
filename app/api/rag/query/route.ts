import { type NextRequest, NextResponse } from "next/server"

const RAG_SERVICE_URL = process.env.RAG_SERVICE_URL || "http://localhost:5000"

export async function POST(request: NextRequest) {
  try {
    const { question, top_k } = await request.json()

    if (!question || !question.trim()) {
      return NextResponse.json({ error: "Question is required" }, { status: 400 })
    }

    try {
      const response = await fetch(`${RAG_SERVICE_URL}/query`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: question.trim(),
          top_k: top_k || 3,
        }),
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: "RAG service error" }))
        return NextResponse.json(
          { error: error.error || "Failed to query RAG service" },
          { status: response.status },
        )
      }

      const result = await response.json()
      return NextResponse.json(result)
    } catch (err: any) {
      console.warn("[RAG] Service unavailable, returning fallback response:", err?.message)
      // Fallback response when RAG service is not available
      return NextResponse.json({
        query: question,
        answer: "I'm currently unable to access my knowledge base. Please ensure the RAG service is running.",
        sources: [],
      })
    }
  } catch (error) {
    console.error("[RAG] Query error:", error)
    return NextResponse.json({ error: "Failed to process query" }, { status: 500 })
  }
}


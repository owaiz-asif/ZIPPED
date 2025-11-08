import { type NextRequest, NextResponse } from "next/server"

const RAG_SERVICE_URL = process.env.RAG_SERVICE_URL || "http://localhost:5000"

export async function POST(request: NextRequest) {
  try {
    const { query, top_k } = await request.json()

    if (!query || !query.trim()) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 })
    }

    try {
      const response = await fetch(`${RAG_SERVICE_URL}/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: query.trim(),
          top_k: top_k || 3,
        }),
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: "RAG service error" }))
        return NextResponse.json(
          { error: error.error || "Failed to search RAG service" },
          { status: response.status },
        )
      }

      const result = await response.json()
      return NextResponse.json(result)
    } catch (err: any) {
      console.warn("[RAG] Service unavailable, returning empty results:", err?.message)
      return NextResponse.json({
        query: query,
        results: [],
        count: 0,
      })
    }
  } catch (error) {
    console.error("[RAG] Search error:", error)
    return NextResponse.json({ error: "Failed to process search" }, { status: 500 })
  }
}


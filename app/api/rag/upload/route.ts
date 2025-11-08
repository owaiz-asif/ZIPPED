import { type NextRequest, NextResponse } from "next/server"

const RAG_SERVICE_URL = process.env.RAG_SERVICE_URL || "http://localhost:5000"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null
    const text = formData.get("text") as string | null
    const filename = formData.get("filename") as string | null

    if (!file && !text) {
      return NextResponse.json({ error: "File or text is required" }, { status: 400 })
    }

    try {
      let response: Response

      if (file) {
        // Upload file to RAG service
        const uploadFormData = new FormData()
        uploadFormData.append("file", file)

        response = await fetch(`${RAG_SERVICE_URL}/upload`, {
          method: "POST",
          body: uploadFormData,
        })
      } else if (text) {
        // Upload text directly
        response = await fetch(`${RAG_SERVICE_URL}/upload`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: text,
            filename: filename || "uploaded_text",
          }),
        })
      } else {
        return NextResponse.json({ error: "Invalid request" }, { status: 400 })
      }

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: "RAG service error" }))
        return NextResponse.json(
          { error: error.error || "Failed to upload to RAG service" },
          { status: response.status },
        )
      }

      const result = await response.json()
      return NextResponse.json(result)
    } catch (err: any) {
      console.warn("[RAG] Service unavailable:", err?.message)
      return NextResponse.json(
        { error: "RAG service is not available. Please ensure it's running on port 5000." },
        { status: 503 },
      )
    }
  } catch (error) {
    console.error("[RAG] Upload error:", error)
    return NextResponse.json({ error: "Failed to process upload" }, { status: 500 })
  }
}


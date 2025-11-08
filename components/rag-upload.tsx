"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, FileText, CheckCircle2, AlertCircle } from "lucide-react"
import { uploadTextToRAG, uploadFileToRAG } from "@/lib/rag-client"

export default function RAGUpload() {
  const [text, setText] = useState("")
  const [filename, setFilename] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState<{ type: "success" | "error" | null; message: string }>({
    type: null,
    message: "",
  })
  const [isUploading, setIsUploading] = useState(false)

  const handleTextUpload = async () => {
    if (!text.trim()) {
      setStatus({ type: "error", message: "Please enter some text to upload" })
      return
    }

    setIsUploading(true)
    setStatus({ type: null, message: "" })

    try {
      const result = await uploadTextToRAG(text, filename || undefined)
      setStatus({
        type: "success",
        message: `Document uploaded successfully! Total documents: ${result.total_documents}`,
      })
      setText("")
      setFilename("")
    } catch (error: any) {
      setStatus({
        type: "error",
        message: error.message || "Failed to upload document. Make sure the RAG service is running.",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileUpload = async () => {
    if (!file) {
      setStatus({ type: "error", message: "Please select a file to upload" })
      return
    }

    setIsUploading(true)
    setStatus({ type: null, message: "" })

    try {
      const result = await uploadFileToRAG(file)
      setStatus({
        type: "success",
        message: `File "${file.name}" uploaded successfully! Total documents: ${result.total_documents}`,
      })
      setFile(null)
    } catch (error: any) {
      setStatus({
        type: "error",
        message: error.message || "Failed to upload file. Make sure the RAG service is running.",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5 text-purple-500" />
          Upload to Knowledge Base
        </CardTitle>
        <CardDescription>Add documents to enhance AI Heir's responses with RAG</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Text Upload */}
        <div className="space-y-2">
          <label className="text-sm text-slate-300">Upload Text</label>
          <input
            type="text"
            placeholder="Document name (optional)"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 mb-2"
          />
          <textarea
            placeholder="Paste or type document content here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 min-h-32"
          />
          <Button
            onClick={handleTextUpload}
            disabled={isUploading || !text.trim()}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            <FileText className="w-4 h-4 mr-2" />
            Upload Text
          </Button>
        </div>

        {/* File Upload */}
        <div className="space-y-2">
          <label className="text-sm text-slate-300">Upload File</label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            accept=".txt,.pdf,.md"
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700"
          />
          <Button
            onClick={handleFileUpload}
            disabled={isUploading || !file}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload File
          </Button>
        </div>

        {/* Status Message */}
        {status.type && (
          <div
            className={`p-3 rounded-lg flex items-start gap-2 ${
              status.type === "success"
                ? "bg-green-500/10 border border-green-500/30"
                : "bg-red-500/10 border border-red-500/30"
            }`}
          >
            {status.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            )}
            <p className={`text-sm ${status.type === "success" ? "text-green-300" : "text-red-300"}`}>
              {status.message}
            </p>
          </div>
        )}

        <div className="text-xs text-slate-400 pt-2 border-t border-slate-700">
          <p>💡 Tip: Upload meeting notes, project docs, or any text to enhance AI responses.</p>
          <p className="mt-1">Make sure the RAG service is running on port 5000.</p>
        </div>
      </CardContent>
    </Card>
  )
}


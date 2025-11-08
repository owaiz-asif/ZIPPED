"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mic, MicOff, Play, Square, Upload, FileText, Mail, Download, Sparkles } from "lucide-react"

const DEMO_USER_ID = 1

interface MeetingSummary {
  id: string
  title: string
  transcript: string
  keyTakeaways: string[]
  actionItems: string[]
  decisions: string[]
  unresolvedTopics: string[]
  insights: {
    mostDiscussedTopic: string
    sentiment: string
    duration: number
    participantCount: number
  }
  createdAt: string
}

export default function MeetingAssistant() {
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [transcript, setTranscript] = useState("")
  const [summary, setSummary] = useState<MeetingSummary | null>(null)
  const [meetingTitle, setMeetingTitle] = useState("")
  const [meetings, setMeetings] = useState<MeetingSummary[]>([])
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    loadPastMeetings()
  }, [])

  useEffect(() => {
    if (isRecording) {
      intervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRecording])

  const loadPastMeetings = async () => {
    try {
      const response = await fetch(`/api/meetings/transcripts?userId=${DEMO_USER_ID}`)
      if (response.ok) {
        const data = await response.json()
        setMeetings(data.meetings || [])
      }
    } catch (error) {
      console.error("Error loading meetings:", error)
    }
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" })
        await processAudio(audioBlob)
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)
      setTranscript("")
      setSummary(null)
    } catch (error) {
      console.error("Error starting recording:", error)
      alert("Could not access microphone. Please check permissions.")
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("audio/")) {
      alert("Please upload an audio file")
      return
    }

    setIsProcessing(true)
    setTranscript("")
    setSummary(null)

    try {
      await processAudio(file)
    } catch (error) {
      console.error("Error processing file:", error)
      alert("Failed to process audio file")
    } finally {
      setIsProcessing(false)
    }
  }

  const processAudio = async (audioBlob: Blob) => {
    setIsProcessing(true)
    try {
      // Create FormData for file upload
      const formData = new FormData()
      formData.append("audio", audioBlob)
      formData.append("userId", DEMO_USER_ID.toString())
      if (meetingTitle) {
        formData.append("title", meetingTitle)
      }

      // Step 1: Transcribe audio
      const transcribeResponse = await fetch("/api/meetings/transcribe", {
        method: "POST",
        body: formData,
      })

      if (!transcribeResponse.ok) {
        throw new Error("Transcription failed")
      }

      const transcribeData = await transcribeResponse.json()
      setTranscript(transcribeData.transcript)

      // Step 2: Generate summary
      const summaryResponse = await fetch("/api/meetings/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transcript: transcribeData.transcript,
          userId: DEMO_USER_ID,
          title: meetingTitle || transcribeData.title,
        }),
      })

      if (!summaryResponse.ok) {
        throw new Error("Summarization failed")
      }

      const summaryData = await summaryResponse.json()
      setSummary(summaryData.summary)
      
      // Reload meetings list
      await loadPastMeetings()
    } catch (error) {
      console.error("Error processing audio:", error)
      alert("Failed to process meeting audio. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const sendSummaryEmail = async (meetingId: string) => {
    try {
      const response = await fetch("/api/meetings/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ meetingId, userId: DEMO_USER_ID }),
      })

      if (response.ok) {
        alert("Summary email sent successfully!")
      } else {
        alert("Failed to send email")
      }
    } catch (error) {
      console.error("Error sending email:", error)
      alert("Failed to send email")
    }
  }

  return (
    <div className="space-y-6">
      {/* Recording Interface */}
      <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border-slate-700/50 hover:border-slate-600/50 transition-all">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-100">
            <Sparkles className="w-5 h-5 text-blue-400" />
            AI Meeting Assistant
          </CardTitle>
          <CardDescription className="text-slate-400">
            Record or upload meeting audio for automatic transcription and summarization
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm text-slate-300 mb-2 block">Meeting Title (Optional)</label>
            <input
              type="text"
              placeholder="e.g., Team Standup, Client Meeting"
              value={meetingTitle}
              onChange={(e) => setMeetingTitle(e.target.value)}
              className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
              suppressHydrationWarning
            />
          </div>

          <div className="flex items-center gap-4">
            {!isRecording && !isProcessing ? (
              <>
                <Button
                  onClick={startRecording}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold gap-2"
                >
                  <Mic className="w-4 h-4" />
                  Start Recording
                </Button>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="flex-1 border-slate-600 hover:bg-slate-700 text-slate-300 gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Upload Audio
                </Button>
              </>
            ) : isRecording ? (
              <>
                <div className="flex-1 flex items-center gap-3 p-4 bg-red-950/30 border border-red-800/50 rounded-lg">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-red-400 font-semibold">Recording...</span>
                  <span className="text-slate-400 ml-auto">{formatTime(recordingTime)}</span>
                </div>
                <Button
                  onClick={stopRecording}
                  className="bg-red-600 hover:bg-red-700 text-white gap-2"
                >
                  <Square className="w-4 h-4" />
                  Stop
                </Button>
              </>
            ) : (
              <div className="flex-1 flex items-center gap-3 p-4 bg-blue-950/30 border border-blue-800/50 rounded-lg">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-spin" />
                <span className="text-blue-400 font-semibold">Processing audio...</span>
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            onChange={handleFileUpload}
            className="hidden"
          />

          {transcript && (
            <div className="mt-4 p-4 bg-slate-700/30 rounded-lg border border-slate-600/30">
              <h4 className="text-sm font-semibold text-slate-300 mb-2">Live Transcript</h4>
              <p className="text-sm text-slate-400 whitespace-pre-wrap max-h-48 overflow-y-auto">
                {transcript}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary Display */}
      {summary && (
        <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border-slate-700/50 hover:border-slate-600/50 transition-all">
          <CardHeader>
            <CardTitle className="text-slate-100">Meeting Summary</CardTitle>
            <CardDescription className="text-slate-400">
              {summary.title || "Untitled Meeting"} • {new Date(summary.createdAt).toLocaleString()}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Key Takeaways */}
            <div>
              <h3 className="text-lg font-semibold text-slate-100 mb-3 flex items-center gap-2">
                ✅ Key Takeaways
              </h3>
              <ul className="space-y-2">
                {summary.keyTakeaways.map((item, idx) => (
                  <li key={idx} className="text-sm text-slate-300 pl-4 border-l-2 border-green-500/30">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Items */}
            <div>
              <h3 className="text-lg font-semibold text-slate-100 mb-3 flex items-center gap-2">
                📋 Action Items
              </h3>
              <ul className="space-y-2">
                {summary.actionItems.map((item, idx) => (
                  <li key={idx} className="text-sm text-slate-300 pl-4 border-l-2 border-blue-500/30">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Decisions */}
            <div>
              <h3 className="text-lg font-semibold text-slate-100 mb-3 flex items-center gap-2">
                💬 Decisions Made
              </h3>
              <ul className="space-y-2">
                {summary.decisions.map((item, idx) => (
                  <li key={idx} className="text-sm text-slate-300 pl-4 border-l-2 border-purple-500/30">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Unresolved Topics */}
            {summary.unresolvedTopics.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-slate-100 mb-3 flex items-center gap-2">
                  ❗ Unresolved Topics
                </h3>
                <ul className="space-y-2">
                  {summary.unresolvedTopics.map((item, idx) => (
                    <li key={idx} className="text-sm text-slate-300 pl-4 border-l-2 border-orange-500/30">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Insights */}
            <div className="bg-gradient-to-r from-blue-950/30 to-purple-950/30 border border-blue-800/30 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-slate-100 mb-3">📊 Insights</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-400">Most Discussed:</span>
                  <p className="text-slate-200 font-medium">{summary.insights.mostDiscussedTopic}</p>
                </div>
                <div>
                  <span className="text-slate-400">Sentiment:</span>
                  <p className="text-slate-200 font-medium capitalize">{summary.insights.sentiment}</p>
                </div>
                <div>
                  <span className="text-slate-400">Duration:</span>
                  <p className="text-slate-200 font-medium">{formatTime(summary.insights.duration)}</p>
                </div>
                <div>
                  <span className="text-slate-400">Participants:</span>
                  <p className="text-slate-200 font-medium">{summary.insights.participantCount}</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4 border-t border-slate-700/50">
              <Button
                onClick={() => sendSummaryEmail(summary.id)}
                variant="outline"
                className="flex-1 border-slate-600 hover:bg-slate-700 text-slate-300 gap-2"
              >
                <Mail className="w-4 h-4" />
                Email Summary
              </Button>
              <Button
                onClick={() => {
                  const blob = new Blob([JSON.stringify(summary, null, 2)], { type: "application/json" })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement("a")
                  a.href = url
                  a.download = `meeting-summary-${summary.id}.json`
                  a.click()
                  URL.revokeObjectURL(url)
                }}
                variant="outline"
                className="flex-1 border-slate-600 hover:bg-slate-700 text-slate-300 gap-2"
              >
                <Download className="w-4 h-4" />
                Download JSON
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Past Meetings */}
      {meetings.length > 0 && (
        <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border-slate-700/50 hover:border-slate-600/50 transition-all">
          <CardHeader>
            <CardTitle className="text-slate-100">Past Meeting Summaries</CardTitle>
            <CardDescription className="text-slate-400">
              View and manage your previous meeting summaries
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {meetings.map((meeting) => (
                <div
                  key={meeting.id}
                  className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/30 hover:border-slate-500/50 transition-all cursor-pointer"
                  onClick={() => setSummary(meeting)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-slate-100">{meeting.title}</h4>
                      <p className="text-xs text-slate-400 mt-1">
                        {new Date(meeting.createdAt).toLocaleString()} • {meeting.actionItems.length} action items
                      </p>
                    </div>
                    <FileText className="w-5 h-5 text-blue-400" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}


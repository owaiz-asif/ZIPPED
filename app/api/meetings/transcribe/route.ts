import { type NextRequest, NextResponse } from "next/server"

// Mock transcription for demo - in production, integrate with Whisper API or Google Speech-to-Text
async function transcribeAudio(audioBlob: Blob, title?: string): Promise<string> {
  // In production, replace this with actual Whisper API call:
  // const formData = new FormData()
  // formData.append('file', audioBlob)
  // const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
  //   method: 'POST',
  //   headers: { 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` },
  //   body: formData
  // })
  // const data = await response.json()
  // return data.text

  // Mock transcription based on meeting title or return demo transcript
  const mockTranscripts: { [key: string]: string } = {
    "Team Standup": `Good morning everyone. Let's start with updates. Sarah, how's the frontend coming along?

Sarah: I've completed the login page and working on the dashboard. Should be done by Friday.

John: Great. I've been working on the API endpoints. We have authentication working, but still need to implement the data fetching endpoints.

Mike: I've reviewed the designs and we need to adjust the color scheme. The current palette doesn't meet accessibility standards.

Sarah: I can help with that. We should also discuss the deadline for the beta release.

John: The deadline is tight. We might need to push it back by a week.

Mike: I agree. Let's schedule a follow-up meeting to discuss the timeline.

Sarah: Sounds good. I'll send out a calendar invite.

John: Also, we need to decide on the database migration strategy. Should we use a blue-green deployment?

Mike: That's a good question. We haven't resolved that yet. Let's add it to next week's agenda.`,

    "Client Meeting": `Thank you for joining today. We're here to discuss the project progress and next steps.

Client: We're very happy with the progress so far. The designs look great.

Us: Thank you. We've completed phase one and are ready to move to phase two.

Client: Excellent. When can we expect phase two to be completed?

Us: We're targeting the end of next month. However, we need your feedback on the color scheme first.

Client: We'll review it this week and get back to you.

Us: Perfect. We also need to discuss the budget for additional features.

Client: Let's schedule a separate meeting for that discussion. We need to review our budget first.

Us: Understood. We'll send a calendar invite for next week.

Client: One more thing - we haven't decided on the payment integration yet. Can we discuss options?

Us: Absolutely. We'll prepare a comparison document for our next meeting.`,

    default: `Welcome everyone to today's meeting. Let's start with a quick round of updates.

First, I want to discuss the project timeline. We're making good progress but there are some blockers we need to address.

The main issue is the API integration. We're waiting on third-party services to provide access.

We've decided to move forward with the current design approach, but we need to finalize the color scheme.

Action items: Sarah will complete the frontend by Friday. John will finish the API endpoints. Mike will review accessibility standards.

We haven't resolved the database migration strategy yet. That's something we need to discuss in our next meeting.

The deadline might need to be adjusted. We'll revisit this next week after we have more information.

Overall, the sentiment is positive. We're on track but need to address these blockers quickly.`
  }

  const key = title || "default"
  return mockTranscripts[key] || mockTranscripts.default
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const audioFile = formData.get("audio") as File
    const userId = formData.get("userId")
    const title = formData.get("title") as string | null

    if (!audioFile) {
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 })
    }

    // Convert File to Blob for processing
    const audioBlob = new Blob([await audioFile.arrayBuffer()], { type: audioFile.type })

    // Transcribe audio
    const transcript = await transcribeAudio(audioBlob, title || undefined)

    // Generate a title if not provided
    const meetingTitle = title || `Meeting ${new Date().toLocaleDateString()}`

    return NextResponse.json({
      success: true,
      transcript,
      title: meetingTitle,
      duration: Math.floor(audioBlob.size / 1000), // Mock duration calculation
    })
  } catch (error: any) {
    console.error("[API] Transcription error:", error)
    return NextResponse.json({ error: "Failed to transcribe audio", details: error.message }, { status: 500 })
  }
}


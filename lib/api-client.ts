// Utility functions for API communication with proper error handling

export async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

  try {
    const response = await fetch(`${baseUrl}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("[API Client] Error:", error)
    throw error
  }
}

// Connect social media platform
export async function connectSocialMedia(platform: string, accessToken: string, userId: string) {
  return fetchAPI("/api/social-media/connect", {
    method: "POST",
    body: JSON.stringify({ platform, accessToken, userId }),
  })
}

// Analyze emotions from text
export async function analyzeEmotions(texts: string[], source?: string) {
  return fetchAPI("/api/emotion-analysis", {
    method: "POST",
    body: JSON.stringify({ texts, source }),
  })
}

// Generate empathetic email draft
export async function generateEmailDraft(emailText: string, senderName: string) {
  return fetchAPI("/api/email-drafts/generate", {
    method: "POST",
    body: JSON.stringify({ incomingEmailText: emailText, senderName }),
  })
}

// Get meeting time predictions
export async function getMeetingPredictions() {
  return fetchAPI("/api/meeting-scheduler/predict", {
    method: "GET",
  })
}

// Record data on blockchain
export async function recordOnBlockchain(dataType: string, data: any) {
  return fetchAPI("/api/blockchain/verify", {
    method: "POST",
    body: JSON.stringify({ dataType, data }),
  })
}

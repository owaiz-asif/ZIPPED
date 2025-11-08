import { generateText } from 'ai'

export interface EmailDraftRequest {
  incomingEmailText: string
  senderName: string
  context?: string
}

function localFallbackDraft(emailText: string, senderName: string) {
  // Simple deterministic template used when no AI provider is configured.
  const short = emailText.length > 200 ? emailText.slice(0, 197) + '...' : emailText
  return `Hi ${senderName},\n\nThanks for your message. I appreciate you sharing: "${short}". I hear your concerns and would like to propose we set up a short call to go over details and next steps. Please let me know a few times that work for you.\n\nBest regards,\n[Your Name]`
}

export async function generateDraft(request: EmailDraftRequest) {
  const { incomingEmailText, senderName } = request

  // Sensitive content check (very conservative)
  const ssnLike = /\b\d{3}-\d{2}-\d{4}\b/
  const ccLike = /\b(?:\d[ -]*?){13,16}\b/
  if (ssnLike.test(incomingEmailText) || ccLike.test(incomingEmailText)) {
    // refuse to process sensitive PII unless explicitly allowed elsewhere
    throw new Error('Contains sensitive personal data; please remove before drafting')
  }

  // If an AI provider is configured, attempt to use it. The `ai` SDK will
  // pick up provider credentials from environment variables (e.g. VERCEL_AI_TOKEN,
  // OPENAI_API_KEY depending on provider setup). We defensively fallback.
  const hasProvider = !!(process.env.OPENAI_API_KEY || process.env.VERCEL_AI_TOKEN || process.env.AI_API_KEY)

  if (!hasProvider) {
    return localFallbackDraft(incomingEmailText, senderName)
  }

  try {
    const { text } = await generateText({
      model: 'openai/gpt-4o-mini',
      prompt: `You are an empathetic assistant. Draft a concise, professional, and warm email reply to the message below. Keep it under 150 words and propose next steps.\n\nFROM: ${senderName}\nMESSAGE: "${incomingEmailText}"\n\nRequirements:\n- Acknowledge feelings where appropriate\n- Be helpful and concise\n- Propose next steps\n- Sign off professionally`,
    })

    if (typeof text === 'string' && text.trim().length > 0) return text
    return localFallbackDraft(incomingEmailText, senderName)
  } catch (err) {
    console.error('[email-drafts] provider generation failed:', err)
    return localFallbackDraft(incomingEmailText, senderName)
  }
}

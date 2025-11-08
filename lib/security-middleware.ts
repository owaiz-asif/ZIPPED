import { type NextRequest, NextResponse } from "next/server"

// Rate limiting store (in production, use Redis)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

export async function validateRequest(request: NextRequest) {
  const clientId = request.headers.get("x-forwarded-for") || "unknown"

  // Rate limiting: 100 requests per minute
  const now = Date.now()
  const limit = rateLimitMap.get(clientId)

  if (limit && limit.resetTime > now) {
    if (limit.count >= 100) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 })
    }
    limit.count++
  } else {
    rateLimitMap.set(clientId, { count: 1, resetTime: now + 60000 })
  }

  // Validate content type for POST requests
  if (request.method === "POST") {
    const contentType = request.headers.get("content-type")
    if (!contentType?.includes("application/json")) {
      return NextResponse.json({ error: "Content-Type must be application/json" }, { status: 400 })
    }
  }

  return null
}

export function validateEnvironmentVariables(): { valid: boolean; missing: string[] } {
  const required: string[] = []

  const optional = [
    "NEXT_PUBLIC_API_URL",
    "OPENAI_API_KEY",
    "DEEPINFRA_API_KEY",
    "GROQ_API_KEY",
    "DATABASE_URL",
    "REDIS_URL",
  ]

  const missing = required.filter((v) => !process.env[v])

  if (missing.length > 0) {
    console.error("[Security] Missing required environment variables:", missing.join(", "))
  }

  const missingOptional = optional.filter((v) => !process.env[v])
  if (missingOptional.length > 0) {
    console.warn(
      "[Security] Missing optional environment variables:",
      missingOptional.join(", "),
      "- App will work with defaults",
    )
  }

  return {
    valid: missing.length === 0,
    missing,
  }
}

export function sanitizeInput(input: unknown): string {
  if (typeof input !== "string") {
    return ""
  }

  return input
    .replace(/[<>]/g, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+=/gi, "")
    .trim()
    .substring(0, 5000)
}

export function maskSensitiveData(obj: Record<string, unknown>): Record<string, unknown> {
  const masked = { ...obj }
  const sensitiveKeys = ["apiKey", "secret", "token", "password", "privateKey"]

  for (const key of sensitiveKeys) {
    if (key in masked) {
      const value = masked[key]
      if (typeof value === "string" && value.length > 4) {
        masked[key] = value.slice(0, 4) + "****"
      }
    }
  }

  return masked
}

export function validateApiKey(apiKey: string | null | undefined): boolean {
  if (!apiKey) return false
  if (typeof apiKey !== "string") return false
  if (apiKey.length < 10) return false
  if (!/^[a-zA-Z0-9_-]+$/.test(apiKey)) return false

  return true
}

// Clean up old rate limit entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, value] of rateLimitMap.entries()) {
    if (value.resetTime < now) {
      rateLimitMap.delete(key)
    }
  }
}, 300000)

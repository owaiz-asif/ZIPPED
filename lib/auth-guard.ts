// Authentication and security utilities

export function validateGCPCredentials() {
  const requiredVars = ["GCP_PROJECT_ID", "GCP_PRIVATE_KEY", "GCP_CLIENT_EMAIL"]
  const missing = requiredVars.filter((v) => !process.env[v])

  if (missing.length > 0) {
    console.warn("[Security] Missing GCP credentials:", missing.join(", "))
    return false
  }

  return true
}

export function validateAPIKeys() {
  const requiredKeys = ["OPENAI_API_KEY"]
  const missing = requiredKeys.filter((k) => !process.env[k])

  if (missing.length > 0) {
    console.warn("[Security] Missing API keys:", missing.join(", "))
  }

  return missing.length === 0
}

export function sanitizeInput(input: string): string {
  // Remove potentially dangerous characters
  return input
    .replace(/[<>]/g, "")
    .replace(/javascript:/gi, "")
    .trim()
    .substring(0, 1000) // Limit length
}

export function encryptSensitiveData(data: string): string {
  // In production, use proper encryption library (e.g., crypto-js)
  return Buffer.from(data).toString("base64")
}

export function decryptSensitiveData(encrypted: string): string {
  // In production, use proper decryption
  return Buffer.from(encrypted, "base64").toString("utf-8")
}

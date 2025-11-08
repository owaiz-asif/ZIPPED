import { type NextRequest, NextResponse } from "next/server"
import { validateRequest, maskSensitiveData } from "@/lib/security-middleware"

export function withSecurityMiddleware(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    // Validate request
    const validationError = await validateRequest(req)
    if (validationError) {
      return validationError
    }

    try {
      const response = await handler(req)

      // Log with masked sensitive data
      console.log("[API] Request processed", {
        method: req.method,
        path: req.nextUrl.pathname,
        status: response.status,
      })

      return response
    } catch (error) {
      console.error(
        "[API] Error processing request:",
        maskSensitiveData({
          error: error instanceof Error ? error.message : "Unknown error",
        }),
      )

      return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
  }
}

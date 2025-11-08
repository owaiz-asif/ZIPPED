import { type NextRequest, NextResponse } from "next/server"

// Handler for connecting social media platforms
export async function POST(request: NextRequest) {
  try {
    const { platform, accessToken, refreshToken, userId } = await request.json()

    // Validate required fields
    if (!platform || !accessToken || !userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Store API credentials securely (in production, use encrypted vault)
    const credentials = {
      platform,
      userId,
      accessToken,
      refreshToken,
      connectedAt: new Date().toISOString(),
      lastSynced: new Date().toISOString(),
    }

    console.log(`[API] Connected ${platform} for user ${userId}`)

    return NextResponse.json({
      success: true,
      message: `Successfully connected ${platform}`,
      credentials: {
        platform,
        connectedAt: credentials.connectedAt,
        status: "active",
      },
    })
  } catch (error) {
    console.error("[API] Connection error:", error)
    return NextResponse.json({ error: "Failed to connect platform" }, { status: 500 })
  }
}

// Handler for disconnecting platforms
export async function DELETE(request: NextRequest) {
  try {
    const { platform, userId } = await request.json()

    console.log(`[API] Disconnected ${platform} for user ${userId}`)

    return NextResponse.json({
      success: true,
      message: `Successfully disconnected ${platform}`,
    })
  } catch (error) {
    console.error("[API] Disconnection error:", error)
    return NextResponse.json({ error: "Failed to disconnect platform" }, { status: 500 })
  }
}

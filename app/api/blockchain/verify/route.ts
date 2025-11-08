import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

interface BlockchainRecord {
  hash: string
  type: string
  timestamp: string
  verified: boolean
}

function generateBlockchainHash(data: any): string {
  // Simulate blockchain hash generation
  const jsonString = JSON.stringify(data)
  return "0x" + crypto.createHash("sha256").update(jsonString).digest("hex").substring(0, 16)
}

export async function POST(request: NextRequest) {
  try {
    const { dataType, data } = await request.json()

    if (!dataType || !data) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const hash = generateBlockchainHash({
      type: dataType,
      data,
      timestamp: new Date().toISOString(),
    })

    const record: BlockchainRecord = {
      hash,
      type: dataType,
      timestamp: new Date().toISOString(),
      verified: true,
    }

    console.log(`[API] Blockchain record created for ${dataType}:`, hash)

    return NextResponse.json({
      success: true,
      record,
      message: `${dataType} data successfully recorded on blockchain`,
    })
  } catch (error) {
    console.error("[API] Blockchain verification error:", error)
    return NextResponse.json({ error: "Failed to verify on blockchain" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    // Retrieve blockchain records
    const records: BlockchainRecord[] = [
      {
        hash: "0x7a9c8f3b2e1d4a6c",
        type: "mood-analysis",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        verified: true,
      },
      {
        hash: "0x5e2d1a9c4b7f3e8a",
        type: "meeting-schedule",
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        verified: true,
      },
    ]

    console.log("[API] Retrieved blockchain records")

    return NextResponse.json({
      success: true,
      records,
      totalRecords: records.length,
    })
  } catch (error) {
    console.error("[API] Blockchain retrieval error:", error)
    return NextResponse.json({ error: "Failed to retrieve blockchain records" }, { status: 500 })
  }
}

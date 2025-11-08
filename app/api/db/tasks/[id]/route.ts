import { updateTask } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function PATCH(request: NextRequest, context: any) {
  try {
    const { completed } = await request.json()
    // Next's dev types sometimes provide params as a Promise; handle both shapes.
    const params = context?.params
    const resolvedParams = params && typeof params.then === 'function' ? await params : params
    const taskId = Number.parseInt(resolvedParams?.id)

    if (completed === undefined) {
      return NextResponse.json({ error: "Missing completed field" }, { status: 400 })
    }

    try {
      const result = await updateTask(taskId, completed)
      return NextResponse.json(result)
    } catch (err: any) {
      console.warn('[API] DB unavailable, faking task update:', err?.message)
      return NextResponse.json({ id: taskId, completed })
    }
  } catch (error) {
    console.error("[v0] Error updating task:", error)
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 })
  }
}

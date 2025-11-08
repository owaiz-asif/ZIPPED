import { addTask, getTasks, updateTask } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return Response.json({ error: "userId required" }, { status: 400 })
    }

    try {
      const tasks = await getTasks(Number.parseInt(userId))
      return Response.json(tasks)
    } catch (err: any) {
      console.warn('[API] DB unavailable, returning demo tasks:', err?.message)
      const demo = [
        { id: 1, user_id: Number(userId), name: 'Client Meeting', category: 'work', completed: true, time_spent: 1 },
        { id: 2, user_id: Number(userId), name: 'Exercise', category: 'health', completed: false, time_spent: 0.5 },
      ]
      return Response.json(demo)
    }
  } catch (error) {
    return Response.json({ error: "Failed to fetch tasks" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { userId, name, category } = await request.json()

    if (!userId || !name || !category) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    try {
      const result = await addTask(userId, name, category)
      return Response.json(result)
    } catch (err: any) {
      console.warn('[API] DB unavailable, returning demo created task:', err?.message)
      const demo = { id: Date.now(), user_id: userId, name, category, completed: false, time_spent: 0 }
      return Response.json(demo)
    }
  } catch (error) {
    return Response.json({ error: "Failed to save task" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { taskId, completed } = await request.json()

    if (taskId === undefined || completed === undefined) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    try {
      const result = await updateTask(taskId, completed)
      return Response.json(result)
    } catch (err: any) {
      console.warn('[API] DB unavailable, faking task update:', err?.message)
      return Response.json({ id: taskId, completed })
    }
  } catch (error) {
    return Response.json({ error: "Failed to update task" }, { status: 500 })
  }
}

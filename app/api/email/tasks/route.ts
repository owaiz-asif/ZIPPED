import { type NextRequest, NextResponse } from "next/server"

interface EmailTask {
  id: string
  title: string
  dueDate: string | null
  priority: "low" | "medium" | "high"
  sourceEmail: string
  extractedAt: string
}

// Mock email data for demo
const mockEmails = [
  {
    id: "1",
    from: "manager@company.com",
    subject: "Q1 Review Meeting - Action Items",
    body: "Hi team, following up on our meeting. Please complete the following:\n1. Review the Q1 budget report by Friday\n2. Prepare presentation slides for client meeting (due: 2024-02-15)\n3. Update project timeline - HIGH PRIORITY\n4. Schedule follow-up call next week",
    date: "2024-02-10T10:00:00Z",
  },
  {
    id: "2",
    from: "client@example.com",
    subject: "Urgent: Design Review Needed",
    body: "We need the design mockups reviewed by end of day today. This is urgent. Please prioritize this task.",
    date: "2024-02-10T14:30:00Z",
  },
  {
    id: "3",
    from: "hr@company.com",
    subject: "Performance Review Reminder",
    body: "Don't forget to submit your self-assessment by February 20th. This is a medium priority task.",
    date: "2024-02-09T09:00:00Z",
  },
]

// Extract actionable items from email text
function extractTasksFromEmail(email: {
  id: string
  from: string
  subject: string
  body: string
  date: string
}): EmailTask[] {
  const tasks: EmailTask[] = []
  const text = `${email.subject} ${email.body}`.toLowerCase()
  
  // Priority detection
  const hasUrgent = /\b(urgent|asap|immediately|critical|high priority)\b/i.test(text)
  const hasMedium = /\b(medium|moderate|normal)\b/i.test(text)
  const priority: "low" | "medium" | "high" = hasUrgent ? "high" : hasMedium ? "medium" : "low"
  
  // Date extraction patterns
  const datePatterns = [
    /(?:due|by|deadline|before)\s+(?:on\s+)?(\d{4}-\d{2}-\d{2})/i,
    /(?:due|by|deadline|before)\s+(?:on\s+)?(\w+\s+\d{1,2}(?:st|nd|rd|th)?)/i,
    /(?:by|before)\s+(?:end\s+of\s+)?(today|tomorrow)/i,
  ]
  
  let dueDate: string | null = null
  for (const pattern of datePatterns) {
    const match = text.match(pattern)
    if (match) {
      if (match[1] === "today") {
        dueDate = new Date().toISOString().split("T")[0]
      } else if (match[1] === "tomorrow") {
        const tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1)
        dueDate = tomorrow.toISOString().split("T")[0]
      } else if (match[1].match(/\d{4}-\d{2}-\d{2}/)) {
        dueDate = match[1]
      }
      break
    }
  }
  
  // Extract numbered items
  const numberedItems = email.body.match(/\d+\.\s+([^\n]+)/g)
  if (numberedItems) {
    numberedItems.forEach((item, index) => {
      const title = item.replace(/^\d+\.\s+/, "").trim()
      if (title.length > 5) {
        tasks.push({
          id: `${email.id}-${index}`,
          title,
          dueDate,
          priority,
          sourceEmail: email.from,
          extractedAt: new Date().toISOString(),
        })
      }
    })
  }
  
  // Extract imperative sentences (action items)
  const actionPatterns = [
    /(?:please|kindly|need to|must|should)\s+([^.!?]+(?:complete|review|prepare|update|schedule|submit|send|create|finish)[^.!?]*)/gi,
    /(?:todo|action|task):\s*([^\n]+)/gi,
  ]
  
  actionPatterns.forEach((pattern) => {
    const matches = email.body.matchAll(pattern)
    for (const match of matches) {
      const title = match[1]?.trim()
      if (title && title.length > 10 && !tasks.some(t => t.title.toLowerCase().includes(title.toLowerCase().substring(0, 20)))) {
        tasks.push({
          id: `${email.id}-action-${tasks.length}`,
          title,
          dueDate,
          priority,
          sourceEmail: email.from,
          extractedAt: new Date().toISOString(),
        })
      }
    }
  })
  
  // If no tasks found, create one from subject if it looks actionable
  if (tasks.length === 0 && (text.includes("action") || text.includes("task") || text.includes("reminder"))) {
    tasks.push({
      id: `${email.id}-subject`,
      title: email.subject,
      dueDate,
      priority,
      sourceEmail: email.from,
      extractedAt: new Date().toISOString(),
    })
  }
  
  return tasks
}

export async function GET(request: NextRequest) {
  try {
    // Extract tasks from mock emails
    const allTasks: EmailTask[] = []
    mockEmails.forEach((email) => {
      const tasks = extractTasksFromEmail(email)
      allTasks.push(...tasks)
    })
    
    return NextResponse.json({
      success: true,
      tasks: allTasks,
      total: allTasks.length,
    })
  } catch (error) {
    console.error("[API] Email tasks extraction error:", error)
    return NextResponse.json({ error: "Failed to extract tasks from emails" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { emailText, from, subject, date } = await request.json()
    
    if (!emailText) {
      return NextResponse.json({ error: "Email text is required" }, { status: 400 })
    }
    
    const email = {
      id: Date.now().toString(),
      from: from || "unknown@example.com",
      subject: subject || "No Subject",
      body: emailText,
      date: date || new Date().toISOString(),
    }
    
    const tasks = extractTasksFromEmail(email)
    
    return NextResponse.json({
      success: true,
      tasks,
      total: tasks.length,
    })
  } catch (error) {
    console.error("[API] Email task extraction error:", error)
    return NextResponse.json({ error: "Failed to extract tasks" }, { status: 500 })
  }
}


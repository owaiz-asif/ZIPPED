"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, Calendar, AlertCircle, CheckCircle2, Plus } from "lucide-react"
import { useTasksData } from "@/hooks/use-tasks-data"

const DEMO_USER_ID = 1

interface EmailTask {
  id: string
  title: string
  dueDate: string | null
  priority: "low" | "medium" | "high"
  sourceEmail: string
  extractedAt: string
}

interface Email {
  id: string
  from: string
  subject: string
  body: string
  date: string
  tasks?: EmailTask[]
}

export default function EmailTaskExtractor() {
  const { addTask } = useTasksData(DEMO_USER_ID)
  const [emails, setEmails] = useState<Email[]>([])
  const [extractedTasks, setExtractedTasks] = useState<EmailTask[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null)

  useEffect(() => {
    loadEmailsAndTasks()
  }, [])

  const loadEmailsAndTasks = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/email/tasks")
      if (response.ok) {
        const data = await response.json()
        setExtractedTasks(data.tasks || [])
        
        // Create email list from mock data
        const mockEmails: Email[] = [
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
        setEmails(mockEmails)
      }
    } catch (error) {
      console.error("Error loading emails:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const extractTasksFromEmail = async (emailId: string) => {
    const email = emails.find(e => e.id === emailId)
    if (!email) return

    setIsLoading(true)
    try {
      const response = await fetch("/api/email/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emailText: email.body,
          from: email.from,
          subject: email.subject,
          date: email.date,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        const newTasks = data.tasks || []
        setExtractedTasks((prev) => [...prev, ...newTasks])
        setSelectedEmail(emailId)
      }
    } catch (error) {
      console.error("Error extracting tasks:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const addTaskToSystem = async (task: EmailTask) => {
    try {
      // Map priority to category
      const category = task.priority === "high" ? "work" : "personal"
      await addTask(task.title, category)
      
      // Remove from extracted tasks
      setExtractedTasks((prev) => prev.filter(t => t.id !== task.id))
    } catch (error) {
      console.error("Error adding task:", error)
      alert("Failed to add task. Please try again.")
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-400 bg-red-950/30 border-red-800/50"
      case "medium":
        return "text-yellow-400 bg-yellow-950/30 border-yellow-800/50"
      default:
        return "text-blue-400 bg-blue-950/30 border-blue-800/50"
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "No due date"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border-slate-700/50 hover:border-slate-600/50 transition-all">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-100">
            <Mail className="w-5 h-5 text-blue-400" />
            Email Task Extraction
          </CardTitle>
          <CardDescription className="text-slate-400">
            Automatically extract actionable items from emails and convert them to tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {emails.map((email) => {
              const emailTasks = extractedTasks.filter(t => t.sourceEmail === email.from)
              return (
                <div
                  key={email.id}
                  className="bg-gradient-to-r from-slate-700/40 to-slate-800/40 rounded-lg border border-slate-700/30 p-4 hover:border-slate-600/50 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-100 mb-1">{email.subject}</h4>
                      <p className="text-xs text-slate-400 mb-2">From: {email.from}</p>
                      <p className="text-sm text-slate-300 line-clamp-2">{email.body.substring(0, 150)}...</p>
                    </div>
                    <Button
                      onClick={() => extractTasksFromEmail(email.id)}
                      disabled={isLoading}
                      size="sm"
                      className="ml-4 bg-blue-600 hover:bg-blue-700"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Extract Tasks
                    </Button>
                  </div>
                  
                  {emailTasks.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-700/50">
                      <p className="text-xs text-slate-400 mb-2">Extracted Tasks:</p>
                      <div className="space-y-2">
                        {emailTasks.map((task) => (
                          <div
                            key={task.id}
                            className="flex items-center justify-between p-2 bg-slate-800/50 rounded border border-slate-700/30"
                          >
                            <div className="flex-1">
                              <p className="text-sm text-slate-200">{task.title}</p>
                              <div className="flex items-center gap-3 mt-1">
                                <span className={`text-xs px-2 py-0.5 rounded border ${getPriorityColor(task.priority)}`}>
                                  {task.priority}
                                </span>
                                {task.dueDate && (
                                  <span className="text-xs text-slate-400 flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {formatDate(task.dueDate)}
                                  </span>
                                )}
                              </div>
                            </div>
                            <Button
                              onClick={() => addTaskToSystem(task)}
                              size="sm"
                              className="ml-2 bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {extractedTasks.length > 0 && (
        <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border-slate-700/50 hover:border-slate-600/50 transition-all">
          <CardHeader>
            <CardTitle className="text-slate-100">All Extracted Tasks</CardTitle>
            <CardDescription className="text-slate-400">
              {extractedTasks.length} task(s) ready to be added to your task list
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {extractedTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3 bg-gradient-to-r from-slate-700/40 to-slate-800/40 rounded-lg border border-slate-700/30 hover:border-slate-600/50 transition-all"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-100">{task.title}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className={`text-xs px-2 py-1 rounded border ${getPriorityColor(task.priority)}`}>
                        {task.priority.toUpperCase()}
                      </span>
                      {task.dueDate && (
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Due: {formatDate(task.dueDate)}
                        </span>
                      )}
                      <span className="text-xs text-slate-500">From: {task.sourceEmail}</span>
                    </div>
                  </div>
                  <Button
                    onClick={() => addTaskToSystem(task)}
                    size="sm"
                    className="ml-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    Add Task
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}


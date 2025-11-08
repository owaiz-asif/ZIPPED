"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Clock, AlertTriangle, Calendar, TrendingUp } from "lucide-react"
import { useTasksData } from "@/hooks/use-tasks-data"

const DEMO_USER_ID = 1

interface TaskSummary {
  total: number
  completed: number
  highPriority: number
  dueToday: number
  overdue: number
}

export default function DailyActivityManager() {
  const { tasks: dbTasks, toggleTask, isLoading } = useTasksData(DEMO_USER_ID)
  const [tasks, setTasks] = useState<any[]>([])
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [mounted, setMounted] = useState(false)
  const hasInitialized = useRef(false)
  const lastDbTasksHash = useRef<string>("")

  useEffect(() => {
    setMounted(true)
  }, [])

  // Create a hash of task IDs to detect changes without causing infinite loops
  const getTasksHash = (taskList: typeof dbTasks): string => {
    if (!taskList || taskList.length === 0) return ""
    return taskList.map(t => `${t.id}:${t.completed}`).join(",")
  }

  useEffect(() => {
    // Only update if dbTasks actually changed (use hash to avoid infinite loops)
    const currentHash = getTasksHash(dbTasks)
    const currentLength = dbTasks?.length || 0
    
    // Check if we need to update
    if (!hasInitialized.current) {
      // First initialization
      if (dbTasks && dbTasks.length > 0) {
        // Transform dbTasks to include priority and dueDate if not present
        const transformed = dbTasks.map((t: any) => ({
          id: t.id,
          name: t.name,
          category: t.category,
          completed: t.completed,
          time_spent: t.time_spent || 0,
          priority: t.priority || "medium",
          dueDate: t.dueDate || null,
        }))
        setTasks(transformed)
        lastDbTasksHash.current = currentHash
      } else {
        // Demo data fallback - only set once
        const today = new Date().toISOString().split("T")[0]
        setTasks([
          { id: 1, name: "Review Q1 budget report", category: "work", completed: false, time_spent: 0, priority: "high", dueDate: today },
          { id: 2, name: "Prepare client presentation", category: "work", completed: false, time_spent: 0, priority: "high", dueDate: today },
          { id: 3, name: "Team standup meeting", category: "work", completed: true, time_spent: 0.5, priority: "medium", dueDate: today },
          { id: 4, name: "Update project timeline", category: "work", completed: false, time_spent: 0, priority: "high", dueDate: today },
          { id: 5, name: "Exercise", category: "health", completed: false, time_spent: 0, priority: "low", dueDate: null },
        ])
        lastDbTasksHash.current = "demo"
      }
      hasInitialized.current = true
    } else if (currentHash !== lastDbTasksHash.current) {
      // Update if hash changed (tasks added, removed, or modified)
      if (dbTasks && dbTasks.length > 0) {
        const transformed = dbTasks.map((t: any) => ({
          id: t.id,
          name: t.name,
          category: t.category,
          completed: t.completed,
          time_spent: t.time_spent || 0,
          priority: t.priority || "medium",
          dueDate: t.dueDate || null,
        }))
        setTasks(transformed)
        lastDbTasksHash.current = currentHash
      } else if (currentLength === 0) {
        // Database cleared, but don't reset to demo data automatically
        lastDbTasksHash.current = ""
      }
    }
  }, [dbTasks]) // Only depend on dbTasks - no tasks.length!

  const summary: TaskSummary = useMemo(() => {
    const today = new Date().toISOString().split("T")[0]
    const todayTasks = tasks.filter(t => !t.dueDate || t.dueDate === today || t.dueDate <= today)
    
    return {
      total: todayTasks.length,
      completed: todayTasks.filter(t => t.completed).length,
      highPriority: todayTasks.filter(t => t.priority === "high" && !t.completed).length,
      dueToday: todayTasks.filter(t => t.dueDate === today && !t.completed).length,
      overdue: todayTasks.filter(t => t.dueDate && t.dueDate < today && !t.completed).length,
    }
  }, [tasks, selectedDate])

  const todayTasks = useMemo(() => {
    const today = new Date().toISOString().split("T")[0]
    return tasks
      .filter(t => !t.dueDate || t.dueDate === today || t.dueDate <= today)
      .sort((a, b) => {
        // Sort by: overdue > high priority > due today > others
        const aOverdue = a.dueDate && a.dueDate < today && !a.completed
        const bOverdue = b.dueDate && b.dueDate < today && !b.completed
        if (aOverdue !== bOverdue) return aOverdue ? -1 : 1
        
        if (a.priority === "high" && b.priority !== "high") return -1
        if (b.priority === "high" && a.priority !== "high") return 1
        
        return a.completed === b.completed ? 0 : a.completed ? 1 : -1
      })
  }, [tasks, selectedDate])

  const handleToggleTask = async (id: number) => {
    const task = tasks.find(t => t.id === id)
    if (task) {
      try {
        await toggleTask(id, !task.completed)
        setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
      } catch (error) {
        console.error("Error toggling task:", error)
      }
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

  const getWorkloadMessage = () => {
    if (summary.overdue > 0) {
      return `${summary.overdue} overdue task(s) need immediate attention!`
    }
    if (summary.highPriority > 0) {
      return `${summary.highPriority} high-priority task(s) due today`
    }
    if (summary.dueToday > 0) {
      return `${summary.dueToday} task(s) due today`
    }
    return "All caught up! No urgent tasks."
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-950/50 to-indigo-950/50 border-blue-800/50 hover:border-blue-700/50 transition-all">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-blue-300 font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-400">{summary.completed}</div>
            <p className="text-xs text-blue-300/70 mt-1">of {summary.total} tasks</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-950/50 to-rose-950/50 border-red-800/50 hover:border-red-700/50 transition-all">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-red-300 font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              High Priority
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-400">{summary.highPriority}</div>
            <p className="text-xs text-red-300/70 mt-1">urgent tasks</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-950/50 to-amber-950/50 border-orange-800/50 hover:border-orange-700/50 transition-all">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-orange-300 font-semibold flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Due Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-400">{summary.dueToday}</div>
            <p className="text-xs text-orange-300/70 mt-1">tasks due</p>
          </CardContent>
        </Card>

        <Card className={`bg-gradient-to-br ${summary.overdue > 0 ? 'from-red-950/50 to-rose-950/50 border-red-800/50' : 'from-emerald-950/50 to-teal-950/50 border-emerald-800/50'} hover:border-opacity-70 transition-all`}>
          <CardHeader className="pb-3">
            <CardTitle className={`text-sm font-semibold flex items-center gap-2 ${summary.overdue > 0 ? 'text-red-300' : 'text-emerald-300'}`}>
              <Calendar className="w-4 h-4" />
              Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${summary.overdue > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
              {summary.overdue > 0 ? `${summary.overdue} Overdue` : "On Track"}
            </div>
            <p className={`text-xs mt-1 ${summary.overdue > 0 ? 'text-red-300/70' : 'text-emerald-300/70'}`}>
              {getWorkloadMessage()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Workload Summary */}
      <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border-slate-700/50 hover:border-slate-600/50 transition-all">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-100">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            Daily Workload Summary
          </CardTitle>
          <CardDescription className="text-slate-400">
            {getWorkloadMessage()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {summary.highPriority > 0 && (
              <div className="flex items-center justify-between p-3 bg-red-950/20 border border-red-800/30 rounded-lg">
                <span className="text-sm text-red-300">High Priority Tasks</span>
                <span className="text-lg font-bold text-red-400">{summary.highPriority}</span>
              </div>
            )}
            {summary.dueToday > 0 && (
              <div className="flex items-center justify-between p-3 bg-orange-950/20 border border-orange-800/30 rounded-lg">
                <span className="text-sm text-orange-300">Due Today</span>
                <span className="text-lg font-bold text-orange-400">{summary.dueToday}</span>
              </div>
            )}
            {summary.overdue > 0 && (
              <div className="flex items-center justify-between p-3 bg-red-950/30 border border-red-800/50 rounded-lg animate-pulse">
                <span className="text-sm font-semibold text-red-300">⚠️ Overdue Tasks</span>
                <span className="text-lg font-bold text-red-400">{summary.overdue}</span>
              </div>
            )}
            {summary.completed > 0 && (
              <div className="flex items-center justify-between p-3 bg-emerald-950/20 border border-emerald-800/30 rounded-lg">
                <span className="text-sm text-emerald-300">Completed Today</span>
                <span className="text-lg font-bold text-emerald-400">{summary.completed}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Daily Task Timeline */}
      <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border-slate-700/50 hover:border-slate-600/50 transition-all">
        <CardHeader>
          <CardTitle className="text-slate-100">Today's Task Timeline</CardTitle>
          <CardDescription className="text-slate-400">
            {mounted ? `Your tasks for ${new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}` : "Your tasks for today"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {todayTasks.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <CheckCircle2 className="w-12 h-12 mx-auto mb-2 text-emerald-500" />
                <p>No tasks for today! Great job staying on top of things.</p>
              </div>
            ) : (
              todayTasks.map((task) => {
                const isOverdue = task.dueDate && task.dueDate < new Date().toISOString().split("T")[0] && !task.completed
                return (
                  <div
                    key={task.id}
                    className={`flex items-center gap-3 p-4 rounded-lg border transition-all ${
                      task.completed
                        ? "bg-slate-800/30 border-slate-700/30 opacity-60"
                        : isOverdue
                        ? "bg-red-950/30 border-red-800/50 hover:border-red-700/50"
                        : "bg-gradient-to-r from-slate-700/40 to-slate-800/40 border-slate-700/30 hover:border-slate-600/50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => handleToggleTask(task.id)}
                      disabled={isLoading}
                      className="w-5 h-5 accent-blue-500 cursor-pointer"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className={`text-sm font-medium ${task.completed ? "line-through text-slate-500" : "text-slate-100"}`}>
                          {task.name}
                        </p>
                        {task.priority && (
                          <span className={`text-xs px-2 py-0.5 rounded border ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                        )}
                        {isOverdue && (
                          <span className="text-xs px-2 py-0.5 rounded bg-red-950/50 text-red-400 border border-red-800/50">
                            OVERDUE
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        <span className="capitalize">{task.category}</span>
                        {task.dueDate && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </span>
                        )}
                        {task.time_spent > 0 && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {task.time_spent}h
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


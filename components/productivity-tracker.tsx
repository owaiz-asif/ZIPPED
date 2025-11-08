"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, TrendingUp } from "lucide-react"
import { useTasksData } from "@/hooks/use-tasks-data"

const DEMO_USER_ID = 1

interface Task {
  id: number
  name: string
  category: "work" | "personal" | "health" | "learning"
  completed: boolean
  time_spent: number
}

interface TimeData {
  name: string
  hours: number
}

export default function ProductivityTracker() {
  const { tasks: dbTasks, addTask, toggleTask, isLoading } = useTasksData(DEMO_USER_ID)

  const [tasks, setTasks] = useState<Task[]>([])
  const [newTaskName, setNewTaskName] = useState("")
  const [newTaskCategory, setNewTaskCategory] = useState<"work" | "personal" | "health" | "learning">("work")
  const hasInitialized = useRef(false)
  const lastDbTasksHash = useRef<string>("")

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
        const transformed = dbTasks.map((t) => ({
          id: t.id,
          name: t.name,
          category: t.category as "work" | "personal" | "health" | "learning",
          completed: t.completed,
          time_spent: t.time_spent || 0,
        }))
        setTasks(transformed)
        lastDbTasksHash.current = currentHash
      } else {
        // Demo data fallback - only set once
        setTasks([
          { id: 1, name: "Client Meeting", category: "work", completed: true, time_spent: 1 },
          { id: 2, name: "Code Review", category: "work", completed: true, time_spent: 2 },
          { id: 3, name: "Exercise", category: "health", completed: false, time_spent: 0.5 },
          { id: 4, name: "Learning React", category: "learning", completed: true, time_spent: 1.5 },
          { id: 5, name: "Personal Project", category: "personal", completed: false, time_spent: 1 },
        ])
        lastDbTasksHash.current = "demo"
      }
      hasInitialized.current = true
    } else if (currentHash !== lastDbTasksHash.current) {
      // Update if hash changed (tasks added, removed, or modified)
      if (dbTasks && dbTasks.length > 0) {
        const transformed = dbTasks.map((t) => ({
          id: t.id,
          name: t.name,
          category: t.category as "work" | "personal" | "health" | "learning",
          completed: t.completed,
          time_spent: t.time_spent || 0,
        }))
        setTasks(transformed)
        lastDbTasksHash.current = currentHash
      } else if (currentLength === 0) {
        // Database cleared, but don't reset to demo data automatically
        // Let user add tasks or keep existing ones
        lastDbTasksHash.current = ""
      }
    }
  }, [dbTasks]) // Only depend on dbTasks - no tasks.length!

  // Memoize timeByCategory to prevent unnecessary recalculations
  const timeByCategory: TimeData[] = useMemo(() => [
    {
      name: "Work",
      hours: tasks.filter((t) => t.category === "work").reduce((sum, t) => sum + t.time_spent, 0),
    },
    {
      name: "Learning",
      hours: tasks.filter((t) => t.category === "learning").reduce((sum, t) => sum + t.time_spent, 0),
    },
    {
      name: "Health",
      hours: tasks.filter((t) => t.category === "health").reduce((sum, t) => sum + t.time_spent, 0),
    },
    {
      name: "Personal",
      hours: tasks.filter((t) => t.category === "personal").reduce((sum, t) => sum + t.time_spent, 0),
    },
  ], [tasks])

  const categoryColors = {
    work: "#3b82f6",
    personal: "#8b5cf6",
    health: "#ef4444",
    learning: "#10b981",
  }

  // Memoize completionRate to prevent unnecessary recalculations
  const completionRate = useMemo(() => 
    tasks.length > 0 ? Math.round((tasks.filter((t) => t.completed).length / tasks.length) * 100) : 0,
    [tasks]
  )

  const handleToggleTask = async (id: number) => {
    const task = tasks.find((t) => t.id === id)
    if (task) {
      await toggleTask(id, !task.completed)
    }
  }

  const handleAddTask = async () => {
    if (!newTaskName.trim()) return
    
    const taskName = newTaskName.trim()
    const taskCategory = newTaskCategory
    
    // Optimistically add task to UI
    const tempId = Date.now()
    const optimisticTask: Task = {
      id: tempId,
      name: taskName,
      category: taskCategory,
      completed: false,
      time_spent: 0,
    }
    setTasks((prev) => [...prev, optimisticTask])
    const savedName = taskName // Save before clearing
    setNewTaskName("")
    
    try {
      const newTask = await addTask(savedName, taskCategory)
      // Replace optimistic task with real one
      setTasks((prev) => prev.map(t => t.id === tempId ? {
        id: newTask.id,
        name: newTask.name,
        category: newTask.category as "work" | "personal" | "health" | "learning",
        completed: newTask.completed,
        time_spent: newTask.time_spent || 0,
      } : t))
    } catch (error) {
      console.error("Error adding task:", error)
      // Remove optimistic task on error
      setTasks((prev) => prev.filter(t => t.id !== tempId))
      // Restore input
      setNewTaskName(savedName)
      alert("Failed to add task. Please try again.")
    }
  }

  // Memoize totalHours to prevent unnecessary recalculations
  const totalHours = useMemo(() => 
    timeByCategory.reduce((sum, cat) => sum + cat.hours, 0),
    [timeByCategory]
  )

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-950/50 to-indigo-950/50 border-blue-800/50 hover:border-blue-700/50 transition-all">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-blue-300 font-semibold">Tasks Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-400">{completionRate}%</div>
            <p className="text-xs text-blue-300/70 mt-1">
              {tasks.filter((t) => t.completed).length} of {tasks.length} tasks
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-950/50 to-pink-950/50 border-purple-800/50 hover:border-purple-700/50 transition-all">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-purple-300 font-semibold">Hours Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-400">{totalHours.toFixed(1)}</div>
            <p className="text-xs text-purple-300/70 mt-1">Productive hours logged</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-950/50 to-teal-950/50 border-emerald-800/50 hover:border-emerald-700/50 transition-all">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-emerald-300 font-semibold flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              This Week
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-400">+15%</div>
            <p className="text-xs text-emerald-300/70 mt-1">Increase from last week</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border-slate-700/50 hover:border-slate-600/50 transition-all">
          <CardHeader>
            <CardTitle className="text-slate-100">Time by Category</CardTitle>
            <CardDescription className="text-slate-400">Hours spent on different activities</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
        {/* Recharts typing expects a ChartDataInput[]; our TimeData is a simple shape.
          Cast to any to satisfy the library typings without changing runtime data. */}
        <Pie data={timeByCategory as any} cx="50%" cy="50%" labelLine={false} label dataKey="hours">
                  {timeByCategory.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={Object.values(categoryColors)[index % Object.values(categoryColors).length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border-slate-700/50 hover:border-slate-600/50 transition-all">
          <CardHeader>
            <CardTitle className="text-slate-100">Daily Tasks</CardTitle>
            <CardDescription className="text-slate-400">Your tasks for today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-72 overflow-y-auto">
              {tasks.map((task) => (
                <div key={task.id} className="flex items-center gap-3 p-3 bg-gradient-to-r from-slate-700/40 to-slate-800/40 rounded-lg border border-slate-700/30 hover:border-slate-600/50 hover:from-slate-700/60 hover:to-slate-800/60 transition-all">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleToggleTask(task.id)}
                    disabled={isLoading}
                    className="w-5 h-5 accent-blue-500 cursor-pointer"
                  />
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${task.completed ? "line-through text-slate-500" : "text-slate-100"}`}>
                      {task.name}
                    </p>
                    <span className="text-xs text-slate-400">
                      {task.time_spent}h • <span className="capitalize text-slate-300">{task.category}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 space-y-2">
              <input
                type="text"
                placeholder="New task..."
                value={newTaskName}
                onChange={(e) => setNewTaskName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleAddTask()
                  }
                }}
                className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                suppressHydrationWarning
              />
              <select
                value={newTaskCategory}
                onChange={(e) => setNewTaskCategory(e.target.value as any)}
                className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                suppressHydrationWarning
              >
                <option value="work">Work</option>
                <option value="personal">Personal</option>
                <option value="health">Health</option>
                <option value="learning">Learning</option>
              </select>
              <Button
                onClick={handleAddTask}
                disabled={isLoading || !newTaskName.trim()}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold gap-2 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all"
                suppressHydrationWarning
              >
                <Plus className="w-4 h-4" />
                Add Task
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

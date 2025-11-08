"use client"

import { useState, useEffect } from "react"
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

  useEffect(() => {
    if (dbTasks && dbTasks.length > 0) {
      const transformed = dbTasks.map((t) => ({
        id: t.id,
        name: t.name,
        category: t.category as "work" | "personal" | "health" | "learning",
        completed: t.completed,
        time_spent: t.time_spent,
      }))
      setTasks(transformed)
    } else {
      // Demo data fallback
      setTasks([
        { id: 1, name: "Client Meeting", category: "work", completed: true, time_spent: 1 },
        { id: 2, name: "Code Review", category: "work", completed: true, time_spent: 2 },
        { id: 3, name: "Exercise", category: "health", completed: false, time_spent: 0.5 },
        { id: 4, name: "Learning React", category: "learning", completed: true, time_spent: 1.5 },
        { id: 5, name: "Personal Project", category: "personal", completed: false, time_spent: 1 },
      ])
    }
  }, [dbTasks]) // Updated dependency array

  const timeByCategory: TimeData[] = [
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
  ]

  const categoryColors = {
    work: "#3b82f6",
    personal: "#8b5cf6",
    health: "#ef4444",
    learning: "#10b981",
  }

  const completionRate =
    tasks.length > 0 ? Math.round((tasks.filter((t) => t.completed).length / tasks.length) * 100) : 0

  const handleToggleTask = async (id: number) => {
    const task = tasks.find((t) => t.id === id)
    if (task) {
      await toggleTask(id, !task.completed)
    }
  }

  const handleAddTask = async () => {
    if (!newTaskName.trim()) return
    try {
      await addTask(newTaskName, newTaskCategory)
      setNewTaskName("")
    } catch (error) {
      console.error("Error adding task:", error)
    }
  }

  const totalHours = timeByCategory.reduce((sum, cat) => sum + cat.hours, 0)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-slate-400">Tasks Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{completionRate}%</div>
            <p className="text-xs text-slate-500 mt-1">
              {tasks.filter((t) => t.completed).length} of {tasks.length} tasks
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-slate-400">Hours Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{totalHours.toFixed(1)}</div>
            <p className="text-xs text-slate-500 mt-1">Productive hours logged</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-slate-400 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              This Week
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">+15%</div>
            <p className="text-xs text-slate-500 mt-1">Increase from last week</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle>Time by Category</CardTitle>
            <CardDescription>Hours spent on different activities</CardDescription>
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

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle>Daily Tasks</CardTitle>
            <CardDescription>Your tasks for today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-72 overflow-y-auto">
              {tasks.map((task) => (
                <div key={task.id} className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleToggleTask(task.id)}
                    disabled={isLoading}
                    className="w-4 h-4 accent-blue-600"
                  />
                  <div className="flex-1">
                    <p className={`text-sm ${task.completed ? "line-through text-slate-500" : "text-white"}`}>
                      {task.name}
                    </p>
                    <span className="text-xs text-slate-400">
                      {task.time_spent}h • {task.category}
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
                onKeyPress={(e) => e.key === "Enter" && handleAddTask()}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
              <select
                value={newTaskCategory}
                onChange={(e) => setNewTaskCategory(e.target.value as any)}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="work">Work</option>
                <option value="personal">Personal</option>
                <option value="health">Health</option>
                <option value="learning">Learning</option>
              </select>
              <Button
                onClick={handleAddTask}
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 gap-2"
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

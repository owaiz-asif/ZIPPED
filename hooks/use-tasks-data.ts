"use client"

import { useCallback } from "react"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

interface Task {
  id: number
  user_id: number
  name: string
  category: string
  completed: boolean
  time_spent: number
  created_at: string
}

export function useTasksData(userId = 1) {
  const { data, error, isLoading, mutate } = useSWR<Task[]>(userId ? `/api/db/tasks?userId=${userId}` : null, fetcher)

  const addTask = useCallback(
    async (name: string, category: string) => {
      try {
        const res = await fetch("/api/db/tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, name, category }),
        })
        const newTask = await res.json()
        mutate([...(data || []), newTask])
        return newTask
      } catch (err) {
        console.error("Error adding task:", err)
        throw err
      }
    },
    [userId, mutate], // Only include userId and mutate
  )

  const toggleTask = useCallback(
    async (taskId: number, completed: boolean) => {
      try {
        const res = await fetch(`/api/db/tasks/${taskId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ completed }),
        })
        const updated = await res.json()
        mutate(data?.map((t) => (t.id === taskId ? updated : t)))
      } catch (err) {
        console.error("Error toggling task:", err)
      }
    },
    [data, mutate],
  )

  return { tasks: data || [], isLoading, error, addTask, toggleTask, mutate }
}

"use client"

import { useCallback } from "react"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

interface MoodEntry {
  id: number
  mood_score: number
  energy_score: number
  notes?: string
  created_at: string
}

const EMPTY_MOOD_ARRAY: MoodEntry[] = []

export function useMoodData(userId = 1) {
  const { data, error, isLoading, mutate } = useSWR<MoodEntry[]>(
    userId ? `/api/db/mood?userId=${userId}` : null,
    fetcher,
  )

  const addMood = useCallback(
    async (moodScore: number, energyScore: number, notes?: string) => {
      try {
        const res = await fetch("/api/db/mood", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, moodScore, energyScore, notes }),
        })
        const newEntry = await res.json()
        // Use optimistic update with spread operator
        mutate([newEntry, ...(data || [])])
        return newEntry
      } catch (err) {
        console.error("Error adding mood entry:", err)
        throw err
      }
    },
    [userId, mutate], // Only include userId and mutate in dependencies
  )

  return {
    // Return a stable empty array reference when data is undefined so
    // components using this hook don't receive a new array identity on
    // every render (which can trigger useEffect loops).
    moodData: data ?? EMPTY_MOOD_ARRAY,
    isLoading,
    error,
    addMood,
    mutate,
  }
}

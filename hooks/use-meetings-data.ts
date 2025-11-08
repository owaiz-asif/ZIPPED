"use client"

import useSWR from "swr"
import { useCallback } from "react"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

interface Meeting {
  id: number
  user_id: number
  title: string
  attendees?: string
  duration: number
  scheduled_time?: string
  energy_score?: number
  status: string
  created_at: string
}

export function useMeetingsData(userId = 1) {
  const { data, error, isLoading, mutate } = useSWR<Meeting[]>(
    userId ? `/api/db/meetings?userId=${userId}` : null,
    fetcher,
  )

  const addMeeting = useCallback(
    async (title: string, attendees: string, duration: number, scheduledTime?: string) => {
      try {
        const res = await fetch("/api/db/meetings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, title, attendees, duration, scheduledTime }),
        })
        const newMeeting = await res.json()
        mutate([...(data || []), newMeeting])
        return newMeeting
      } catch (err) {
        console.error("Error adding meeting:", err)
        throw err
      }
    },
    [userId, data, mutate],
  )

  return { meetings: data || [], isLoading, error, addMeeting, mutate }
}

"use client"

import useSWR from "swr"
import { useCallback } from "react"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

interface ChatMessage {
  id: number
  user_id: number
  message_text: string
  sender: "user" | "assistant"
  created_at: string
}

export function useChatData(userId = 1) {
  const { data, error, isLoading, mutate } = useSWR<ChatMessage[]>(
    userId ? `/api/db/chat?userId=${userId}` : null,
    fetcher,
    { revalidateOnFocus: false },
  )

  const addMessage = useCallback(
    async (messageText: string, sender: "user" | "assistant") => {
      try {
        const res = await fetch("/api/db/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, messageText, sender }),
        })
        const newMessage = await res.json()
        mutate([...(data || []), newMessage])
        return newMessage
      } catch (err) {
        console.error("Error adding chat message:", err)
        throw err
      }
    },
    [userId, mutate], // Only include userId and mutate
  )

  return { messages: data || [], isLoading, error, addMessage, mutate }
}

"use client"

import { useState, useEffect } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Brain, Heart, TrendingUp, Zap } from "lucide-react"
import EmotionDetector from "@/components/emotion-detector"
import MeetingSchedulerNew from "@/components/meeting-scheduler-new"
import { useMoodData } from "@/hooks/use-mood-data"

const DEMO_USER_ID = 1

interface MoodEntry {
  time: string
  mood: number
  energy: number
}

export default function Dashboard() {
  const { moodData: dbMoodEntries, addMood, isLoading } = useMoodData(DEMO_USER_ID)

  const [moodData, setMoodData] = useState<MoodEntry[]>([])
  const [stats, setStats] = useState({
    avgMood: 68,
    avgEnergy: 73,
    focusScore: 82,
    stressLevel: 35,
  })

  useEffect(() => {
    if (dbMoodEntries && dbMoodEntries.length > 0) {
      const transformed = dbMoodEntries
        .map((entry: any) => ({
          time: new Date(entry.created_at).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
          mood: entry.mood_score,
          energy: entry.energy_score,
        }))
        .reverse()

      setMoodData(transformed)

      // Calculate averages
      const avgMood = Math.round(transformed.reduce((sum, m) => sum + m.mood, 0) / transformed.length)
      const avgEnergy = Math.round(transformed.reduce((sum, m) => sum + m.energy, 0) / transformed.length)

      setStats({
        avgMood,
        avgEnergy,
        focusScore: Math.round((avgMood + avgEnergy) / 2),
        stressLevel: Math.round(100 - (avgMood + avgEnergy) / 2),
      })
    } else {
      // Demo data fallback
      setMoodData([
        { time: "8am", mood: 65, energy: 70 },
        { time: "10am", mood: 72, energy: 85 },
        { time: "12pm", mood: 68, energy: 75 },
        { time: "2pm", mood: 60, energy: 55 },
        { time: "4pm", mood: 70, energy: 80 },
        { time: "6pm", mood: 75, energy: 70 },
      ])
    }
  }, [dbMoodEntries])

  const handleQuickMoodUpdate = async (mood: number) => {
    try {
      const energy = Math.random() * 30 + 60
      await addMood(mood, Math.round(energy))
    } catch (error) {
      console.error("Error updating mood:", error)
    }
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-slate-400 flex items-center gap-2">
              <Heart className="w-4 h-4 text-red-500" />
              Average Mood
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stats.avgMood}%</div>
            <p className="text-xs text-slate-500 mt-1">Today</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-slate-400 flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-500" />
              Energy Level
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stats.avgEnergy}%</div>
            <p className="text-xs text-slate-500 mt-1">Current</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-slate-400 flex items-center gap-2">
              <Brain className="w-4 h-4 text-blue-500" />
              Focus Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stats.focusScore}%</div>
            <p className="text-xs text-slate-500 mt-1">Excellent</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-slate-400 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-orange-500" />
              Stress Level
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stats.stressLevel}%</div>
            <p className="text-xs text-slate-500 mt-1">Low</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle>Mood & Energy Trends</CardTitle>
          <CardDescription>Your emotional state throughout the day</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-[300px] flex items-center justify-center text-slate-400">Loading data...</div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={moodData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="time" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }}
                  labelStyle={{ color: "#e2e8f0" }}
                />
                <Line type="monotone" dataKey="mood" stroke="#3b82f6" name="Mood" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="energy" stroke="#fbbf24" name="Energy" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle>Quick Mood Check-in</CardTitle>
          <CardDescription>How are you feeling right now?</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          {[
            { emoji: "😢", label: "Poor", value: 20 },
            { emoji: "😕", label: "Fair", value: 40 },
            { emoji: "😐", label: "Okay", value: 60 },
            { emoji: "😊", label: "Good", value: 80 },
            { emoji: "🤩", label: "Excellent", value: 100 },
          ].map((item) => (
            <Button
              key={item.value}
              onClick={() => handleQuickMoodUpdate(item.value)}
              disabled={isLoading}
              variant="outline"
              className="flex flex-col items-center gap-1 h-auto py-3 px-4 border-slate-700 hover:bg-slate-700"
            >
              <span className="text-2xl">{item.emoji}</span>
              <span className="text-xs">{item.label}</span>
            </Button>
          ))}
        </CardContent>
      </Card>

      <EmotionDetector />

      <div className="mt-8">
        <MeetingSchedulerNew />
      </div>
    </div>
  )
}

"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { day: "Mon", mood: 65, stress: 45, focus: 70 },
  { day: "Tue", mood: 70, stress: 40, focus: 75 },
  { day: "Wed", mood: 68, stress: 50, focus: 68 },
  { day: "Thu", mood: 75, stress: 35, focus: 80 },
  { day: "Fri", mood: 78, stress: 30, focus: 82 },
  { day: "Sat", mood: 82, stress: 25, focus: 75 },
  { day: "Sun", mood: 80, stress: 28, focus: 72 },
]

export default function EmotionTrends() {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 backdrop-blur-sm">
      <h2 className="text-xl font-bold text-white mb-4">Emotion & Productivity Trends</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
          <XAxis stroke="rgba(148,163,184,0.5)" />
          <YAxis stroke="rgba(148,163,184,0.5)" />
          <Tooltip
            contentStyle={{ backgroundColor: "rgba(15,23,42,0.95)", border: "1px solid rgba(148,163,184,0.2)" }}
          />
          <Line type="monotone" dataKey="mood" stroke="#3b82f6" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="stress" stroke="#ef4444" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="focus" stroke="#10b981" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
      <div className="flex gap-6 mt-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span className="text-slate-400">Mood</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span className="text-slate-400">Stress</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-slate-400">Focus</span>
        </div>
      </div>
    </div>
  )
}

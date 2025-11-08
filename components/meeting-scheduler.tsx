"use client"

import { Calendar, AlertCircle } from "lucide-react"

const suggestions = [
  { time: "10:00 AM", activity: "Design Review", reason: "Peak energy & focus", confidence: "95%" },
  { time: "2:30 PM", activity: "Team Sync", reason: "Good mood, open to discussion", confidence: "88%" },
  { time: "4:00 PM", activity: "Creative Brainstorm", reason: "High creativity index", confidence: "92%" },
]

export default function MeetingScheduler() {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 backdrop-blur-sm">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <Calendar size={20} className="text-purple-400" />
        Predicted Best Meeting Times
      </h3>

      <div className="space-y-3">
        {suggestions.map((s) => (
          <div
            key={s.time}
            className="bg-slate-700/30 border border-slate-600 rounded-lg p-4 hover:border-purple-500/50 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="font-semibold text-white">{s.time}</div>
                <div className="text-sm text-slate-400">{s.activity}</div>
                <div className="text-xs text-slate-500 mt-1">{s.reason}</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-green-400">{s.confidence}</div>
                <div className="text-xs text-slate-500">confidence</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 flex gap-2">
        <AlertCircle size={16} className="text-amber-400 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-200">Avoid back-to-back meetings before 9 AM based on your energy patterns</p>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Trello, BarChart3 } from "lucide-react"

const socialPlatforms = [
  { name: "Gmail", connected: true, icon: "📧", status: "Active", lastSync: "2 mins ago" },
  { name: "LinkedIn", connected: true, icon: "💼", status: "Active", lastSync: "15 mins ago" },
  { name: "Slack", connected: true, icon: "💬", status: "Active", lastSync: "5 mins ago" },
  { name: "Twitter/X", connected: false, icon: "𝕏", status: "Not Connected", lastSync: "Never" },
  { name: "Facebook", connected: false, icon: "👥", status: "Not Connected", lastSync: "Never" },
  { name: "Instagram", connected: false, icon: "📸", status: "Not Connected", lastSync: "Never" },
]

export default function SocialMediaIntegration() {
  const [platforms, setPlatforms] = useState(socialPlatforms)

  const toggleConnection = (index: number) => {
    const updated = [...platforms]
    updated[index].connected = !updated[index].connected
    setPlatforms(updated)
  }

  return (
    <div className="space-y-6">
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 backdrop-blur-sm">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Trello size={24} className="text-blue-400" />
          Social Media & Platform Integration
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {platforms.map((platform, idx) => (
            <div
              key={platform.name}
              className={`border rounded-lg p-4 transition-all ${
                platform.connected ? "bg-green-500/10 border-green-500/50" : "bg-slate-700/20 border-slate-600"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="text-3xl">{platform.icon}</div>
                <button
                  onClick={() => toggleConnection(idx)}
                  className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                    platform.connected
                      ? "bg-green-500/30 text-green-300 hover:bg-green-500/40"
                      : "bg-slate-600 text-slate-300 hover:bg-slate-500"
                  }`}
                >
                  {platform.connected ? "✓ Connected" : "Connect"}
                </button>
              </div>
              <h3 className="font-semibold text-white">{platform.name}</h3>
              <div className="text-xs text-slate-400 mt-2">{platform.status}</div>
              <div className="text-xs text-slate-500 mt-1">Synced: {platform.lastSync}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 backdrop-blur-sm">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <BarChart3 size={20} className="text-purple-400" />
          Emotion Analysis Across Platforms
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { platform: "Gmail", positive: 78, negative: 12, neutral: 10 },
            { platform: "LinkedIn", positive: 82, negative: 8, neutral: 10 },
            { platform: "Slack", positive: 75, negative: 15, neutral: 10 },
            { platform: "Twitter", positive: 65, negative: 25, neutral: 10 },
          ].map((p) => (
            <div key={p.platform} className="bg-slate-700/30 rounded-lg p-4 border border-slate-600">
              <div className="font-semibold text-white text-sm mb-3">{p.platform}</div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-green-400">Positive</span>
                  <span className="text-sm font-bold text-green-400">{p.positive}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-red-400">Negative</span>
                  <span className="text-sm font-bold text-red-400">{p.negative}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Neutral</span>
                  <span className="text-sm font-bold text-slate-400">{p.neutral}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

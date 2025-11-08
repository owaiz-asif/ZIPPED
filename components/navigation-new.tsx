"use client"

import { MessageCircle, BarChart3, Home, Zap } from "lucide-react"

export default function Navigation({
  activeTab,
  setActiveTab,
}: { activeTab: string; setActiveTab: (tab: string) => void }) {
  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "chat", label: "AI Assistant", icon: MessageCircle },
    { id: "productivity", label: "Analytics", icon: BarChart3 },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">AI Heir</h1>
          </div>

          <div className="flex gap-1">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                  activeTab === id
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                    : "text-slate-400 hover:text-slate-300 hover:bg-slate-800/50"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}

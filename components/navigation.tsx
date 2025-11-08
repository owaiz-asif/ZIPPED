"use client"

import { Brain, Mail, Trello, Settings } from "lucide-react"

export default function Navigation({
  activeTab,
  setActiveTab,
}: { activeTab: string; setActiveTab: (tab: string) => void }) {
  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: Brain },
    { id: "email", label: "Email Intelligence", icon: Mail },
    { id: "social", label: "Social Media", icon: Trello },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 bg-slate-950/95 border-b border-slate-800 backdrop-blur-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Brain size={18} className="text-white" />
            </div>
            <span className="font-bold text-lg text-white">AI Heir</span>
          </div>

          <div className="flex gap-1">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 text-sm font-medium ${
                  activeTab === id
                    ? "bg-blue-500/20 border border-blue-500 text-blue-300"
                    : "text-slate-400 hover:text-slate-300"
                }`}
              >
                <Icon size={16} />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}

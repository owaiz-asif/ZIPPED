"use client"

import { useState } from "react"
import Dashboard from "@/components/dashboard"
import ChatInterface from "@/components/chat-interface"
import ProductivityTracker from "@/components/productivity-tracker"
import Navigation from "@/components/navigation-new"

export default function Home() {
  const [activeTab, setActiveTab] = useState("dashboard")

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {activeTab === "dashboard" && <Dashboard />}
          {activeTab === "chat" && <ChatInterface />}
          {activeTab === "productivity" && <ProductivityTracker />}
        </div>
      </main>
    </div>
  )
}

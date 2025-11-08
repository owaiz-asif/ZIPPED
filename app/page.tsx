"use client"

import { useState } from "react"
import Dashboard from "@/components/dashboard"
import ChatInterface from "@/components/chat-interface"
import ProductivityTracker from "@/components/productivity-tracker"
import NavigationEnhanced from "@/components/navigation-enhanced"
import MeetingSchedulerNew from "@/components/meeting-scheduler-new"
import EmotionDetector from "@/components/emotion-detector"
import EmailDraft from "@/components/email-draft"
import BlockchainVerify from "@/components/blockchain-verify"
import SocialMediaIntegration from "@/components/social-media-integration"
import RAGUpload from "@/components/rag-upload"
import SettingsPage from "@/components/settings-page"

export default function Home() {
  const [activeTab, setActiveTab] = useState("dashboard")

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
      <NavigationEnhanced activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {activeTab === "dashboard" && <Dashboard />}
          {activeTab === "chat" && <ChatInterface />}
          {activeTab === "productivity" && <ProductivityTracker />}
          {activeTab === "meetings" && (
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-white mb-6">Meeting Management</h1>
              <MeetingSchedulerNew />
            </div>
          )}
          {activeTab === "emotions" && (
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-white mb-6">Emotion & Mood Tracking</h1>
              <EmotionDetector />
            </div>
          )}
          {activeTab === "email" && (
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-white mb-6">Email Management</h1>
              <EmailDraft />
            </div>
          )}
          {activeTab === "blockchain" && (
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-white mb-6">Blockchain Verification</h1>
              <div className="max-w-2xl">
                <BlockchainVerify />
              </div>
            </div>
          )}
          {activeTab === "social" && (
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-white mb-6">Social Media Integration</h1>
              <SocialMediaIntegration />
            </div>
          )}
          {activeTab === "rag" && (
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-white mb-6">RAG Document Upload</h1>
              <RAGUpload />
            </div>
          )}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-white mb-6">Settings</h1>
              <SettingsPage />
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

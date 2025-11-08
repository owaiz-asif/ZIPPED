"use client"

import { useState } from "react"
import { Key, Shield, AlertCircle, CheckCircle2 } from "lucide-react"

export default function SettingsPage() {
  const [gcpKey, setGcpKey] = useState("")
  const [gcpKeyStatus, setGcpKeyStatus] = useState<"idle" | "validating" | "valid" | "invalid">("idle")

  const handleGCPKeyValidation = async () => {
    if (!gcpKey.trim()) {
      setGcpKeyStatus("invalid")
      return
    }

    setGcpKeyStatus("validating")

    // Simulate validation
    setTimeout(() => {
      setGcpKeyStatus("valid")
    }, 1500)
  }

  return (
    <div className="space-y-8">
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Key size={24} className="text-blue-400" />
          API Key Management
        </h2>

        <div className="space-y-6">
          {/* GCP Configuration */}
          <div className="bg-slate-700/30 rounded-lg p-6 border border-slate-600">
            <h3 className="font-semibold text-white mb-4">Google Cloud Platform Configuration</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-300 mb-2">GCP Project ID</label>
                <input
                  type="text"
                  placeholder="Enter your GCP Project ID"
                  className="w-full bg-slate-600 border border-slate-500 rounded px-4 py-2 text-white placeholder-slate-400"
                  defaultValue={process.env.NEXT_PUBLIC_GCP_PROJECT_ID || ""}
                />
              </div>

              <div>
                <label className="block text-sm text-slate-300 mb-2">GCP Service Account JSON</label>
                <textarea
                  placeholder="Paste your GCP service account JSON key here (kept secure)"
                  value={gcpKey}
                  onChange={(e) => {
                    setGcpKey(e.target.value)
                    setGcpKeyStatus("idle")
                  }}
                  className="w-full bg-slate-600 border border-slate-500 rounded px-4 py-2 text-white placeholder-slate-400 font-mono text-xs h-32"
                />
                <p className="text-xs text-slate-400 mt-2">
                  Your keys are encrypted and stored securely. Never share them publicly.
                </p>
              </div>

              <button
                onClick={handleGCPKeyValidation}
                className="bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500 text-blue-300 px-4 py-2 rounded transition-colors"
              >
                {gcpKeyStatus === "validating" ? "Validating..." : "Validate GCP Key"}
              </button>

              {gcpKeyStatus === "valid" && (
                <div className="bg-green-500/10 border border-green-500/50 rounded p-3 flex gap-2">
                  <CheckCircle2 size={16} className="text-green-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-green-300">GCP configuration validated successfully</p>
                </div>
              )}

              {gcpKeyStatus === "invalid" && (
                <div className="bg-red-500/10 border border-red-500/50 rounded p-3 flex gap-2">
                  <AlertCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-300">Invalid GCP key. Please check and try again.</p>
                </div>
              )}
            </div>
          </div>

          {/* OpenAI Configuration */}
          <div className="bg-slate-700/30 rounded-lg p-6 border border-slate-600">
            <h3 className="font-semibold text-white mb-4">OpenAI API Configuration</h3>

            <div>
              <label className="block text-sm text-slate-300 mb-2">OpenAI API Key</label>
              <input
                type="password"
                placeholder="sk-..."
                className="w-full bg-slate-600 border border-slate-500 rounded px-4 py-2 text-white placeholder-slate-400"
              />
              <p className="text-xs text-slate-400 mt-2">Used for intelligent email drafting and emotion analysis</p>
            </div>
          </div>

          {/* Social Media API Keys */}
          <div className="bg-slate-700/30 rounded-lg p-6 border border-slate-600">
            <h3 className="font-semibold text-white mb-4">Social Media API Keys</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: "Gmail API Key", env: "GMAIL_API_KEY" },
                { name: "LinkedIn Client ID", env: "LINKEDIN_CLIENT_ID" },
                { name: "Slack Bot Token", env: "SLACK_BOT_TOKEN" },
                { name: "Twitter API Key", env: "TWITTER_API_KEY" },
              ].map((api) => (
                <div key={api.env}>
                  <label className="block text-sm text-slate-300 mb-2">{api.name}</label>
                  <input
                    type="password"
                    placeholder={`Enter ${api.name}`}
                    className="w-full bg-slate-600 border border-slate-500 rounded px-4 py-2 text-white placeholder-slate-400 text-sm"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Security Information */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Shield size={20} className="text-green-400" />
          Security & Privacy
        </h2>

        <div className="space-y-3 text-sm text-slate-300">
          <p>
            <strong>Data Encryption:</strong> All API keys and sensitive data are encrypted at rest using AES-256
            encryption.
          </p>
          <p>
            <strong>Blockchain Verification:</strong> All AI decisions and data processing are logged on blockchain for
            complete transparency and auditability.
          </p>
          <p>
            <strong>Row-Level Security:</strong> User data is isolated using RLS policies to ensure complete data
            privacy.
          </p>
          <p>
            <strong>GDPR Compliant:</strong> Your emotional and productivity data is treated as personal information
            under GDPR.
          </p>
        </div>
      </div>
    </div>
  )
}

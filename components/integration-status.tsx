"use client"

import { useState, useEffect } from "react"
import { CheckCircle2, AlertCircle, Zap } from "lucide-react"

interface Integration {
  name: string
  status: "connected" | "error" | "pending"
  lastCheck: string
  message: string
}

export default function IntegrationStatus() {
  const [integrations, setIntegrations] = useState<Integration[]>([
    { name: "GCP APIs", status: "pending", lastCheck: "checking...", message: "Validating credentials" },
    { name: "OpenAI", status: "pending", lastCheck: "checking...", message: "Checking API connection" },
    { name: "Blockchain", status: "pending", lastCheck: "checking...", message: "Connecting to network" },
  ])

  useEffect(() => {
    // Simulate integration checks
    const timer = setTimeout(() => {
      setIntegrations([
        { name: "GCP APIs", status: "connected", lastCheck: "now", message: "All services accessible" },
        { name: "OpenAI", status: "connected", lastCheck: "now", message: "API ready for requests" },
        { name: "Blockchain", status: "connected", lastCheck: "now", message: "Network synchronized" },
      ])
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <Zap size={20} className="text-yellow-400" />
        Integration Status
      </h3>

      <div className="space-y-3">
        {integrations.map((integration) => (
          <div
            key={integration.name}
            className="flex items-center justify-between bg-slate-700/30 rounded-lg p-4 border border-slate-600"
          >
            <div className="flex items-center gap-3">
              {integration.status === "connected" && <CheckCircle2 size={20} className="text-green-400" />}
              {integration.status === "error" && <AlertCircle size={20} className="text-red-400" />}
              {integration.status === "pending" && (
                <div className="animate-spin">
                  <Zap size={20} className="text-yellow-400" />
                </div>
              )}

              <div>
                <div className="font-semibold text-white">{integration.name}</div>
                <div className="text-xs text-slate-400">{integration.message}</div>
              </div>
            </div>

            <div className="text-xs text-slate-500">{integration.lastCheck}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

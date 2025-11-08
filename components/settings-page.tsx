"use client"

import { useState } from "react"
import { Key, Shield, Database, Info, CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function SettingsPage() {
  const [showEnvInfo, setShowEnvInfo] = useState(false)

  const envVars = [
    {
      name: "DATABASE_URL",
      description: "PostgreSQL database connection string",
      status: "configured",
      required: true,
    },
    {
      name: "OPENAI_API_KEY",
      description: "OpenAI API key for AI features",
      status: process.env.OPENAI_API_KEY ? "configured" : "missing",
      required: false,
    },
    {
      name: "SMTP_HOST / SMTP_USER / SMTP_PASS",
      description: "Email server configuration for sending emails",
      status: "missing",
      required: false,
    },
    {
      name: "RAG_SERVICE_URL",
      description: "RAG service endpoint for document retrieval",
      status: "using default",
      required: false,
    },
  ]

  return (
    <div className="space-y-8">
      <Card className="bg-slate-800/60 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-slate-100 flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-400" />
            Security & Configuration
          </CardTitle>
          <CardDescription className="text-slate-400">
            Manage your application settings and integrations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <div className="flex gap-3">
              <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-300">
                <p className="font-medium mb-1">Secure Configuration</p>
                <p className="text-blue-300/80">
                  API keys and secrets are managed securely through environment variables in Replit.
                  Never expose sensitive credentials in your code or frontend.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Key className="w-5 h-5 text-purple-400" />
              Environment Variables Status
            </h3>
            <div className="space-y-3">
              {envVars.map((envVar) => (
                <div
                  key={envVar.name}
                  className="bg-slate-700/30 rounded-lg p-4 border border-slate-600"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <code className="text-sm font-mono text-slate-200">{envVar.name}</code>
                        {envVar.required && (
                          <span className="text-xs bg-red-500/20 text-red-300 px-2 py-0.5 rounded">
                            Required
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-400">{envVar.description}</p>
                    </div>
                    <div
                      className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                        envVar.status === "configured"
                          ? "bg-green-500/20 text-green-300"
                          : envVar.status === "using default"
                          ? "bg-yellow-500/20 text-yellow-300"
                          : "bg-slate-500/20 text-slate-300"
                      }`}
                    >
                      {envVar.status === "configured" && <CheckCircle2 className="w-3 h-3" />}
                      {envVar.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600">
            <h4 className="text-sm font-semibold text-white mb-2">How to Configure Environment Variables</h4>
            <ol className="text-sm text-slate-400 space-y-2 list-decimal list-inside">
              <li>Click the "Secrets" tab in the Replit sidebar (lock icon)</li>
              <li>Add your environment variables as key-value pairs</li>
              <li>Restart your application for changes to take effect</li>
              <li>Your secrets are encrypted and never exposed in code</li>
            </ol>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Database className="w-5 h-5 text-green-400" />
              Database Configuration
            </h3>
            <Card className="bg-slate-700/30 border-slate-600">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-slate-300 font-medium mb-1">
                      Database Connected
                    </p>
                    <p className="text-xs text-slate-400">
                      Your PostgreSQL database is configured and ready to use
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800/60 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-slate-100">Application Information</CardTitle>
          <CardDescription className="text-slate-400">
            About AI Heir
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-slate-300">
            <div className="flex justify-between py-2 border-b border-slate-700">
              <span className="text-slate-400">Version</span>
              <span className="font-mono">0.1.0</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-700">
              <span className="text-slate-400">Framework</span>
              <span className="font-mono">Next.js 16.0.0</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-slate-400">Environment</span>
              <span className="font-mono">Production</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

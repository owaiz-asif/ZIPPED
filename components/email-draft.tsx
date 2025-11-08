"use client"

import { useState } from "react"
import { Mail, Zap } from "lucide-react"

export default function EmailDraft() {
  const [incomingEmail, setIncomingEmail] = useState(
    "Hey, I'm frustrated with the project delays. Can we discuss this?",
  )
  const [draftResponse, setDraftResponse] = useState("")

  const generateEmpathetic = () => {
    setDraftResponse(
      `Hi,\n\nI understand your frustration—project delays can be really stressful. I've been feeling it too. Let's schedule a meeting tomorrow morning to discuss the blockers and create a realistic timeline.\n\nI'm confident we can turn this around together.\n\nBest regards`,
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 backdrop-blur-sm">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Mail size={20} className="text-blue-400" />
          Incoming Email
        </h3>
        <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600">
          <p className="text-slate-300 whitespace-pre-wrap">{incomingEmail}</p>
          <div className="mt-4 pt-4 border-t border-slate-600">
            <div className="inline-block bg-red-500/20 text-red-300 text-xs px-2 py-1 rounded">Stressed Tone</div>
          </div>
        </div>
      </div>

      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 backdrop-blur-sm">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Zap size={20} className="text-green-400" />
          AI-Generated Reply (Empathetic)
        </h3>
        {!draftResponse ? (
          <button
            onClick={generateEmpathetic}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 rounded-lg transition-all"
          >
            Generate Empathetic Reply
          </button>
        ) : (
          <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/30">
            <p className="text-slate-200 whitespace-pre-wrap">{draftResponse}</p>
            <button className="mt-4 w-full bg-green-500/20 hover:bg-green-500/30 border border-green-500 text-green-300 py-2 rounded transition-colors">
              Accept & Send
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

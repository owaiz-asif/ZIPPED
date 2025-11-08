"use client"

import { Lock, CheckCircle2 } from "lucide-react"

export default function BlockchainVerify() {
  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-green-500/20 rounded-xl p-6 backdrop-blur-sm">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <Lock size={20} className="text-green-400" />
        Blockchain Verification
      </h3>

      <div className="space-y-3">
        <div className="bg-slate-700/30 rounded-lg p-3 border border-slate-600">
          <div className="flex items-start gap-2">
            <CheckCircle2 size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-mono text-slate-300 break-all">0x7a9c8f3b2e1d4a6c</div>
              <div className="text-xs text-slate-500 mt-1">Mood Analysis Hash</div>
            </div>
          </div>
        </div>

        <div className="bg-slate-700/30 rounded-lg p-3 border border-slate-600">
          <div className="flex items-start gap-2">
            <CheckCircle2 size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-mono text-slate-300 break-all">0x5e2d1a9c4b7f3e8a</div>
              <div className="text-xs text-slate-500 mt-1">Meeting Schedule Hash</div>
            </div>
          </div>
        </div>

        <div className="bg-green-500/10 rounded-lg p-3 border border-green-500/30 text-xs text-green-300">
          All AI decisions are permanently recorded and verifiable on blockchain for complete transparency and trust.
        </div>
      </div>
    </div>
  )
}

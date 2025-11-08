export default function DashboardHeader() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white">Welcome to AI Heir</h1>
          <p className="text-slate-400 mt-2">Your emotionally intelligent assistant</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-4 rounded-xl">
          <div className="text-white font-semibold">76%</div>
          <div className="text-sm text-blue-100">Productivity Score</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Mood Trend", value: "📈 Improving", color: "from-green-500 to-emerald-600" },
          { label: "Energy Level", value: "⚡ High", color: "from-yellow-500 to-orange-600" },
          { label: "Stress Index", value: "😌 Low", color: "from-blue-500 to-cyan-600" },
          { label: "Focus Score", value: "🎯 Excellent", color: "from-purple-500 to-pink-600" },
        ].map((stat) => (
          <div key={stat.label} className={`bg-gradient-to-br ${stat.color} rounded-lg p-4`}>
            <div className="text-sm text-white/80">{stat.label}</div>
            <div className="text-xl font-bold text-white mt-1">{stat.value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

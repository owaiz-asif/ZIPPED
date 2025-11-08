"use client"

import { useState } from "react"
import {
  Home,
  MessageCircle,
  BarChart3,
  Calendar,
  Heart,
  Mail,
  Lock,
  Share2,
  Upload,
  Settings,
  Menu,
  X,
  Zap,
  ChevronDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface NavigationProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export default function NavigationEnhanced({ activeTab, setActiveTab }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showMoreMenu, setShowMoreMenu] = useState(false)

  const mainNavItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "chat", label: "AI Chat", icon: MessageCircle },
    { id: "productivity", label: "Tasks", icon: BarChart3 },
    { id: "meetings", label: "Meetings", icon: Calendar },
    { id: "emotions", label: "Emotions", icon: Heart },
  ]

  const moreNavItems = [
    { id: "email", label: "Email", icon: Mail },
    { id: "blockchain", label: "Blockchain", icon: Lock },
    { id: "social", label: "Social Media", icon: Share2 },
    { id: "rag", label: "RAG Upload", icon: Upload },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  const handleNavClick = (id: string) => {
    setActiveTab(id)
    setMobileMenuOpen(false)
    setShowMoreMenu(false)
  }

  return (
    <nav className="fixed top-0 left-0 right-0 bg-slate-900/95 backdrop-blur-xl border-b border-slate-800 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text hidden sm:block">
              AI Heir
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {mainNavItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => handleNavClick(id)}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                  activeTab === id
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/20"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/70"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{label}</span>
              </button>
            ))}

            {/* More Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowMoreMenu(!showMoreMenu)}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                  moreNavItems.some((item) => item.id === activeTab)
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/20"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/70"
                }`}
              >
                <Menu className="w-4 h-4" />
                <span className="text-sm font-medium">More</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showMoreMenu ? "rotate-180" : ""}`} />
              </button>

              {showMoreMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden">
                  {moreNavItems.map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() => handleNavClick(id)}
                      className={`w-full px-4 py-3 flex items-center gap-3 transition-all ${
                        activeTab === id
                          ? "bg-blue-600 text-white"
                          : "text-slate-300 hover:bg-slate-700 hover:text-white"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/70 transition-all"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-800 py-3 space-y-1">
            {[...mainNavItems, ...moreNavItems].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => handleNavClick(id)}
                className={`w-full px-4 py-3 flex items-center gap-3 rounded-lg transition-all ${
                  activeTab === id
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/70"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm font-medium">{label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}

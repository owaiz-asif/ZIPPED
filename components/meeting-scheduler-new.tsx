"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Users, Check } from "lucide-react"

interface TimeSlot {
  time: string
  available: boolean
  energyLevel: number
  reason?: string
}

interface Meeting {
  id: string
  title: string
  attendees: string
  duration: number
  proposedTime: string
  status: "proposed" | "scheduled" | "completed"
}

export default function MeetingScheduler() {
  const meetingIdCounter = useRef(2) // Start at 2 since we have 2 initial meetings
  
  const [meetings, setMeetings] = useState<Meeting[]>([
    {
      id: "1",
      title: "Team Standup",
      attendees: "5 people",
      duration: 30,
      proposedTime: "10:00 AM",
      status: "scheduled",
    },
    {
      id: "2",
      title: "Client Call",
      attendees: "3 people",
      duration: 60,
      proposedTime: "Optimal: 2:00 PM",
      status: "proposed",
    },
  ])

  const [newMeeting, setNewMeeting] = useState({
    title: "",
    attendees: "",
    duration: 30,
  })

  const timeSlots: TimeSlot[] = [
    { time: "8:00 AM", available: false, energyLevel: 60, reason: "Low energy - avoid meetings" },
    { time: "9:00 AM", available: true, energyLevel: 75, reason: "" },
    { time: "10:00 AM", available: true, energyLevel: 90, reason: "Peak focus time - ideal" },
    { time: "11:00 AM", available: true, energyLevel: 85, reason: "" },
    { time: "12:00 PM", available: false, energyLevel: 70, reason: "Lunch break" },
    { time: "1:00 PM", available: false, energyLevel: 55, reason: "Post-lunch dip" },
    { time: "2:00 PM", available: true, energyLevel: 80, reason: "Good for calls" },
    { time: "3:00 PM", available: true, energyLevel: 75, reason: "" },
    { time: "4:00 PM", available: true, energyLevel: 65, reason: "End of day" },
    { time: "5:00 PM", available: false, energyLevel: 40, reason: "Energy decline - avoid" },
  ]

  const handleAddMeeting = () => {
    if (!newMeeting.title.trim()) return

    const bestSlot = timeSlots.find((slot) => slot.available && slot.energyLevel > 75)

    meetingIdCounter.current += 1
    const meeting: Meeting = {
      id: `meeting-${meetingIdCounter.current}`,
      title: newMeeting.title,
      attendees: newMeeting.attendees || "TBD",
      duration: newMeeting.duration,
      proposedTime: bestSlot ? `Optimal: ${bestSlot.time}` : "Choose a time",
      status: "proposed",
    }

    setMeetings([...meetings, meeting])
    setNewMeeting({ title: "", attendees: "", duration: 30 })
  }

  const handleScheduleMeeting = (id: string) => {
    setMeetings(meetings.map((m) => (m.id === id ? { ...m, status: "scheduled" } : m)))
  }

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-500" />
            Schedule Meeting
          </CardTitle>
          <CardDescription>AI Heir will recommend the best time based on your energy levels</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm text-slate-300 mb-2 block">Meeting Title</label>
            <input
              type="text"
              placeholder="e.g., Client Meeting, Team Sync"
              value={newMeeting.title}
              onChange={(e) => setNewMeeting({ ...newMeeting, title: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === "Enter" && newMeeting.title.trim()) {
                  e.preventDefault()
                  handleAddMeeting()
                }
              }}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
              suppressHydrationWarning
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-slate-300 mb-2 block">Attendees</label>
              <input
                type="text"
                placeholder="Number or names"
                value={newMeeting.attendees}
                onChange={(e) => setNewMeeting({ ...newMeeting, attendees: e.target.value })}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                suppressHydrationWarning
              />
            </div>
            <div>
              <label className="text-sm text-slate-300 mb-2 block">Duration (minutes)</label>
              <select
                value={newMeeting.duration}
                onChange={(e) => setNewMeeting({ ...newMeeting, duration: Number.parseInt(e.target.value) })}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                title="Select meeting duration"
                suppressHydrationWarning
              >
                <option value="15">15 min</option>
                <option value="30">30 min</option>
                <option value="60">1 hour</option>
                <option value="90">1.5 hours</option>
                <option value="120">2 hours</option>
              </select>
            </div>
          </div>

          <Button onClick={handleAddMeeting} className="w-full bg-blue-600 hover:bg-blue-700" suppressHydrationWarning>
            <Calendar className="w-4 h-4 mr-2" />
            Get AI Recommendation
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-green-500" />
            Optimal Time Slots
          </CardTitle>
          <CardDescription>Based on your energy levels and focus patterns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {timeSlots.map((slot, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg border transition-all ${
                  slot.available
                    ? "bg-slate-700/50 border-slate-600 hover:border-blue-500"
                    : "bg-slate-700/20 border-slate-700 opacity-50"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-white">{slot.time}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-slate-600 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          slot.energyLevel > 80
                            ? "bg-green-500"
                            : slot.energyLevel > 60
                              ? "bg-yellow-500"
                              : "bg-red-500"
                        }`}
                        style={{ width: `${slot.energyLevel}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-400 w-8">{slot.energyLevel}%</span>
                  </div>
                </div>
                {slot.reason && <p className="text-xs text-slate-400">{slot.reason}</p>}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-500" />
            Scheduled Meetings
          </CardTitle>
          <CardDescription>Your upcoming meetings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {meetings.map((meeting) => (
              <div
                key={meeting.id}
                className="bg-slate-700/50 rounded-lg p-4 border border-slate-600 flex items-start justify-between"
              >
                <div className="flex-1">
                  <h4 className="font-semibold text-white mb-1">{meeting.title}</h4>
                  <div className="flex gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {meeting.attendees}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {meeting.duration} min
                    </span>
                  </div>
                  <p className="text-sm text-blue-400 mt-2">{meeting.proposedTime}</p>
                </div>

                {meeting.status === "proposed" ? (
                  <Button
                    onClick={() => handleScheduleMeeting(meeting.id)}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 ml-4"
                    suppressHydrationWarning
                  >
                    <Check className="w-3 h-3" />
                  </Button>
                ) : (
                  <div className="text-xs text-green-400 font-semibold ml-4">Scheduled</div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Users, Video, MapPin, Plus } from "lucide-react"
import { useVoice } from "@/components/voice-provider"

const scheduleItems = [
  {
    id: 1,
    time: "09:00",
    title: "Daily Standup",
    type: "meeting",
    duration: "30 min",
    attendees: ["Team Lead", "Developers"],
    location: "Conference Room A",
    hasVoiceReminder: true,
    status: "upcoming",
  },
  {
    id: 2,
    time: "10:30",
    title: "Code Review Session",
    type: "work",
    duration: "1 hour",
    project: "E-commerce Platform",
    hasVoiceReminder: true,
    status: "upcoming",
  },
  {
    id: 3,
    time: "12:00",
    title: "Lunch Break",
    type: "break",
    duration: "1 hour",
    hasVoiceReminder: false,
    status: "upcoming",
  },
  {
    id: 4,
    time: "14:00",
    title: "Client Presentation",
    type: "meeting",
    duration: "45 min",
    attendees: ["Client", "Project Manager"],
    location: "Video Call",
    hasVoiceReminder: true,
    status: "upcoming",
  },
  {
    id: 5,
    time: "16:00",
    title: "Development Work",
    type: "work",
    duration: "2 hours",
    project: "AI Dashboard",
    hasVoiceReminder: false,
    status: "upcoming",
  },
]

export function DailySchedule() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const { speak } = useVoice()

  const getTypeColor = (type: string) => {
    switch (type) {
      case "meeting":
        return "bg-blue-100 text-blue-800"
      case "work":
        return "bg-green-100 text-green-800"
      case "break":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "meeting":
        return Users
      case "work":
        return Clock
      case "break":
        return Calendar
      default:
        return Clock
    }
  }

  const handleVoiceReminder = (item: any) => {
    const message = `Reminder: ${item.title} at ${item.time}. Duration: ${item.duration}.`
    speak(message)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Today's Schedule
            </CardTitle>
            <CardDescription>
              {selectedDate.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </CardDescription>
          </div>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Event
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {scheduleItems.map((item) => {
            const IconComponent = getTypeIcon(item.type)
            return (
              <div key={item.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-slate-100 rounded-full w-10 h-10 flex items-center justify-center">
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{item.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Clock className="h-4 w-4" />
                        <span>{item.time}</span>
                        <span>•</span>
                        <span>{item.duration}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getTypeColor(item.type)}>{item.type}</Badge>
                    {item.hasVoiceReminder && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleVoiceReminder(item)}
                        className="h-8 w-8 p-0"
                        title="Play voice reminder"
                      >
                        🔊
                      </Button>
                    )}
                  </div>
                </div>

                {item.attendees && (
                  <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
                    <Users className="h-4 w-4" />
                    <span>Attendees: {item.attendees.join(", ")}</span>
                  </div>
                )}

                {item.location && (
                  <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
                    {item.location.includes("Video") ? <Video className="h-4 w-4" /> : <MapPin className="h-4 w-4" />}
                    <span>{item.location}</span>
                  </div>
                )}

                {item.project && (
                  <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
                    <span>Project: {item.project}</span>
                  </div>
                )}

                <div className="flex gap-2 mt-3">
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                  <Button variant="outline" size="sm">
                    Join
                  </Button>
                  {item.hasVoiceReminder && (
                    <Button variant="outline" size="sm">
                      Set Reminder
                    </Button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

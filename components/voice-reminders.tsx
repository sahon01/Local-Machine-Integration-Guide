"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { VoiceInputField } from "@/components/voice-input-field"
import { useVoice } from "@/components/voice-provider"
import { Bell, Plus, Clock, Volume2, Trash2 } from "lucide-react"

interface Reminder {
  id: number
  text: string
  time: string
  language: "en" | "bn"
  active: boolean
  recurring: boolean
}

const initialReminders: Reminder[] = [
  {
    id: 1,
    text: "Daily standup meeting in 5 minutes",
    time: "08:55",
    language: "en",
    active: true,
    recurring: true,
  },
  {
    id: 2,
    text: "লাঞ্চের সময় হয়েছে",
    time: "12:00",
    language: "bn",
    active: true,
    recurring: true,
  },
  {
    id: 3,
    text: "Review code before end of day",
    time: "17:00",
    language: "en",
    active: true,
    recurring: true,
  },
]

export function VoiceReminders() {
  const [reminders, setReminders] = useState<Reminder[]>(initialReminders)
  const [newReminderText, setNewReminderText] = useState("")
  const [newReminderTime, setNewReminderTime] = useState("")
  const { speak, currentLanguage } = useVoice()

  useEffect(() => {
    const checkReminders = () => {
      const now = new Date()
      const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`

      reminders.forEach((reminder) => {
        if (reminder.active && reminder.time === currentTime) {
          speak(reminder.text, reminder.language)
        }
      })
    }

    const interval = setInterval(checkReminders, 60000) // Check every minute
    return () => clearInterval(interval)
  }, [reminders, speak])

  const addReminder = () => {
    if (newReminderText.trim() && newReminderTime) {
      const reminder: Reminder = {
        id: Date.now(),
        text: newReminderText,
        time: newReminderTime,
        language: currentLanguage,
        active: true,
        recurring: false,
      }
      setReminders((prev) => [...prev, reminder])
      setNewReminderText("")
      setNewReminderTime("")
      speak(`Reminder set for ${newReminderTime}: ${newReminderText}`, currentLanguage)
    }
  }

  const toggleReminder = (id: number) => {
    setReminders((prev) =>
      prev.map((reminder) => (reminder.id === id ? { ...reminder, active: !reminder.active } : reminder)),
    )
  }

  const deleteReminder = (id: number) => {
    setReminders((prev) => prev.filter((reminder) => reminder.id !== id))
  }

  const testReminder = (reminder: Reminder) => {
    speak(reminder.text, reminder.language)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Voice Reminders
        </CardTitle>
        <CardDescription>Set time-based voice notifications</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Add new reminder */}
          <div className="space-y-3 p-3 border rounded-lg bg-slate-50">
            <VoiceInputField
              value={newReminderText}
              onChange={setNewReminderText}
              placeholder="Enter reminder text..."
            />
            <div className="flex gap-2">
              <input
                type="time"
                value={newReminderTime}
                onChange={(e) => setNewReminderTime(e.target.value)}
                className="flex-1 p-2 border rounded-md"
              />
              <Button onClick={addReminder} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
          </div>

          {/* Reminder list */}
          <div className="space-y-3">
            {reminders.map((reminder) => (
              <div key={reminder.id} className="border rounded-lg p-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="font-medium">{reminder.text}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="h-4 w-4 text-slate-500" />
                      <span className="text-sm text-slate-600">{reminder.time}</span>
                      <Badge variant="outline" className="text-xs">
                        {reminder.language === "bn" ? "বাংলা" : "English"}
                      </Badge>
                      {reminder.recurring && (
                        <Badge variant="secondary" className="text-xs">
                          Daily
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => testReminder(reminder)}
                      className="h-8 w-8 p-0"
                      title="Test reminder"
                    >
                      <Volume2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleReminder(reminder.id)}
                      className="h-8 w-8 p-0"
                      title={reminder.active ? "Disable" : "Enable"}
                    >
                      <Bell className={`h-4 w-4 ${reminder.active ? "text-green-500" : "text-gray-400"}`} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteReminder(reminder.id)}
                      className="h-8 w-8 p-0"
                      title="Delete reminder"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Badge variant={reminder.active ? "default" : "secondary"}>
                    {reminder.active ? "Active" : "Disabled"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

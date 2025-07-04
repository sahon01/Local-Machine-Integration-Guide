import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Bell, Users, CheckCircle } from "lucide-react"
import { DailySchedule } from "@/components/daily-schedule"
import { TaskManager } from "@/components/task-manager"
import { VoiceReminders } from "@/components/voice-reminders"

export default function DailyPlannerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Daily Planner</h1>
            <p className="text-slate-600">Manage your daily schedule, tasks, and voice reminders</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Bell className="h-4 w-4 mr-2" />
              Voice Reminders
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </div>
        </div>

        {/* Daily Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Today's Tasks</p>
                  <p className="text-2xl font-bold">8</p>
                </div>
                <CheckCircle className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Completed</p>
                  <p className="text-2xl font-bold text-green-600">5</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Meetings</p>
                  <p className="text-2xl font-bold text-purple-600">3</p>
                </div>
                <Users className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Reminders</p>
                  <p className="text-2xl font-bold text-orange-600">4</p>
                </div>
                <Bell className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Daily Schedule */}
          <div className="lg:col-span-2">
            <DailySchedule />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <TaskManager />
            <VoiceReminders />
          </div>
        </div>
      </div>
    </div>
  )
}

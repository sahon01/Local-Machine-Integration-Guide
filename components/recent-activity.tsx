"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, MessageSquare, Code, FileText, Zap } from "lucide-react"

export function RecentActivity() {
  const activities = [
    {
      id: 1,
      type: "chat",
      model: "Mistral",
      description: "Code analysis request",
      time: "2 minutes ago",
      icon: Code,
      status: "completed",
    },
    {
      id: 2,
      type: "generation",
      model: "DeepSeek",
      description: "Function generation",
      time: "5 minutes ago",
      icon: MessageSquare,
      status: "completed",
    },
    {
      id: 3,
      type: "documentation",
      model: "Gemma",
      description: "API documentation",
      time: "8 minutes ago",
      icon: FileText,
      status: "completed",
    },
    {
      id: 4,
      type: "quick",
      model: "TinyLlama",
      description: "Quick response",
      time: "12 minutes ago",
      icon: Zap,
      status: "completed",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Recent Activity
        </CardTitle>
        <CardDescription>Latest model interactions and requests</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activities.map((activity) => {
            const IconComponent = activity.icon
            return (
              <div key={activity.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center">
                  <IconComponent className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">{activity.description}</div>
                  <div className="text-xs text-slate-600">
                    {activity.model} • {activity.time}
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  {activity.status}
                </Badge>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

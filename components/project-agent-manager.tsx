"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Brain, MessageSquare, Settings, Activity, Code } from "lucide-react"

const agentAssignments = [
  {
    id: 1,
    agent: "DevMentor",
    project: "AI Management Dashboard",
    status: "active",
    lastInteraction: "2 hours ago",
    tasksCompleted: 15,
    codeReviews: 8,
  },
  {
    id: 2,
    agent: "CodeReviewer",
    project: "E-commerce Platform",
    status: "active",
    lastInteraction: "1 day ago",
    tasksCompleted: 12,
    codeReviews: 23,
  },
  {
    id: 3,
    agent: "ডেটা বিশেষজ্ঞ",
    project: "Data Analytics Tool",
    status: "inactive",
    lastInteraction: "3 days ago",
    tasksCompleted: 5,
    codeReviews: 2,
  },
]

export function ProjectAgentManager() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Agent Assignments
          </CardTitle>
          <CardDescription>AI agents working on your projects</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {agentAssignments.map((assignment) => (
              <div key={assignment.id} className="border rounded-lg p-3">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold">{assignment.agent}</h3>
                    <p className="text-sm text-slate-600">{assignment.project}</p>
                  </div>
                  <Badge variant={assignment.status === "active" ? "default" : "secondary"}>{assignment.status}</Badge>
                </div>

                <div className="space-y-2 text-sm text-slate-600">
                  <div className="flex items-center justify-between">
                    <span>Tasks completed:</span>
                    <span className="font-medium">{assignment.tasksCompleted}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Code reviews:</span>
                    <span className="font-medium">{assignment.codeReviews}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Last interaction:</span>
                    <span className="font-medium">{assignment.lastInteraction}</span>
                  </div>
                </div>

                <div className="flex gap-2 mt-3">
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Chat
                  </Button>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Agent Activity
          </CardTitle>
          <CardDescription>Recent agent interactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              {
                agent: "DevMentor",
                action: "Reviewed pull request #45",
                time: "2 hours ago",
                project: "AI Dashboard",
              },
              {
                agent: "CodeReviewer",
                action: "Suggested code improvements",
                time: "1 day ago",
                project: "E-commerce",
              },
              {
                agent: "DevMentor",
                action: "Generated unit tests",
                time: "2 days ago",
                project: "AI Dashboard",
              },
            ].map((activity, index) => (
              <div key={index} className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg">
                <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center">
                  <Code className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">{activity.action}</div>
                  <div className="text-xs text-slate-600">
                    {activity.agent} • {activity.project} • {activity.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

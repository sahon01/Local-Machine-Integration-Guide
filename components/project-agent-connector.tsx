"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Brain, Folder, MessageSquare, Settings, Activity } from "lucide-react"

const projectConnections = [
  {
    id: 1,
    project: "AI Dashboard",
    path: "/projects/ai-dashboard",
    agent: "DevMentor",
    status: "active",
    lastActivity: "2 minutes ago",
    codeFiles: 45,
    analysisCount: 12,
  },
  {
    id: 2,
    project: "E-commerce Platform",
    path: "/projects/ecommerce",
    agent: "CodeReviewer",
    status: "active",
    lastActivity: "1 hour ago",
    codeFiles: 78,
    analysisCount: 8,
  },
  {
    id: 3,
    project: "Mobile Backend",
    path: "/projects/mobile-backend",
    agent: null,
    status: "inactive",
    lastActivity: "2 days ago",
    codeFiles: 32,
    analysisCount: 0,
  },
]

export function ProjectAgentConnector() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Project Agents
          </CardTitle>
          <CardDescription>AI agents monitoring your project folders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {projectConnections.map((connection) => (
              <div key={connection.id} className="border rounded-lg p-3">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-100 text-purple-800 rounded-full w-8 h-8 flex items-center justify-center">
                      <Folder className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{connection.project}</h3>
                      <p className="text-xs text-slate-600">{connection.path}</p>
                    </div>
                  </div>
                  <Badge variant={connection.status === "active" ? "default" : "secondary"}>{connection.status}</Badge>
                </div>

                {connection.agent && (
                  <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
                    <Brain className="h-4 w-4" />
                    <span>Agent: {connection.agent}</span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 mb-3">
                  <div>Files: {connection.codeFiles}</div>
                  <div>Analysis: {connection.analysisCount}</div>
                </div>

                <div className="text-xs text-slate-600 mb-3">Last activity: {connection.lastActivity}</div>

                <div className="flex gap-2">
                  {connection.agent ? (
                    <>
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                        <MessageSquare className="h-3 w-3 mr-1" />
                        Chat
                      </Button>
                      <Button variant="outline" size="sm">
                        <Settings className="h-3 w-3" />
                      </Button>
                    </>
                  ) : (
                    <Button size="sm" className="flex-1">
                      Assign Agent
                    </Button>
                  )}
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
            Recent Activity
          </CardTitle>
          <CardDescription>Latest agent interactions with your code</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              {
                agent: "DevMentor",
                action: "Analyzed new component",
                file: "components/voice-input.tsx",
                time: "2 min ago",
              },
              {
                agent: "CodeReviewer",
                action: "Suggested optimization",
                file: "utils/api-client.js",
                time: "1 hour ago",
              },
              {
                agent: "DevMentor",
                action: "Generated documentation",
                file: "README.md",
                time: "3 hours ago",
              },
            ].map((activity, index) => (
              <div key={index} className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg">
                <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center">
                  <Brain className="h-3 w-3" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">{activity.action}</div>
                  <div className="text-xs text-slate-600">
                    {activity.agent} • {activity.file} • {activity.time}
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

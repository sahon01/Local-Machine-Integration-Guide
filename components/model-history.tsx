"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { History, MessageSquare, Code, FileText, Download } from "lucide-react"

interface ModelHistoryProps {
  modelId: string
}

export function ModelHistory({ modelId }: ModelHistoryProps) {
  const history = [
    {
      id: 1,
      timestamp: "2024-01-15 14:30:25",
      type: "code_analysis",
      prompt: "Analyze this Python function for potential bugs",
      responseTime: "0.8s",
      tokens: 156,
      status: "completed",
      rating: "positive",
    },
    {
      id: 2,
      timestamp: "2024-01-15 14:28:12",
      type: "code_generation",
      prompt: "Create a REST API endpoint for user authentication",
      responseTime: "1.2s",
      tokens: 234,
      status: "completed",
      rating: "positive",
    },
    {
      id: 3,
      timestamp: "2024-01-15 14:25:45",
      type: "documentation",
      prompt: "Write documentation for this class",
      responseTime: "0.9s",
      tokens: 189,
      status: "completed",
      rating: "neutral",
    },
    {
      id: 4,
      timestamp: "2024-01-15 14:22:18",
      type: "bug_fix",
      prompt: "Fix the memory leak in this code",
      responseTime: "1.5s",
      tokens: 298,
      status: "completed",
      rating: "positive",
    },
  ]

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "code_analysis":
      case "bug_fix":
        return Code
      case "code_generation":
        return MessageSquare
      case "documentation":
        return FileText
      default:
        return MessageSquare
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Interaction History
        </CardTitle>
        <CardDescription>Recent interactions with this model</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {history.map((item) => {
            const IconComponent = getTypeIcon(item.type)
            return (
              <div key={item.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center">
                      <IconComponent className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-medium text-sm capitalize">{item.type.replace("_", " ")}</div>
                      <div className="text-xs text-slate-600">{item.timestamp}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{item.responseTime}</Badge>
                    <Badge variant="secondary">{item.tokens} tokens</Badge>
                    <Badge variant={item.rating === "positive" ? "default" : "outline"}>{item.rating}</Badge>
                  </div>
                </div>
                <div className="text-sm text-slate-700 mb-3">{item.prompt}</div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-3 w-3 mr-1" />
                    Export
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

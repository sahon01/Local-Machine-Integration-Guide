"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Server } from "lucide-react"

export function SystemOverview() {
  const models = [
    { name: "Mistral", status: "running", load: 45, requests: 342 },
    { name: "DeepSeek", status: "running", load: 38, requests: 289 },
    { name: "Phi", status: "running", load: 28, requests: 156 },
    { name: "Gemma", status: "running", load: 35, requests: 198 },
    { name: "TinyLlama", status: "running", load: 15, requests: 445 },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Server className="h-5 w-5" />
          System Overview
        </CardTitle>
        <CardDescription>Current status of all AI models and system health</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {models.map((model) => (
            <div key={model.name} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div>
                  <div className="font-medium">{model.name}</div>
                  <div className="text-sm text-slate-600">{model.requests} requests today</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-sm font-medium">{model.load}% load</div>
                  <Progress value={model.load} className="w-20 h-2" />
                </div>
                <Badge variant={model.status === "running" ? "default" : "destructive"}>{model.status}</Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

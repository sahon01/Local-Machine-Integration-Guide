"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Terminal, Play, History, Copy } from "lucide-react"

export default function CommandsPage() {
  const [commandHistory, setCommandHistory] = useState([
    { id: 1, command: "start-server --port 8000", status: "success", output: "Server started on port 8000" },
    { id: 2, command: "db-backup --name backup_2024", status: "success", output: "Backup created successfully" },
    { id: 3, command: "model-list --provider ollama", status: "success", output: "5 models found" },
  ])

  const commands = [
    {
      category: "Server Commands",
      items: [
        { name: "start-server", description: "Start a server instance", usage: "start-server --port <port>" },
        { name: "stop-server", description: "Stop a server instance", usage: "stop-server --port <port>" },
        { name: "restart-all", description: "Restart all servers", usage: "restart-all" },
      ],
    },
    {
      category: "Database Commands",
      items: [
        { name: "db-backup", description: "Create database backup", usage: "db-backup --name <name>" },
        { name: "db-restore", description: "Restore database", usage: "db-restore --file <file>" },
        { name: "db-migrate", description: "Run database migrations", usage: "db-migrate" },
      ],
    },
    {
      category: "Model Commands",
      items: [
        { name: "model-pull", description: "Pull AI model", usage: "model-pull <model-name>" },
        { name: "model-list", description: "List available models", usage: "model-list --provider <provider>" },
        { name: "model-test", description: "Test model connection", usage: "model-test <model-name>" },
      ],
    },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Command Line Tools</h1>
          <p className="text-muted-foreground">Execute system commands and scripts</p>
        </div>
      </div>

      {/* Command Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Terminal className="h-5 w-5" />
            Execute Command
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input placeholder="Enter command..." className="font-mono" />
            <Button>
              <Play className="mr-2 h-4 w-4" />
              Run
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Available Commands */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Available Commands</h2>
        {commands.map((category) => (
          <Card key={category.category}>
            <CardHeader>
              <CardTitle>{category.category}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {category.items.map((cmd) => (
                  <div key={cmd.name} className="flex justify-between items-start p-3 border rounded">
                    <div className="flex-1">
                      <h4 className="font-medium font-mono text-sm">{cmd.name}</h4>
                      <p className="text-sm text-muted-foreground">{cmd.description}</p>
                      <code className="text-xs bg-muted px-2 py-1 rounded mt-1 inline-block">{cmd.usage}</code>
                    </div>
                    <Button size="sm" variant="outline">
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Command History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Command History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {commandHistory.map((item) => (
              <div key={item.id} className="flex items-start gap-3 p-3 border rounded">
                <Badge variant={item.status === "success" ? "default" : "destructive"}>{item.status}</Badge>
                <div className="flex-1">
                  <code className="text-sm font-mono">{item.command}</code>
                  <p className="text-xs text-muted-foreground mt-1">{item.output}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

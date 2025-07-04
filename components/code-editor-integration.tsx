"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { VoiceInputField } from "@/components/voice-input-field"
import { useVoice } from "@/components/voice-provider"
import { Code, Brain, Play, Settings, CheckCircle, XCircle, Folder } from "lucide-react"

const editorConnections = [
  {
    id: 1,
    name: "VS Code",
    status: "connected",
    agent: "DevMentor",
    project: "AI Dashboard",
    lastSync: "2 minutes ago",
    features: ["Code Analysis", "Auto-completion", "Error Detection"],
  },
  {
    id: 2,
    name: "Cursor",
    status: "connected",
    agent: "CodeReviewer",
    project: "E-commerce Platform",
    lastSync: "5 minutes ago",
    features: ["Code Review", "Refactoring", "Documentation"],
  },
  {
    id: 3,
    name: "WebStorm",
    status: "disconnected",
    agent: null,
    project: null,
    lastSync: "1 day ago",
    features: ["Code Generation", "Testing", "Debugging"],
  },
]

export function CodeEditorIntegration() {
  const [selectedEditor, setSelectedEditor] = useState(editorConnections[0])
  const [testCode, setTestCode] = useState("")
  const { speak } = useVoice()

  const handleTestIntegration = () => {
    if (testCode.trim()) {
      speak(
        `Testing code integration with ${selectedEditor.name}. Analyzing code with ${selectedEditor.agent || "no agent assigned"}.`,
      )
      // Simulate code analysis
      setTimeout(() => {
        speak("Code analysis complete. No issues found.")
      }, 2000)
    }
  }

  const getStatusIcon = (status: string) => {
    return status === "connected" ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <XCircle className="h-4 w-4 text-red-500" />
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Code className="h-5 w-5" />
          Code Editor Integration
        </CardTitle>
        <CardDescription>Connect and manage your code editors with AI agents</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="connections" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="connections">Connections</TabsTrigger>
            <TabsTrigger value="testing">Testing</TabsTrigger>
            <TabsTrigger value="configuration">Configuration</TabsTrigger>
          </TabsList>

          <TabsContent value="connections" className="space-y-4">
            {editorConnections.map((editor) => (
              <div key={editor.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 text-blue-800 rounded-full w-10 h-10 flex items-center justify-center">
                      <Code className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold flex items-center gap-2">
                        {editor.name}
                        {getStatusIcon(editor.status)}
                      </h3>
                      <p className="text-sm text-slate-600">
                        {editor.agent ? `Agent: ${editor.agent}` : "No agent assigned"}
                      </p>
                    </div>
                  </div>
                  <Badge variant={editor.status === "connected" ? "default" : "secondary"}>{editor.status}</Badge>
                </div>

                {editor.project && (
                  <div className="flex items-center gap-2 text-sm text-slate-600 mb-3">
                    <Folder className="h-4 w-4" />
                    <span>Project: {editor.project}</span>
                  </div>
                )}

                <div className="flex flex-wrap gap-2 mb-3">
                  {editor.features.map((feature) => (
                    <Badge key={feature} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm text-slate-600 mb-3">
                  <span>Last sync: {editor.lastSync}</span>
                </div>

                <div className="flex gap-2">
                  {editor.status === "connected" ? (
                    <>
                      <Button variant="outline" size="sm">
                        Configure
                      </Button>
                      <Button variant="outline" size="sm">
                        Disconnect
                      </Button>
                    </>
                  ) : (
                    <Button size="sm">Connect</Button>
                  )}
                  <Button variant="outline" size="sm">
                    <Brain className="h-4 w-4 mr-2" />
                    Assign Agent
                  </Button>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="testing" className="space-y-4">
            <div>
              <h3 className="font-semibold mb-3">Test Code Integration</h3>
              <p className="text-sm text-slate-600 mb-4">Test how your AI agent analyzes code from your editor</p>

              <VoiceInputField
                value={testCode}
                onChange={setTestCode}
                placeholder="Paste or speak your code here for testing..."
                multiline
              />

              <div className="flex gap-2 mt-4">
                <Button onClick={handleTestIntegration} disabled={!testCode.trim()}>
                  <Play className="h-4 w-4 mr-2" />
                  Test Analysis
                </Button>
                <Button variant="outline">
                  <Brain className="h-4 w-4 mr-2" />
                  Select Agent
                </Button>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">Test Results</h4>
              <div className="bg-slate-50 p-3 rounded-lg text-sm">
                <p className="text-slate-600">Test results will appear here after running code analysis...</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="configuration" className="space-y-4">
            <div>
              <h3 className="font-semibold mb-3">Integration Settings</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Auto-sync Interval</label>
                  <select className="w-full p-2 border rounded-md">
                    <option value="realtime">Real-time</option>
                    <option value="5min">Every 5 minutes</option>
                    <option value="15min">Every 15 minutes</option>
                    <option value="manual">Manual only</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Default Agent Behavior</label>
                  <select className="w-full p-2 border rounded-md">
                    <option value="analyze">Auto-analyze on save</option>
                    <option value="suggest">Suggest improvements</option>
                    <option value="review">Full code review</option>
                    <option value="manual">Manual trigger only</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="voice-feedback" className="rounded" />
                  <label htmlFor="voice-feedback" className="text-sm">
                    Enable voice feedback for code analysis
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="auto-fix" className="rounded" />
                  <label htmlFor="auto-fix" className="text-sm">
                    Allow agents to auto-fix simple issues
                  </label>
                </div>
              </div>

              <Button className="mt-4">
                <Settings className="h-4 w-4 mr-2" />
                Save Configuration
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Code, Brain, Folder, GitBranch, Play, Settings } from "lucide-react"
import { CodeEditorIntegration } from "@/components/code-editor-integration"
import { ProjectAgentConnector } from "@/components/project-agent-connector"

export default function CodeIntegrationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Code Editor Integration</h1>
            <p className="text-slate-600">Connect your code editors with AI agents for enhanced development</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Configure
            </Button>
            <Button>
              <Play className="h-4 w-4 mr-2" />
              Test Connection
            </Button>
          </div>
        </div>

        {/* Integration Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Connected Editors</p>
                  <p className="text-2xl font-bold">3</p>
                </div>
                <Code className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Active Agents</p>
                  <p className="text-2xl font-bold">5</p>
                </div>
                <Brain className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Monitored Projects</p>
                  <p className="text-2xl font-bold">8</p>
                </div>
                <Folder className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Code Reviews</p>
                  <p className="text-2xl font-bold">24</p>
                </div>
                <GitBranch className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Code Editor Integration */}
          <div className="lg:col-span-2">
            <CodeEditorIntegration />
          </div>

          {/* Project Agent Connector */}
          <div>
            <ProjectAgentConnector />
          </div>
        </div>
      </div>
    </div>
  )
}

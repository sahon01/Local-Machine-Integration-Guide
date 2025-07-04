import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Folder, Plus, Brain, Users, GitBranch } from "lucide-react"
import { ProjectList } from "@/components/project-list"
import { ProjectAgentManager } from "@/components/project-agent-manager"

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Project Manager</h1>
            <p className="text-slate-600">Manage your development projects and their AI agents</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Brain className="h-4 w-4 mr-2" />
              Assign Agent
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </div>
        </div>

        {/* Project Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Active Projects</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
                <Folder className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">AI Agents</p>
                  <p className="text-2xl font-bold">8</p>
                </div>
                <Brain className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Team Members</p>
                  <p className="text-2xl font-bold">15</p>
                </div>
                <Users className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Repositories</p>
                  <p className="text-2xl font-bold">24</p>
                </div>
                <GitBranch className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Project List */}
          <div className="lg:col-span-2">
            <ProjectList />
          </div>

          {/* Project Agent Manager */}
          <div>
            <ProjectAgentManager />
          </div>
        </div>
      </div>
    </div>
  )
}

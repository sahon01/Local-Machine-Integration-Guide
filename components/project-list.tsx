"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Folder, Code, Brain, Users, GitBranch, ExternalLink, Settings } from "lucide-react"

const projects = [
  {
    id: 1,
    name: "AI Management Dashboard",
    description: "Comprehensive AI model management toolkit",
    type: "Next.js",
    status: "active",
    progress: 75,
    agent: "DevMentor",
    agentActive: true,
    path: "/projects/ai-dashboard",
    repository: "github.com/user/ai-dashboard",
    teamMembers: 3,
    lastActivity: "2 hours ago",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS"],
  },
  {
    id: 2,
    name: "E-commerce Platform",
    description: "Modern e-commerce solution with AI features",
    type: "React",
    status: "active",
    progress: 60,
    agent: "CodeReviewer",
    agentActive: true,
    path: "/projects/ecommerce",
    repository: "github.com/user/ecommerce",
    teamMembers: 5,
    lastActivity: "1 day ago",
    technologies: ["React", "Node.js", "MongoDB"],
  },
  {
    id: 3,
    name: "Data Analytics Tool",
    description: "Business intelligence dashboard",
    type: "Python",
    status: "planning",
    progress: 25,
    agent: "ডেটা বিশেষজ্ঞ",
    agentActive: false,
    path: "/projects/analytics",
    repository: "github.com/user/analytics",
    teamMembers: 2,
    lastActivity: "3 days ago",
    technologies: ["Python", "Django", "PostgreSQL"],
  },
  {
    id: 4,
    name: "Mobile App Backend",
    description: "API backend for mobile application",
    type: "Node.js",
    status: "active",
    progress: 90,
    agent: null,
    agentActive: false,
    path: "/projects/mobile-backend",
    repository: "github.com/user/mobile-backend",
    teamMembers: 2,
    lastActivity: "5 hours ago",
    technologies: ["Node.js", "Express", "MySQL"],
  },
]

export function ProjectList() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "planning":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      case "paused":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Next.js":
      case "React":
        return Code
      case "Python":
        return Code
      case "Node.js":
        return Code
      default:
        return Folder
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Folder className="h-5 w-5" />
          Active Projects
        </CardTitle>
        <CardDescription>Manage your development projects and their AI agents</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {projects.map((project) => {
            const IconComponent = getTypeIcon(project.type)
            return (
              <div key={project.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 text-blue-800 rounded-full w-10 h-10 flex items-center justify-center">
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{project.name}</h3>
                      <p className="text-sm text-slate-600">{project.description}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  {/* Project Info */}
                  <div className="flex items-center gap-4 text-sm text-slate-600">
                    <div className="flex items-center gap-1">
                      <GitBranch className="h-4 w-4" />
                      <span>{project.type}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{project.teamMembers} members</span>
                    </div>
                    <span>Last activity: {project.lastActivity}</span>
                  </div>

                  {/* Progress */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Progress</span>
                      <span className="text-sm text-slate-600">{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                  </div>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <Badge key={tech} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>

                  {/* Agent Info */}
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Brain className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        {project.agent ? `Agent: ${project.agent}` : "No agent assigned"}
                      </span>
                      {project.agent && (
                        <Badge variant={project.agentActive ? "default" : "secondary"} className="text-xs">
                          {project.agentActive ? "Active" : "Inactive"}
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {project.agent ? (
                        <>
                          <Button variant="outline" size="sm">
                            Chat with Agent
                          </Button>
                          <Button variant="outline" size="sm">
                            Configure
                          </Button>
                        </>
                      ) : (
                        <Button size="sm">Assign Agent</Button>
                      )}
                    </div>
                  </div>

                  {/* Status and Actions */}
                  <div className="flex items-center justify-between">
                    <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Open in Editor
                      </Button>
                      <Button variant="outline" size="sm">
                        View Repository
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Code, Plus, Search, Play, Trash2, Edit, Copy } from "lucide-react"

export default function PromptsPage() {
  const [prompts, setPrompts] = useState([
    {
      id: 1,
      title: "Code Review Assistant",
      category: "code_analysis",
      template: "Review the following code:\n\n{code}\n\nFocus on: {focus_areas}",
      variables: ["code", "focus_areas"],
      models: ["gpt-4", "claude-3"],
    },
    {
      id: 2,
      title: "Documentation Generator",
      category: "documentation",
      template: "Generate documentation for:\n\n{code}\n\nInclude: {sections}",
      variables: ["code", "sections"],
      models: ["gpt-4"],
    },
  ])

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Prompt Management</h1>
          <p className="text-muted-foreground">Create and manage AI prompt templates</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Prompt
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input placeholder="Search prompts..." className="pl-10" />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="code_analysis">Code Analysis</SelectItem>
            <SelectItem value="documentation">Documentation</SelectItem>
            <SelectItem value="testing">Testing</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Prompts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {prompts.map((prompt) => (
          <Card key={prompt.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    {prompt.title}
                  </CardTitle>
                  <CardDescription>
                    <Badge variant="outline" className="mt-1">
                      {prompt.category}
                    </Badge>
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button size="icon" variant="ghost">
                    <Play className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost">
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Template</h4>
                <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">{prompt.template}</pre>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Variables</h4>
                <div className="flex flex-wrap gap-2">
                  {prompt.variables.map((variable) => (
                    <Badge key={variable} variant="secondary">
                      {`{${variable}}`}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Recommended Models</h4>
                <div className="flex flex-wrap gap-2">
                  {prompt.models.map((model) => (
                    <Badge key={model}>{model}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

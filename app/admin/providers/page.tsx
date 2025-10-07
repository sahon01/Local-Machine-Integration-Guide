"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plug, Plus, Settings, CheckCircle, AlertCircle, DollarSign } from "lucide-react"

export default function ProvidersPage() {
  const [providers] = useState([
    {
      id: 1,
      name: "OpenAI",
      status: "active",
      models: ["gpt-4", "gpt-3.5-turbo", "gpt-4-turbo"],
      apiBase: "https://api.openai.com/v1",
      rateLimits: { rpm: 3500, tpm: 90000 },
      costPer1k: { input: 0.03, output: 0.06 },
    },
    {
      id: 2,
      name: "Ollama",
      status: "active",
      models: ["llama3.2:1b", "codellama", "mistral"],
      apiBase: "http://localhost:11434",
      rateLimits: { rpm: 0, tpm: 0 },
      costPer1k: { input: 0, output: 0 },
    },
    {
      id: 3,
      name: "Anthropic",
      status: "inactive",
      models: ["claude-3-opus", "claude-3-sonnet"],
      apiBase: "https://api.anthropic.com/v1",
      rateLimits: { rpm: 2000, tpm: 100000 },
      costPer1k: { input: 0.015, output: 0.075 },
    },
  ])

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">AI Providers</h1>
          <p className="text-muted-foreground">Manage AI service providers and API configurations</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Provider
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Providers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{providers.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {providers.filter((p) => p.status === "active").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Models</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{providers.reduce((acc, p) => acc + p.models.length, 0)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Providers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {providers.map((provider) => (
          <Card key={provider.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <Plug className="h-5 w-5" />
                  <CardTitle>{provider.name}</CardTitle>
                </div>
                <Badge variant={provider.status === "active" ? "default" : "secondary"}>
                  {provider.status === "active" ? (
                    <>
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Active
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Inactive
                    </>
                  )}
                </Badge>
              </div>
              <CardDescription>{provider.apiBase}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Available Models ({provider.models.length})</h4>
                <div className="flex flex-wrap gap-2">
                  {provider.models.map((model) => (
                    <Badge key={model} variant="outline">
                      {model}
                    </Badge>
                  ))}
                </div>
              </div>

              {provider.rateLimits.rpm > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Rate Limits</h4>
                  <div className="text-sm text-muted-foreground">
                    <div>Requests per minute: {provider.rateLimits.rpm.toLocaleString()}</div>
                    <div>Tokens per minute: {provider.rateLimits.tpm.toLocaleString()}</div>
                  </div>
                </div>
              )}

              {provider.costPer1k.input > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    Cost per 1K tokens
                  </h4>
                  <div className="text-sm text-muted-foreground">
                    <div>Input: ${provider.costPer1k.input}</div>
                    <div>Output: ${provider.costPer1k.output}</div>
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline">
                  <Settings className="h-3 w-3 mr-1" />
                  Configure
                </Button>
                <Button size="sm" variant="outline">
                  Test Connection
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

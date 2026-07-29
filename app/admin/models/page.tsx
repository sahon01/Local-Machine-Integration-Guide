'use client'

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, Play, Pause, Settings, Download, Search, Plus, Activity, RotateCcw } from "lucide-react"
import Link from "next/link"
import { useModels } from "@/lib/hooks/useModels"
import { useToast } from "@/hooks/use-toast"

export default function AdminModelsPage() {
  const { models, loading, error, refetch, toggleModel, testModel } = useModels()
  const { toast } = useToast()
  const [testing, setTesting] = useState<string | null>(null)
  const [toggling, setToggling] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const handleTestModel = async (id: string, name: string) => {
    try {
      setTesting(id)
      await testModel(id)
      toast({
        title: "Success",
        description: `${name} test passed`,
      })
    } catch (err) {
      toast({
        title: "Error",
        description: `Failed to test ${name}`,
        variant: "destructive",
      })
    } finally {
      setTesting(null)
    }
  }

  const handleToggleModel = async (id: string, enabled: boolean, name: string) => {
    try {
      setToggling(id)
      await toggleModel(id, !enabled)
      toast({
        title: "Success",
        description: `${name} ${enabled ? 'disabled' : 'enabled'}`,
      })
    } catch (err) {
      toast({
        title: "Error",
        description: `Failed to update ${name}`,
        variant: "destructive",
      })
    } finally {
      setToggling(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading models...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-red-800">Failed to load models: {error}</p>
          <Button onClick={refetch} className="mt-4">
            <RotateCcw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </div>
      </div>
    )
  }

  const filteredModels = models.filter((model) =>
    model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    model.provider.toLowerCase().includes(searchQuery.toLowerCase())
  )
  const runningModels = filteredModels.filter((m) => m.enabled)
  const stoppedModels = filteredModels.filter((m) => !m.enabled)

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Model Management</h1>
          <p className="text-slate-600">Monitor and control your local AI models</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Install Model
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Model
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Models</p>
                <p className="text-2xl font-bold">{models.length}</p>
              </div>
              <Brain className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Enabled</p>
                <p className="text-2xl font-bold text-green-600">{runningModels.length}</p>
              </div>
              <Play className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Requests</p>
                <p className="text-2xl font-bold">{models.reduce((acc, m) => acc + m.usageCount, 0).toLocaleString()}</p>
              </div>
              <Activity className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Avg Response</p>
                <p className="text-2xl font-bold">{(models.reduce((acc, m) => acc + m.maxTokens, 0) / models.length / 1000).toFixed(1)}s</p>
              </div>
              <div className="w-8 h-8 bg-orange-100 text-orange-800 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold">⚡</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Models List */}
      <Tabs defaultValue="all" className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">All Models ({filteredModels.length})</TabsTrigger>
            <TabsTrigger value="running">Enabled ({runningModels.length})</TabsTrigger>
            <TabsTrigger value="stopped">Disabled ({stoppedModels.length})</TabsTrigger>
          </TabsList>
          <div className="flex gap-2">
            <Input
              placeholder="Search models..."
              className="w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <TabsContent value="all">
          <div className="space-y-4">
            {filteredModels.map((model) => (
              <Card key={model.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`rounded-full w-12 h-12 flex items-center justify-center ${model.enabled ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                        <Brain className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-lg font-semibold">{model.name}</h3>
                          <Badge variant="outline">{model.version}</Badge>
                          <Badge variant={model.enabled ? "default" : "secondary"}>
                            {model.enabled ? 'Enabled' : 'Disabled'}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600 mb-2">{model.provider}</p>
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          <span>{model.usageCount} requests</span>
                          <span>Context: {model.contextWindow}</span>
                          <span>{model.costPerToken} $/token</span>
                          {model.lastUpdated && <span>Updated: {new Date(model.lastUpdated).toLocaleDateString()}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTestModel(model.id, model.name)}
                        disabled={testing === model.id}
                      >
                        {testing === model.id ? (
                          <RotateCcw className="h-4 w-4 animate-spin" />
                        ) : (
                          <Settings className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant={model.enabled ? "destructive" : "default"}
                        size="sm"
                        onClick={() => handleToggleModel(model.id, model.enabled, model.name)}
                        disabled={toggling === model.id}
                      >
                        {toggling === model.id ? (
                          <RotateCcw className="h-4 w-4 animate-spin mr-2" />
                        ) : model.enabled ? (
                          <>
                            <Pause className="h-4 w-4 mr-2" />
                            Disable
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4 mr-2" />
                            Enable
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="running">
          <div className="space-y-4">
            {runningModels.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No enabled models</p>
              </div>
            ) : (
              runningModels.map((model) => (
                <Card key={model.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="bg-green-100 text-green-800 rounded-full w-12 h-12 flex items-center justify-center">
                          <Brain className="h-6 w-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-lg font-semibold">{model.name}</h3>
                            <Badge variant="outline">{model.version}</Badge>
                            <Badge className="bg-green-100 text-green-800 border-green-200">Enabled</Badge>
                          </div>
                          <p className="text-sm text-slate-600 mb-2">{model.provider}</p>
                          <div className="flex items-center gap-4 text-xs text-slate-500">
                            <span>{model.usageCount} requests</span>
                            <span>Context: {model.contextWindow}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleTestModel(model.id, model.name)}
                          disabled={testing === model.id}
                        >
                          Test
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleToggleModel(model.id, model.enabled, model.name)} disabled={toggling === model.id}>
                          <Pause className="h-4 w-4 mr-2" />
                          Disable
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="stopped">
          <div className="space-y-4">
            {stoppedModels.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No disabled models</p>
              </div>
            ) : (
              stoppedModels.map((model) => (
                <Card key={model.id} className="hover:shadow-md transition-shadow opacity-75">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="bg-red-100 text-red-800 rounded-full w-12 h-12 flex items-center justify-center">
                          <Brain className="h-6 w-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-lg font-semibold">{model.name}</h3>
                            <Badge variant="outline">{model.version}</Badge>
                            <Badge className="bg-red-100 text-red-800 border-red-200">Disabled</Badge>
                          </div>
                          <p className="text-sm text-slate-600 mb-2">{model.provider}</p>
                          <div className="flex items-center gap-4 text-xs text-slate-500">
                            <span>{model.usageCount} requests</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="default" size="sm" onClick={() => handleToggleModel(model.id, model.enabled, model.name)} disabled={toggling === model.id}>
                          <Play className="h-4 w-4 mr-2" />
                          Enable
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

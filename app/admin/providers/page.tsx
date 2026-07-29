"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plug, Plus, Settings, CheckCircle, AlertCircle, DollarSign, RotateCcw } from "lucide-react"
import { useProviders } from "@/lib/hooks/useProviders"
import { useToast } from "@/hooks/use-toast"

export default function ProvidersPage() {
  const { providers, loading, error, refetch, testConnection, syncModels } = useProviders()
  const { toast } = useToast()
  const [testing, setTesting] = useState<string | null>(null)

  const handleTestConnection = async (id: string, name: string) => {
    try {
      setTesting(id)
      await testConnection(id)
      toast({
        title: "Success",
        description: `${name} connection test passed`,
      })
    } catch (err) {
      toast({
        title: "Error",
        description: `Failed to test ${name} connection`,
        variant: "destructive",
      })
    } finally {
      setTesting(null)
    }
  }

  const handleSyncModels = async (id: string, name: string) => {
    try {
      setTesting(id)
      await syncModels(id)
      refetch()
      toast({
        title: "Success",
        description: `${name} models synced successfully`,
      })
    } catch (err) {
      toast({
        title: "Error",
        description: `Failed to sync ${name} models`,
        variant: "destructive",
      })
    } finally {
      setTesting(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading providers...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-red-800">Failed to load providers: {error}</p>
          <Button onClick={refetch} className="mt-4">
            <RotateCcw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </div>
      </div>
    )
  }

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
                      {provider.status}
                    </>
                  )}
                </Badge>
              </div>
              <CardDescription>{provider.baseUrl || provider.type}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Available Models ({provider.models.length})</h4>
                <div className="flex flex-wrap gap-2">
                  {provider.models.slice(0, 5).map((model) => (
                    <Badge key={model} variant="outline">
                      {model}
                    </Badge>
                  ))}
                  {provider.models.length > 5 && (
                    <Badge variant="outline">+{provider.models.length - 5} more</Badge>
                  )}
                </div>
              </div>

              <div className="text-sm text-muted-foreground">
                <div>Type: {provider.type}</div>
                <div>Requests: {provider.requestCount}</div>
                {provider.lastChecked && <div>Last Checked: {new Date(provider.lastChecked).toLocaleString()}</div>}
              </div>

              <div className="flex gap-2 pt-2 flex-wrap">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleTestConnection(provider.id, provider.name)}
                  disabled={testing === provider.id}
                >
                  {testing === provider.id ? (
                    <RotateCcw className="h-3 w-3 mr-1 animate-spin" />
                  ) : (
                    <CheckCircle className="h-3 w-3 mr-1" />
                  )}
                  Test Connection
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleSyncModels(provider.id, provider.name)}
                  disabled={testing === provider.id}
                >
                  <RotateCcw className="h-3 w-3 mr-1" />
                  Sync Models
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

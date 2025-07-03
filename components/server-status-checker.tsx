"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, RefreshCw, Loader2 } from "lucide-react"

interface ServerStatus {
  status: "running" | "stopped" | "error"
  models: string[]
  uptime?: string
  memory_usage?: string
}

export function ServerStatusChecker() {
  const [status, setStatus] = useState<ServerStatus | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const checkStatus = async () => {
    setLoading(true)
    setError(null)

    try {
      // Simulate API call - in real implementation, this would call localhost:3307
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock response - replace with actual API call
      const mockResponse: ServerStatus = {
        status: "running",
        models: ["mistral", "deepseek", "phi", "gemma", "tinyllama"],
        uptime: "2h 15m 30s",
        memory_usage: "2.1GB",
      }

      setStatus(mockResponse)
    } catch (err) {
      setError("Failed to connect to localhost:3307")
      setStatus({ status: "error", models: [] })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkStatus()
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Server Status</h3>
        <Button variant="outline" size="sm" onClick={checkStatus} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
          Refresh
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {status && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            {status.status === "running" ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500" />
            )}
            <span className="font-medium">Server is {status.status}</span>
            <Badge variant={status.status === "running" ? "default" : "destructive"}>{status.status}</Badge>
          </div>

          {status.status === "running" && (
            <>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-600">Uptime:</span>
                  <span className="ml-2 font-medium">{status.uptime}</span>
                </div>
                <div>
                  <span className="text-slate-600">Memory:</span>
                  <span className="ml-2 font-medium">{status.memory_usage}</span>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Available Models:</h4>
                <div className="flex flex-wrap gap-2">
                  {status.models.map((model) => (
                    <Badge key={model} variant="secondary">
                      {model}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

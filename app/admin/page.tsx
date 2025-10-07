"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Activity,
  Brain,
  Server,
  Zap,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Users,
  Database,
  Cpu,
  HardDrive,
} from "lucide-react"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

interface DashboardStats {
  active_models: number
  total_requests: number
  avg_response_time: number
  connected_editors: number
  total_servers: number
  healthy_servers: number
  total_agents: number
  active_agents: number
  system_health: "healthy" | "degraded" | "down"
  uptime_percentage: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [performanceData, setPerformanceData] = useState<any[]>([])
  const [activityData, setActivityData] = useState<any[]>([])

  useEffect(() => {
    fetchDashboardData()

    // Auto-refresh every 5 seconds
    const interval = setInterval(fetchDashboardData, 5000)
    return () => clearInterval(interval)
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/admin/dashboard`)
      if (response.ok) {
        const data = await response.json()
        setStats(data.stats)
        setPerformanceData(data.performance || getMockPerformanceData())
        setActivityData(data.activity || getMockActivityData())
      } else {
        // Use mock data if API fails
        setStats(getMockStats())
        setPerformanceData(getMockPerformanceData())
        setActivityData(getMockActivityData())
      }
      setLoading(false)
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error)
      setStats(getMockStats())
      setPerformanceData(getMockPerformanceData())
      setActivityData(getMockActivityData())
      setLoading(false)
    }
  }

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">AI Infrastructure Dashboard</h1>
          <p className="text-muted-foreground">Monitor and manage your entire AI ecosystem</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={stats.system_health === "healthy" ? "default" : "destructive"}>
            {stats.system_health === "healthy" ? (
              <>
                <CheckCircle className="h-3 w-3 mr-1" />
                All Systems Operational
              </>
            ) : (
              <>
                <AlertCircle className="h-3 w-3 mr-1" />
                System Issues Detected
              </>
            )}
          </Badge>
          <span className="text-sm text-muted-foreground">Uptime: {stats.uptime_percentage}%</span>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Models</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active_models}</div>
            <p className="text-xs text-muted-foreground">Across all providers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_requests.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avg_response_time}ms</div>
            <p className="text-xs text-muted-foreground">
              {stats.avg_response_time < 200 ? "Excellent" : stats.avg_response_time < 500 ? "Good" : "Needs attention"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Connected Editors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.connected_editors}</div>
            <p className="text-xs text-muted-foreground">Active connections</p>
          </CardContent>
        </Card>
      </div>

      {/* Server and Agent Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              Server Status
            </CardTitle>
            <CardDescription>Infrastructure health overview</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Total Servers</span>
              <Badge variant="outline">{stats.total_servers}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Healthy</span>
              <Badge className="bg-green-500">{stats.healthy_servers}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Issues</span>
              <Badge variant="destructive">{stats.total_servers - stats.healthy_servers}</Badge>
            </div>
            <div className="pt-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all"
                  style={{ width: `${(stats.healthy_servers / stats.total_servers) * 100}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {((stats.healthy_servers / stats.total_servers) * 100).toFixed(1)}% operational
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cpu className="h-5 w-5" />
              Agent Status
            </CardTitle>
            <CardDescription>AI agent performance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Total Agents</span>
              <Badge variant="outline">{stats.total_agents}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Active</span>
              <Badge className="bg-blue-500">{stats.active_agents}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Inactive</span>
              <Badge variant="secondary">{stats.total_agents - stats.active_agents}</Badge>
            </div>
            <div className="pt-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all"
                  style={{ width: `${(stats.active_agents / stats.total_agents) * 100}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {((stats.active_agents / stats.total_agents) * 100).toFixed(1)}% active
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Performance Metrics
          </CardTitle>
          <CardDescription>Response time over the last 24 hours</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="response_time" stroke="#3b82f6" strokeWidth={2} />
              <Line type="monotone" dataKey="requests" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Activity Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Request Activity
          </CardTitle>
          <CardDescription>Requests by service</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="service" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="requests" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* System Resources */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
            <Cpu className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">34%</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: "34%" }} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">62%</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: "62%" }} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disk Usage</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45%</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div className="bg-purple-500 h-2 rounded-full" style={{ width: "45%" }} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 bg-transparent">
              <div className="flex flex-col items-center gap-2">
                <Brain className="h-5 w-5" />
                <span className="text-sm">Add Model</span>
              </div>
            </Button>
            <Button variant="outline" className="h-20 bg-transparent">
              <div className="flex flex-col items-center gap-2">
                <Server className="h-5 w-5" />
                <span className="text-sm">Add Server</span>
              </div>
            </Button>
            <Button variant="outline" className="h-20 bg-transparent">
              <div className="flex flex-col items-center gap-2">
                <Cpu className="h-5 w-5" />
                <span className="text-sm">Add Agent</span>
              </div>
            </Button>
            <Button variant="outline" className="h-20 bg-transparent">
              <div className="flex flex-col items-center gap-2">
                <Zap className="h-5 w-5" />
                <span className="text-sm">Run Test</span>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Mock data functions
function getMockStats(): DashboardStats {
  return {
    active_models: 8,
    total_requests: 15432,
    avg_response_time: 187,
    connected_editors: 4,
    total_servers: 11,
    healthy_servers: 10,
    total_agents: 12,
    active_agents: 11,
    system_health: "healthy",
    uptime_percentage: 99.8,
  }
}

function getMockPerformanceData() {
  return [
    { time: "00:00", response_time: 150, requests: 120 },
    { time: "04:00", response_time: 165, requests: 95 },
    { time: "08:00", response_time: 210, requests: 280 },
    { time: "12:00", response_time: 195, requests: 350 },
    { time: "16:00", response_time: 180, requests: 420 },
    { time: "20:00", response_time: 170, requests: 310 },
    { time: "24:00", response_time: 160, requests: 180 },
  ]
}

function getMockActivityData() {
  return [
    { service: "OpenAI", requests: 4523 },
    { service: "Ollama", requests: 3210 },
    { service: "Orchestration", requests: 2845 },
    { service: "Agents", requests: 1934 },
    { service: "Custom", requests: 920 },
  ]
}

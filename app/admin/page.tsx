"use client"

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
import { useDashboard } from "@/lib/hooks/useDashboard"

export default function AdminDashboard() {
  const { data, loading, error } = useDashboard()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p>Failed to load dashboard data</p>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    )
  }

  const stats = data.systemStatus
  const metrics = data.metrics
  const recentActivity = data.recentActivity
  const topProviders = data.topProviders

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">AI Infrastructure Dashboard</h1>
          <p className="text-muted-foreground">Monitor and manage your entire AI ecosystem</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={stats.healthy === stats.totalServers ? "default" : "destructive"}>
            {stats.healthy === stats.totalServers ? (
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
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalUsers}</div>
            <p className="text-xs text-muted-foreground">System users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activeAgents}</div>
            <p className="text-xs text-muted-foreground">Running agents</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalRequests.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.averageResponseTime}ms</div>
            <p className="text-xs text-muted-foreground">
              {metrics.averageResponseTime < 200 ? "Excellent" : metrics.averageResponseTime < 500 ? "Good" : "Needs attention"}
            </p>
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
              <Badge variant="outline">{stats.totalServers}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Healthy</span>
              <Badge className="bg-green-500">{stats.healthy}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Issues</span>
              <Badge variant="destructive">{stats.totalServers - stats.healthy}</Badge>
            </div>
            <div className="pt-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all"
                  style={{ width: `${(stats.healthy / stats.totalServers) * 100}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {((stats.healthy / stats.totalServers) * 100).toFixed(1)}% operational
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cpu className="h-5 w-5" />
              System Resources
            </CardTitle>
            <CardDescription>CPU and memory usage</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">CPU Usage</span>
                <span className="text-sm">{stats.cpuUsage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all"
                  style={{ width: `${stats.cpuUsage}%` }}
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Memory Usage</span>
                <span className="text-sm">{stats.memoryUsage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-500 h-2 rounded-full transition-all"
                  style={{ width: `${stats.memoryUsage}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Activity
          </CardTitle>
          <CardDescription>Latest system events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.slice(0, 5).map((activity) => (
              <div key={activity.id} className="flex items-start gap-4 pb-4 border-b last:border-0">
                <div className="text-sm">
                  <p className="font-medium">{activity.type}</p>
                  <p className="text-muted-foreground">{activity.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">{activity.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Providers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Provider Status
          </CardTitle>
          <CardDescription>Provider usage and health</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topProviders.map((provider) => (
              <div key={provider.name} className="flex items-center justify-between pb-4 border-b last:border-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{provider.name}</span>
                  <Badge variant={provider.status === 'active' ? 'default' : 'secondary'}>
                    {provider.status}
                  </Badge>
                </div>
                <span className="text-sm text-muted-foreground">{provider.requests} requests</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

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

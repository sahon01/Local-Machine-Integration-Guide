import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Brain, Database, Server, Activity, Users, Settings, TrendingUp, Zap } from "lucide-react"
import { SystemOverview } from "@/components/system-overview"
import { ModelPerformance } from "@/components/model-performance"

export default function AdminDashboard() {
  const stats = [
    {
      title: "Active Models",
      value: "5",
      change: "+2 from last week",
      icon: Brain,
      color: "blue",
    },
    {
      title: "Total Requests",
      value: "12,847",
      change: "+18% from last month",
      icon: Activity,
      color: "green",
    },
    {
      title: "Database Connections",
      value: "23",
      change: "Stable",
      icon: Database,
      color: "purple",
    },
    {
      title: "Server Uptime",
      value: "99.9%",
      change: "Last 30 days",
      icon: Server,
      color: "orange",
    },
  ]

  const quickActions = [
    { title: "Add New Model", icon: Brain, href: "/admin/models" },
    { title: "Database Backup", icon: Database, href: "/admin/database" },
    { title: "Server Settings", icon: Settings, href: "/admin/server" },
    { title: "User Management", icon: Users, href: "/admin/users" },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Admin Dashboard</h1>
        <p className="text-slate-600">Monitor and manage your AI infrastructure</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-slate-500 mt-1">{stat.change}</p>
                </div>
                <div
                  className={`bg-${stat.color}-100 text-${stat.color}-800 rounded-full w-12 h-12 flex items-center justify-center`}
                >
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* System Overview */}
      <div className="mb-8">
        <SystemOverview />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full justify-start h-auto p-4 bg-transparent hover:bg-slate-50"
              >
                <action.icon className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">{action.title}</div>
                </div>
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Model Performance */}
        <ModelPerformance />
      </div>

      {/* System Status */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            System Status
          </CardTitle>
          <CardDescription>Real-time system health monitoring</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div>
                  <div className="font-medium">AI Models Server</div>
                  <div className="text-sm text-slate-600">localhost:3307</div>
                </div>
              </div>
              <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                Online
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <div>
                  <div className="font-medium">Database Server</div>
                  <div className="text-sm text-slate-600">MySQL on port 3307</div>
                </div>
              </div>
              <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                Connected
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <div>
                  <div className="font-medium">ElevenLabs Integration</div>
                  <div className="text-sm text-slate-600">Voice processing API</div>
                </div>
              </div>
              <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">
                Active
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

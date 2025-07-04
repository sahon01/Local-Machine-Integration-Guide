import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Brain, Bot, Database, Server, Zap, ArrowRight, CheckCircle, Globe, Code, Terminal } from "lucide-react"
import Link from "next/link"
import { SystemOverview } from "@/components/system-overview"
import { RecentActivity } from "@/components/recent-activity"

export default function HomePage() {
  const features = [
    {
      icon: Brain,
      title: "AI Model Management",
      description: "Monitor and control local AI models with real-time performance metrics",
      href: "/models",
      color: "blue",
    },
    {
      icon: Bot,
      title: "AI Chat Interface",
      description: "Interactive chat with all your local AI models in one place",
      href: "/ai-chat",
      color: "green",
    },
    {
      icon: Database,
      title: "Database Tools",
      description: "MySQL management, analysis, and backup tools",
      href: "/database",
      color: "purple",
    },
    {
      icon: Server,
      title: "Server Management",
      description: "WHM domains, SSH tools, and server access controls",
      href: "/server/whm-domains",
      color: "orange",
    },
  ]

  const quickActions = [
    { title: "Setup Guide", href: "/setup", icon: CheckCircle },
    { title: "Documentation", href: "/documentation", icon: Globe },
    { title: "Admin Panel", href: "/admin", icon: Code },
    { title: "Troubleshooting", href: "/troubleshooting", icon: Terminal },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-blue-100 text-blue-800 rounded-full w-16 h-16 flex items-center justify-center">
              <Brain className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900">AI Management Dashboard</h1>
              <p className="text-xl text-slate-600 mt-2">Comprehensive AI model management and development toolkit</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 mb-6">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Local Models Active
            </Badge>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              Multi-Language Support
            </Badge>
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
              Real-time Monitoring
            </Badge>
          </div>
        </div>

        {/* System Overview */}
        <div className="mb-12">
          <SystemOverview />
        </div>

        {/* Main Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
              <Link href={feature.href}>
                <CardHeader className="pb-3">
                  <div
                    className={`bg-${feature.color}-100 text-${feature.color}-800 rounded-full w-12 h-12 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
                  >
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription className="text-sm">{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" className="w-full justify-between group-hover:bg-slate-50">
                    Get Started
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>Get started with common tasks and configurations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <Link key={index} href={action.href}>
                  <Button
                    variant="outline"
                    className="w-full justify-start h-auto p-4 bg-transparent hover:bg-slate-50"
                  >
                    <action.icon className="h-5 w-5 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">{action.title}</div>
                    </div>
                  </Button>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentActivity />

          {/* Getting Started */}
          <Card>
            <CardHeader>
              <CardTitle>Getting Started</CardTitle>
              <CardDescription>Follow these steps to set up your AI management system</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">
                  1
                </div>
                <div>
                  <div className="font-medium">Install Dependencies</div>
                  <div className="text-sm text-slate-600">Run the Windows installer or manual setup</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">
                  2
                </div>
                <div>
                  <div className="font-medium">Configure Environment</div>
                  <div className="text-sm text-slate-600">Set up your .env.local file with database credentials</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">
                  3
                </div>
                <div>
                  <div className="font-medium">Start Local Server</div>
                  <div className="text-sm text-slate-600">Launch your AI models on localhost:3307</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-green-100 text-green-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">
                  ✓
                </div>
                <div>
                  <div className="font-medium">Ready to Use</div>
                  <div className="text-sm text-slate-600">Access all features through the dashboard</div>
                </div>
              </div>
              <div className="pt-4">
                <Link href="/setup">
                  <Button className="w-full">
                    View Setup Guide
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Activity, Cpu, HardDrive, MemoryStick, Wifi } from "lucide-react"

export function SystemOverview() {
  const systemStats = {
    cpu: 45,
    memory: 62,
    disk: 78,
    network: 23,
    uptime: "2d 14h 32m",
    activeConnections: 12,
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          System Overview
        </CardTitle>
        <CardDescription>Real-time system performance and resource usage</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* CPU Usage */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="h-4 w-4 text-blue-500" />
                <span className="font-medium">CPU Usage</span>
              </div>
              <span className="text-sm text-slate-600">{systemStats.cpu}%</span>
            </div>
            <Progress value={systemStats.cpu} className="h-2" />
            <p className="text-xs text-slate-500">Intel Core i7-12700K</p>
          </div>

          {/* Memory Usage */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MemoryStick className="h-4 w-4 text-green-500" />
                <span className="font-medium">Memory</span>
              </div>
              <span className="text-sm text-slate-600">{systemStats.memory}%</span>
            </div>
            <Progress value={systemStats.memory} className="h-2" />
            <p className="text-xs text-slate-500">10.2GB / 16GB</p>
          </div>

          {/* Disk Usage */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HardDrive className="h-4 w-4 text-orange-500" />
                <span className="font-medium">Disk Space</span>
              </div>
              <span className="text-sm text-slate-600">{systemStats.disk}%</span>
            </div>
            <Progress value={systemStats.disk} className="h-2" />
            <p className="text-xs text-slate-500">780GB / 1TB</p>
          </div>

          {/* Network Usage */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wifi className="h-4 w-4 text-purple-500" />
                <span className="font-medium">Network</span>
              </div>
              <span className="text-sm text-slate-600">{systemStats.network}%</span>
            </div>
            <Progress value={systemStats.network} className="h-2" />
            <p className="text-xs text-slate-500">23MB/s throughput</p>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-200">
          <div className="flex items-center gap-4">
            <div>
              <p className="text-sm font-medium">System Uptime</p>
              <p className="text-xs text-slate-600">{systemStats.uptime}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Active Connections</p>
              <p className="text-xs text-slate-600">{systemStats.activeConnections} connections</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Healthy
            </Badge>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              All Services Running
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

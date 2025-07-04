"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useSystemMonitor } from "@/components/system-monitor-provider"
import { useVoice } from "@/components/voice-provider"
import { Monitor, Cpu, MemoryStick, HardDrive, Activity, RefreshCw, Volume2 } from "lucide-react"

export default function SystemMonitorPage() {
  const { systemInfo, isMonitoring, startMonitoring, stopMonitoring, refreshSystemInfo } = useSystemMonitor()
  const { speak } = useVoice()

  const handleVoiceReport = () => {
    const report = `System status report: CPU usage is ${systemInfo.cpuUsage}%. Memory usage is ${systemInfo.usedRAM.toFixed(1)} GB out of ${systemInfo.totalRAM} GB. Disk usage is ${systemInfo.diskUsage}%. ${systemInfo.activeProcesses} processes are currently running.`
    speak(report)
  }

  const getUsageColor = (percentage: number) => {
    if (percentage < 50) return "text-green-600"
    if (percentage < 80) return "text-yellow-600"
    return "text-red-600"
  }

  const getUsageBarColor = (percentage: number) => {
    if (percentage < 50) return "bg-green-500"
    if (percentage < 80) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">System Monitor</h1>
            <p className="text-slate-600">Real-time system performance monitoring with voice reports</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleVoiceReport}>
              <Volume2 className="h-4 w-4 mr-2" />
              Voice Report
            </Button>
            <Button variant="outline" onClick={refreshSystemInfo}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={isMonitoring ? stopMonitoring : startMonitoring}>
              <Activity className="h-4 w-4 mr-2" />
              {isMonitoring ? "Stop" : "Start"} Monitoring
            </Button>
          </div>
        </div>

        {/* System Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">CPU Usage</p>
                  <p className={`text-2xl font-bold ${getUsageColor(systemInfo.cpuUsage)}`}>{systemInfo.cpuUsage}%</p>
                </div>
                <Cpu className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Memory Usage</p>
                  <p
                    className={`text-2xl font-bold ${getUsageColor((systemInfo.usedRAM / systemInfo.totalRAM) * 100)}`}
                  >
                    {systemInfo.usedRAM.toFixed(1)}GB
                  </p>
                </div>
                <MemoryStick className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Disk Usage</p>
                  <p className={`text-2xl font-bold ${getUsageColor(systemInfo.diskUsage)}`}>{systemInfo.diskUsage}%</p>
                </div>
                <HardDrive className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Active Processes</p>
                  <p className="text-2xl font-bold">{systemInfo.activeProcesses}</p>
                </div>
                <Activity className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Monitoring */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="h-5 w-5" />
                Resource Usage
              </CardTitle>
              <CardDescription>Real-time system resource monitoring</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* CPU Usage */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Cpu className="h-4 w-4" />
                    <span className="font-medium">CPU Usage</span>
                  </div>
                  <span className={`font-bold ${getUsageColor(systemInfo.cpuUsage)}`}>{systemInfo.cpuUsage}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ${getUsageBarColor(systemInfo.cpuUsage)}`}
                    style={{ width: `${systemInfo.cpuUsage}%` }}
                  ></div>
                </div>
              </div>

              {/* Memory Usage */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <MemoryStick className="h-4 w-4" />
                    <span className="font-medium">Memory Usage</span>
                  </div>
                  <span className={`font-bold ${getUsageColor((systemInfo.usedRAM / systemInfo.totalRAM) * 100)}`}>
                    {systemInfo.usedRAM.toFixed(1)}GB / {systemInfo.totalRAM}GB
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ${getUsageBarColor((systemInfo.usedRAM / systemInfo.totalRAM) * 100)}`}
                    style={{ width: `${(systemInfo.usedRAM / systemInfo.totalRAM) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Disk Usage */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <HardDrive className="h-4 w-4" />
                    <span className="font-medium">Disk Usage</span>
                  </div>
                  <span className={`font-bold ${getUsageColor(systemInfo.diskUsage)}`}>{systemInfo.diskUsage}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ${getUsageBarColor(systemInfo.diskUsage)}`}
                    style={{ width: `${systemInfo.diskUsage}%` }}
                  ></div>
                </div>
              </div>

              {/* Network Activity */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    <span className="font-medium">Network Activity</span>
                  </div>
                  <span className="font-bold">{systemInfo.networkActivity.toFixed(1)} MB/s</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3">
                  <div
                    className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((systemInfo.networkActivity / 10) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Information</CardTitle>
              <CardDescription>Detailed system specifications and status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-600">Total RAM:</span>
                    <span className="ml-2 font-medium">{systemInfo.totalRAM}GB</span>
                  </div>
                  <div>
                    <span className="text-slate-600">Free RAM:</span>
                    <span className="ml-2 font-medium">{systemInfo.freeRAM.toFixed(1)}GB</span>
                  </div>
                  <div>
                    <span className="text-slate-600">Active Processes:</span>
                    <span className="ml-2 font-medium">{systemInfo.activeProcesses}</span>
                  </div>
                  <div>
                    <span className="text-slate-600">Monitoring:</span>
                    <Badge variant={isMonitoring ? "default" : "secondary"} className="ml-2">
                      {isMonitoring ? "Active" : "Stopped"}
                    </Badge>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3">Performance Alerts</h3>
                  <div className="space-y-2">
                    {systemInfo.cpuUsage > 80 && (
                      <div className="p-2 bg-red-50 border border-red-200 rounded text-sm text-red-800">
                        ⚠️ High CPU usage detected ({systemInfo.cpuUsage}%)
                      </div>
                    )}
                    {(systemInfo.usedRAM / systemInfo.totalRAM) * 100 > 85 && (
                      <div className="p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                        ⚠️ High memory usage detected ({((systemInfo.usedRAM / systemInfo.totalRAM) * 100).toFixed(1)}%)
                      </div>
                    )}
                    {systemInfo.diskUsage > 90 && (
                      <div className="p-2 bg-red-50 border border-red-200 rounded text-sm text-red-800">
                        ⚠️ Low disk space ({systemInfo.diskUsage}% used)
                      </div>
                    )}
                    {systemInfo.cpuUsage < 50 && (systemInfo.usedRAM / systemInfo.totalRAM) * 100 < 60 && (
                      <div className="p-2 bg-green-50 border border-green-200 rounded text-sm text-green-800">
                        ✅ System performance is optimal
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

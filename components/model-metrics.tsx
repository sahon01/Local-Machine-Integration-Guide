"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Clock, Zap, Target } from "lucide-react"

interface ModelMetricsProps {
  modelId: string
}

export function ModelMetrics({ modelId }: ModelMetricsProps) {
  const metrics = {
    responseTime: {
      current: 0.8,
      average: 1.2,
      trend: "improving",
    },
    accuracy: {
      current: 94,
      average: 91,
      trend: "stable",
    },
    throughput: {
      current: 45,
      average: 38,
      trend: "improving",
    },
    efficiency: {
      current: 87,
      average: 82,
      trend: "improving",
    },
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Performance Metrics
          </CardTitle>
          <CardDescription>Real-time performance indicators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span className="font-medium">Response Time</span>
                </div>
                <span className="text-sm text-slate-600">{metrics.responseTime.current}s</span>
              </div>
              <Progress value={(metrics.responseTime.current / 2) * 100} className="h-3" />
              <div className="text-xs text-slate-500">Average: {metrics.responseTime.average}s</div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  <span className="font-medium">Accuracy</span>
                </div>
                <span className="text-sm text-slate-600">{metrics.accuracy.current}%</span>
              </div>
              <Progress value={metrics.accuracy.current} className="h-3" />
              <div className="text-xs text-slate-500">Average: {metrics.accuracy.average}%</div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  <span className="font-medium">Throughput</span>
                </div>
                <span className="text-sm text-slate-600">{metrics.throughput.current} req/min</span>
              </div>
              <Progress value={(metrics.throughput.current / 60) * 100} className="h-3" />
              <div className="text-xs text-slate-500">Average: {metrics.throughput.average} req/min</div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  <span className="font-medium">Efficiency</span>
                </div>
                <span className="text-sm text-slate-600">{metrics.efficiency.current}%</span>
              </div>
              <Progress value={metrics.efficiency.current} className="h-3" />
              <div className="text-xs text-slate-500">Average: {metrics.efficiency.average}%</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Performance Trends</CardTitle>
          <CardDescription>24-hour performance overview</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-48 bg-slate-50 rounded-lg flex items-center justify-center">
            <div className="text-center text-slate-500">
              <TrendingUp className="h-12 w-12 mx-auto mb-4" />
              <div className="text-lg font-medium">Performance Chart</div>
              <div className="text-sm">Real-time metrics visualization would appear here</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

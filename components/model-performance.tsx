"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, TrendingUp, Clock, Zap } from "lucide-react"

export function ModelPerformance() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Performance Metrics
        </CardTitle>
        <CardDescription>Response times and throughput for the last 24 hours</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64 bg-slate-50 rounded-lg flex items-center justify-center">
          <div className="text-center text-slate-500">
            <TrendingUp className="h-12 w-12 mx-auto mb-4" />
            <div className="text-lg font-medium">Performance Chart</div>
            <div className="text-sm">Real-time metrics would be displayed here</div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="text-center p-3 bg-slate-50 rounded-lg">
            <Clock className="h-5 w-5 mx-auto mb-2 text-blue-500" />
            <div className="text-lg font-bold">1.2s</div>
            <div className="text-sm text-slate-600">Avg Response</div>
          </div>
          <div className="text-center p-3 bg-slate-50 rounded-lg">
            <Zap className="h-5 w-5 mx-auto mb-2 text-green-500" />
            <div className="text-lg font-bold">98.5%</div>
            <div className="text-sm text-slate-600">Success Rate</div>
          </div>
          <div className="text-center p-3 bg-slate-50 rounded-lg">
            <TrendingUp className="h-5 w-5 mx-auto mb-2 text-purple-500" />
            <div className="text-lg font-bold">1,430</div>
            <div className="text-sm text-slate-600">Total Requests</div>
          </div>
          <div className="text-center p-3 bg-slate-50 rounded-lg">
            <BarChart3 className="h-5 w-5 mx-auto mb-2 text-orange-500" />
            <div className="text-lg font-bold">85%</div>
            <div className="text-sm text-slate-600">Efficiency</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

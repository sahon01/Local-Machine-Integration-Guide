"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface SystemInfo {
  totalRAM: number
  usedRAM: number
  freeRAM: number
  cpuUsage: number
  diskUsage: number
  activeProcesses: number
  networkActivity: number
}

interface SystemMonitorContextType {
  systemInfo: SystemInfo
  isMonitoring: boolean
  startMonitoring: () => void
  stopMonitoring: () => void
  refreshSystemInfo: () => void
}

const SystemMonitorContext = createContext<SystemMonitorContextType | undefined>(undefined)

export function SystemMonitorProvider({ children }: { children: React.ReactNode }) {
  const [systemInfo, setSystemInfo] = useState<SystemInfo>({
    totalRAM: 16,
    usedRAM: 8.5,
    freeRAM: 7.5,
    cpuUsage: 45,
    diskUsage: 65,
    activeProcesses: 156,
    networkActivity: 2.3,
  })
  const [isMonitoring, setIsMonitoring] = useState(false)

  const getSystemInfo = async (): Promise<SystemInfo> => {
    try {
      // In a real implementation, this would call a local API or use Node.js APIs
      // For now, we'll simulate with realistic data that changes over time
      const baseRAM = 16
      const variation = Math.random() * 2 - 1 // -1 to 1 GB variation
      const usedRAM = Math.max(6, Math.min(14, 8.5 + variation))

      return {
        totalRAM: baseRAM,
        usedRAM: usedRAM,
        freeRAM: baseRAM - usedRAM,
        cpuUsage: Math.max(20, Math.min(80, 45 + (Math.random() * 20 - 10))),
        diskUsage: Math.max(50, Math.min(90, 65 + (Math.random() * 10 - 5))),
        activeProcesses: Math.floor(150 + Math.random() * 20),
        networkActivity: Math.max(0.5, Math.min(10, 2.3 + (Math.random() * 2 - 1))),
      }
    } catch (error) {
      console.error("Failed to get system info:", error)
      return systemInfo // Return current state on error
    }
  }

  const refreshSystemInfo = async () => {
    const newInfo = await getSystemInfo()
    setSystemInfo(newInfo)
  }

  const startMonitoring = () => {
    setIsMonitoring(true)
  }

  const stopMonitoring = () => {
    setIsMonitoring(false)
  }

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isMonitoring) {
      interval = setInterval(refreshSystemInfo, 5000) // Update every 5 seconds
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [isMonitoring])

  useEffect(() => {
    // Initial load
    refreshSystemInfo()
    startMonitoring()
  }, [])

  return (
    <SystemMonitorContext.Provider
      value={{
        systemInfo,
        isMonitoring,
        startMonitoring,
        stopMonitoring,
        refreshSystemInfo,
      }}
    >
      {children}
    </SystemMonitorContext.Provider>
  )
}

export function useSystemMonitor() {
  const context = useContext(SystemMonitorContext)
  if (context === undefined) {
    throw new Error("useSystemMonitor must be used within a SystemMonitorProvider")
  }
  return context
}

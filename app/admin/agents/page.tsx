"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Bot, ServerIcon, Activity, Plus, Search, Trash2, Play, Info } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

interface Agent {
  id: number
  name: string
  agent_type: string
  description: string
  server_id: number
  server_name: string
  port: number
  endpoint: string
  capabilities: string
  is_active: boolean
  health_status: "healthy" | "degraded" | "down"
  last_health_check: string
  avg_response_time_ms: number
  total_requests: number
  error_count: number
  created_at: string
}

interface Server {
  id: number
  name: string
  port: number
  base_url: string
  type: string
  is_active: boolean
}

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [servers, setServers] = useState<Server[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchAgents()
    fetchServers()

    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchAgents, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchAgents = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/admin/agents`)
      if (response.ok) {
        const data = await response.json()
        setAgents(data.agents || data || [])
      }
      setLoading(false)
    } catch (error) {
      console.error("Failed to fetch agents:", error)
      // Fallback to mock data for development
      setAgents(getMockAgents())
      setLoading(false)
    }
  }

  const fetchServers = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/admin/servers`)
      if (response.ok) {
        const data = await response.json()
        setServers(data.servers || data || [])
      }
    } catch (error) {
      console.error("Failed to fetch servers:", error)
      setServers(getMockServers())
    }
  }

  const addAgent = async (agentData: any) => {
    try {
      const response = await fetch(`${API_BASE}/api/admin/agents`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(agentData),
      })

      if (response.ok) {
        toast({
          title: "সফল",
          description: "এজেন্ট সফলভাবে যুক্ত হয়েছে",
        })
        setShowAddModal(false)
        fetchAgents()
      } else {
        throw new Error("Failed to add agent")
      }
    } catch (error) {
      toast({
        title: "ত্রুটি",
        description: "এজেন্ট যুক্ত করতে ব্যর্থ",
        variant: "destructive",
      })
    }
  }

  const testAgent = async (agent: Agent) => {
    try {
      const response = await fetch(`${API_BASE}/api/admin/agents/${agent.id}/test`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: "Test message",
          test: true,
        }),
      })

      const result = await response.json()

      toast({
        title: result.success ? "পরীক্ষা সফল" : "পরীক্ষা ব্যর্থ",
        description: `Response time: ${result.response_time_ms}ms`,
      })
    } catch (error: any) {
      toast({
        title: "পরীক্ষা ব্যর্থ",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const deleteAgent = async (id: number) => {
    if (!confirm("আপনি কি নিশ্চিত এই এজেন্ট মুছে ফেলতে চান?")) return

    try {
      const response = await fetch(`${API_BASE}/api/admin/agents/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "সফল",
          description: "এজেন্ট মুছে ফেলা হয়েছে",
        })
        fetchAgents()
      }
    } catch (error) {
      toast({
        title: "ত্রুটি",
        description: "এজেন্ট মুছে ফেলতে ব্যর্থ",
        variant: "destructive",
      })
    }
  }

  // Filter agents
  const filteredAgents = agents.filter((agent) => {
    const matchesSearch =
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.agent_type.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || agent.agent_type === filterType
    return matchesSearch && matchesType
  })

  // Get unique agent types for filter
  const agentTypes = ["all", ...new Set(agents.map((a) => a.agent_type))]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>লোড হচ্ছে...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">🤖 এজেন্ট ম্যানেজমেন্ট</h1>
          <p className="text-muted-foreground">ডাটাবেস থেকে সব AI এজেন্ট ডায়নামিকভাবে পরিচালনা করুন</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="mr-2 h-4 w-4" />
          নতুন এজেন্ট যুক্ত করুন
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">মোট এজেন্ট</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{agents.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">সক্রিয়</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{agents.filter((a) => a.is_active).length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">সুস্থ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {agents.filter((a) => a.health_status === "healthy").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">সার্ভার</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Set(agents.map((a) => a.server_id)).size}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="নাম বা টাইপ দিয়ে খুঁজুন..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="টাইপ দিয়ে ফিল্টার" />
          </SelectTrigger>
          <SelectContent>
            {agentTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type === "all" ? "সব টাইপ" : type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Dynamic Agent Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAgents.map((agent) => (
          <Card key={agent.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  <CardTitle className="text-lg">{agent.name}</CardTitle>
                </div>
                <Badge variant={agent.is_active ? "default" : "secondary"}>
                  {agent.is_active ? "সক্রিয়" : "নিষ্ক্রিয়"}
                </Badge>
              </div>
              <CardDescription>{agent.description || "কোন বিবরণ নেই"}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
              {/* Server Info */}
              <div className="flex items-center gap-2 text-sm">
                <ServerIcon className="h-4 w-4 text-gray-500" />
                <span className="font-medium">{agent.server_name}</span>
                <Badge variant="outline">{agent.port}</Badge>
              </div>

              {/* Endpoint */}
              <div className="text-sm">
                <span className="font-medium">এন্ডপয়েন্ট:</span>
                <code className="ml-2 bg-gray-100 px-2 py-1 rounded text-xs block mt-1">{agent.endpoint}</code>
              </div>

              {/* Agent Type */}
              <div className="text-sm">
                <span className="font-medium">টাইপ:</span>
                <Badge variant="outline" className="ml-2">
                  {agent.agent_type}
                </Badge>
              </div>

              {/* Capabilities */}
              {agent.capabilities && (
                <div>
                  <span className="text-sm font-medium">সক্ষমতা:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {JSON.parse(agent.capabilities)
                      .slice(0, 3)
                      .map((cap: string) => (
                        <Badge key={cap} variant="secondary" className="text-xs">
                          {cap}
                        </Badge>
                      ))}
                    {JSON.parse(agent.capabilities).length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{JSON.parse(agent.capabilities).length - 3} আরো
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {/* Health Status */}
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      agent.health_status === "healthy"
                        ? "bg-green-500 animate-pulse"
                        : agent.health_status === "degraded"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                    }`}
                  />
                  <span className="text-sm capitalize">
                    {agent.health_status === "healthy" ? "সুস্থ" : agent.health_status === "degraded" ? "দুর্বল" : "বন্ধ"}
                  </span>
                </div>
              </div>

              {/* Performance */}
              {agent.total_requests > 0 && (
                <div className="text-xs text-gray-600">
                  গড় সাড়া: {agent.avg_response_time_ms}ms | অনুরোধ: {agent.total_requests} | সফলতা:{" "}
                  {(((agent.total_requests - agent.error_count) / agent.total_requests) * 100).toFixed(1)}%
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline" onClick={() => testAgent(agent)}>
                  <Play className="h-3 w-3 mr-1" />
                  পরীক্ষা
                </Button>
                <Button size="sm" variant="outline" onClick={() => setSelectedAgent(agent)}>
                  <Info className="h-3 w-3 mr-1" />
                  বিস্তারিত
                </Button>
                <Button size="sm" variant="outline" onClick={() => deleteAgent(agent.id)}>
                  <Trash2 className="h-3 w-3 mr-1" />
                  মুছুন
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredAgents.length === 0 && (
        <div className="text-center py-12">
          <Bot className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold">কোন এজেন্ট পাওয়া যায়নি</h3>
          <p className="text-gray-500">শুরু করতে আপনার প্রথম এজেন্ট যুক্ত করুন</p>
          <Button className="mt-4" onClick={() => setShowAddModal(true)}>
            এজেন্ট যুক্ত করুন
          </Button>
        </div>
      )}

      {/* Add Agent Modal */}
      {showAddModal && <AddAgentDialog servers={servers} onAdd={addAgent} onClose={() => setShowAddModal(false)} />}

      {/* Agent Details Modal */}
      {selectedAgent && <AgentDetailsDialog agent={selectedAgent} onClose={() => setSelectedAgent(null)} />}
    </div>
  )
}

// Add Agent Dialog Component
function AddAgentDialog({
  servers,
  onAdd,
  onClose,
}: {
  servers: Server[]
  onAdd: (data: any) => Promise<void>
  onClose: () => void
}) {
  const [formData, setFormData] = useState({
    name: "",
    agent_type: "",
    server_id: "",
    endpoint: "",
    capabilities: "",
    description: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const capabilitiesArray = formData.capabilities
      .split(",")
      .map((c) => c.trim())
      .filter((c) => c.length > 0)

    onAdd({
      ...formData,
      server_id: Number.parseInt(formData.server_id),
      capabilities: capabilitiesArray,
    })
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>➕ নতুন এজেন্ট যুক্ত করুন</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>এজেন্টের নাম *</Label>
            <Input
              placeholder="যেমন: আমার কাস্টম এজেন্ট"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div>
            <Label>এজেন্ট টাইপ *</Label>
            <Input
              placeholder="যেমন: editor, analyzer, custom"
              value={formData.agent_type}
              onChange={(e) => setFormData({ ...formData, agent_type: e.target.value })}
              required
            />
            <p className="text-xs text-gray-500 mt-1">গ্রুপিং/ফিল্টারিংয়ের জন্য টাইপ নাম</p>
          </div>

          <div>
            <Label>সার্ভার *</Label>
            <Select
              value={formData.server_id}
              onValueChange={(value) => setFormData({ ...formData, server_id: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="সার্ভার নির্বাচন করুন" />
              </SelectTrigger>
              <SelectContent>
                {servers.map((server) => (
                  <SelectItem key={server.id} value={server.id.toString()}>
                    {server.name} - পোর্ট {server.port} ({server.type})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>এন্ডপয়েন্ট পাথ *</Label>
            <Input
              placeholder="যেমন: /agents/my-agent অথবা /api/custom"
              value={formData.endpoint}
              onChange={(e) => setFormData({ ...formData, endpoint: e.target.value })}
              required
            />
            <div className="bg-blue-50 border border-blue-200 rounded p-3 mt-2">
              <p className="text-xs text-blue-800">
                <strong>💡 কীভাবে কাজ করে:</strong>
                <br />
                যদি সার্ভার = "Orchestration (8000)" এবং এন্ডপয়েন্ট = "/agents/editor"
                <br />
                তাহলে সম্পূর্ণ URL: <code>http://localhost:8000/agents/editor</code>
              </p>
              <p className="text-xs text-blue-800 mt-1">এই এন্ডপয়েন্টে রিকোয়েস্ট পাঠালে এজেন্ট রেসপন্স দেবে।</p>
            </div>
          </div>

          <div>
            <Label>সক্ষমতা (কমা দিয়ে আলাদা)</Label>
            <Input
              placeholder="যেমন: coding, debugging, analysis, refactoring"
              value={formData.capabilities}
              onChange={(e) => setFormData({ ...formData, capabilities: e.target.value })}
            />
          </div>

          <div>
            <Label>বিবরণ</Label>
            <Textarea
              placeholder="এজেন্টের বিবরণ লিখুন..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              বাতিল
            </Button>
            <Button type="submit">✅ এজেন্ট যুক্ত করুন</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Agent Details Dialog
function AgentDetailsDialog({ agent, onClose }: { agent: Agent; onClose: () => void }) {
  const capabilities = agent.capabilities ? JSON.parse(agent.capabilities) : []

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            {agent.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">মৌলিক তথ্য</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <strong>আইডি:</strong> {agent.id}
                </div>
                <div>
                  <strong>টাইপ:</strong> <Badge>{agent.agent_type}</Badge>
                </div>
                <div>
                  <strong>স্ট্যাটাস:</strong>{" "}
                  <Badge variant={agent.is_active ? "default" : "secondary"}>
                    {agent.is_active ? "সক্রিয়" : "নিষ্ক্রিয়"}
                  </Badge>
                </div>
                <div>
                  <strong>স্বাস্থ্য:</strong>{" "}
                  <Badge
                    variant={
                      agent.health_status === "healthy"
                        ? "default"
                        : agent.health_status === "degraded"
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {agent.health_status === "healthy" ? "সুস্থ" : agent.health_status === "degraded" ? "দুর্বল" : "বন্ধ"}
                  </Badge>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">সার্ভার তথ্য</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <strong>সার্ভার:</strong> {agent.server_name}
                </div>
                <div>
                  <strong>পোর্ট:</strong> {agent.port}
                </div>
                <div>
                  <strong>এন্ডপয়েন্ট:</strong>
                </div>
                <code className="block bg-gray-100 p-2 rounded text-xs">{agent.endpoint}</code>
              </div>
            </div>
          </div>

          {/* Description */}
          {agent.description && (
            <div>
              <h3 className="font-semibold mb-2">বিবরণ</h3>
              <p className="text-sm text-gray-600">{agent.description}</p>
            </div>
          )}

          {/* Capabilities */}
          {capabilities.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">সক্ষমতা ({capabilities.length})</h3>
              <div className="flex flex-wrap gap-2">
                {capabilities.map((cap: string) => (
                  <Badge key={cap} variant="secondary">
                    {cap}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Performance Metrics */}
          {agent.total_requests > 0 && (
            <div>
              <h3 className="font-semibold mb-2">পারফরম্যান্স মেট্রিক্স</h3>
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">মোট অনুরোধ</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{agent.total_requests}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">গড় সাড়া সময়</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{agent.avg_response_time_ms}ms</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">সফলতার হার</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {(((agent.total_requests - agent.error_count) / agent.total_requests) * 100).toFixed(1)}%
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div>
            <h3 className="font-semibold mb-2">টাইমস্ট্যাম্প</h3>
            <div className="space-y-1 text-sm">
              <div>
                <strong>তৈরির তারিখ:</strong> {new Date(agent.created_at).toLocaleString("bn-BD")}
              </div>
              {agent.last_health_check && (
                <div>
                  <strong>সর্বশেষ স্বাস্থ্য পরীক্ষা:</strong> {new Date(agent.last_health_check).toLocaleString("bn-BD")}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={onClose}>বন্ধ করুন</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Mock data for development (when API is not available)
function getMockAgents(): Agent[] {
  return [
    {
      id: 1,
      name: "Editor Agent",
      agent_type: "editor",
      description: "Code editing and refactoring specialist",
      server_id: 2,
      server_name: "Orchestration API",
      port: 8000,
      endpoint: "/agents/editor",
      capabilities: '["code_editing", "refactoring", "debugging", "code_formatting"]',
      is_active: true,
      health_status: "healthy",
      last_health_check: new Date().toISOString(),
      avg_response_time_ms: 120,
      total_requests: 1523,
      error_count: 15,
      created_at: new Date().toISOString(),
    },
    {
      id: 2,
      name: "Analyzer Agent",
      agent_type: "analyzer",
      description: "Code quality and security analyzer",
      server_id: 2,
      server_name: "Orchestration API",
      port: 8000,
      endpoint: "/agents/analyzer",
      capabilities: '["code_analysis", "quality_check", "security_scan"]',
      is_active: true,
      health_status: "healthy",
      last_health_check: new Date().toISOString(),
      avg_response_time_ms: 180,
      total_requests: 892,
      error_count: 8,
      created_at: new Date().toISOString(),
    },
    {
      id: 3,
      name: "Bengali NLP",
      agent_type: "nlp",
      description: "Bengali language processing",
      server_id: 4,
      server_name: "Bengali NLP Agent",
      port: 8002,
      endpoint: "/v1/chat/completions",
      capabilities: '["bengali_processing", "language_understanding"]',
      is_active: true,
      health_status: "healthy",
      last_health_check: new Date().toISOString(),
      avg_response_time_ms: 250,
      total_requests: 2341,
      error_count: 23,
      created_at: new Date().toISOString(),
    },
  ]
}

function getMockServers(): Server[] {
  return [
    { id: 1, name: "Our-Server", port: 12345, base_url: "http://localhost", type: "main_server", is_active: true },
    {
      id: 2,
      name: "Orchestration API",
      port: 8000,
      base_url: "http://localhost",
      type: "orchestration",
      is_active: true,
    },
    { id: 3, name: "OpenAI Gateway", port: 8001, base_url: "http://localhost", type: "gateway", is_active: true },
    { id: 4, name: "Bengali NLP Agent", port: 8002, base_url: "http://localhost", type: "agent", is_active: true },
  ]
}

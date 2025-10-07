"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Users, DollarSign, Settings, CheckCircle, AlertCircle } from "lucide-react"

export default function WHMCSPage() {
  const [connected, setConnected] = useState(false)
  const [clients] = useState([
    { id: 1, name: "Client A", email: "clienta@example.com", status: "active", service: "AI API Access" },
    { id: 2, name: "Client B", email: "clientb@example.com", status: "active", service: "Custom AI Agent" },
    { id: 3, name: "Client C", email: "clientc@example.com", status: "suspended", service: "AI API Access" },
  ])

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">WHMCS Integration</h1>
          <p className="text-muted-foreground">Client and billing management</p>
        </div>
        <Badge variant={connected ? "default" : "secondary"}>
          {connected ? (
            <>
              <CheckCircle className="h-3 w-3 mr-1" />
              Connected
            </>
          ) : (
            <>
              <AlertCircle className="h-3 w-3 mr-1" />
              Not Connected
            </>
          )}
        </Badge>
      </div>

      {/* Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            WHMCS Configuration
          </CardTitle>
          <CardDescription>Configure your WHMCS API connection</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>API URL</Label>
            <Input placeholder="https://your-whmcs.com/includes/api.php" />
          </div>
          <div className="space-y-2">
            <Label>API Identifier</Label>
            <Input placeholder="Your API Identifier" />
          </div>
          <div className="space-y-2">
            <Label>API Secret</Label>
            <Input type="password" placeholder="Your API Secret" />
          </div>
          <div className="flex gap-2">
            <Button>Test Connection</Button>
            <Button variant="outline">Save Configuration</Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Users className="h-4 w-4" />
              Total Clients
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clients.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Active Services
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {clients.filter((c) => c.status === "active").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Monthly Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1,250</div>
          </CardContent>
        </Card>
      </div>

      {/* Client List */}
      <Card>
        <CardHeader>
          <CardTitle>Active Clients</CardTitle>
          <CardDescription>Manage client services and access</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {clients.map((client) => (
              <div key={client.id} className="flex justify-between items-center p-3 border rounded">
                <div>
                  <h4 className="font-medium">{client.name}</h4>
                  <p className="text-sm text-muted-foreground">{client.email}</p>
                  <Badge variant="outline" className="mt-1">
                    {client.service}
                  </Badge>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={client.status === "active" ? "default" : "destructive"}>{client.status}</Badge>
                  <Button size="sm" variant="outline">
                    Manage
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Settings, Play, Trash2, User, Brain } from "lucide-react"

const characters = [
  {
    id: 1,
    name: "DevMentor",
    description: "Senior developer mentor specializing in React and Node.js",
    expertise: "Web Development",
    model: "mistral",
    language: "en",
    voiceEnabled: true,
    activeChats: 3,
    lastUsed: "2 hours ago",
  },
  {
    id: 2,
    name: "CodeReviewer",
    description: "Expert code reviewer focusing on best practices and security",
    expertise: "Code Review",
    model: "deepseek",
    language: "en",
    voiceEnabled: true,
    activeChats: 1,
    lastUsed: "1 day ago",
  },
  {
    id: 3,
    name: "ডেটা বিশেষজ্ঞ",
    description: "Data science expert who speaks Bengali",
    expertise: "Data Science",
    model: "phi",
    language: "bn",
    voiceEnabled: true,
    activeChats: 0,
    lastUsed: "3 days ago",
  },
  {
    id: 4,
    name: "ProjectManager",
    description: "Agile project manager for development teams",
    expertise: "Project Management",
    model: "gemma",
    language: "en",
    voiceEnabled: false,
    activeChats: 2,
    lastUsed: "5 hours ago",
  },
]

export function CharacterList() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Your Characters
        </CardTitle>
        <CardDescription>Manage your custom AI characters</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {characters.map((character) => (
            <div key={character.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 text-blue-800 rounded-full w-10 h-10 flex items-center justify-center">
                    <Brain className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{character.name}</h3>
                    <p className="text-sm text-slate-600">{character.description}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="outline">{character.expertise}</Badge>
                <Badge variant="secondary">{character.model}</Badge>
                <Badge variant={character.language === "bn" ? "default" : "outline"}>
                  {character.language === "bn" ? "বাংলা" : "English"}
                </Badge>
                {character.voiceEnabled && (
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    Voice
                  </Badge>
                )}
              </div>

              <div className="flex items-center justify-between text-sm text-slate-600 mb-3">
                <span>Active chats: {character.activeChats}</span>
                <span>Last used: {character.lastUsed}</span>
              </div>

              <div className="flex gap-2">
                <Button size="sm" className="flex-1">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Chat
                </Button>
                <Button variant="outline" size="sm">
                  <Play className="h-4 w-4 mr-2" />
                  Test
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

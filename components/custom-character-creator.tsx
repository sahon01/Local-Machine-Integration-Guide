"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { VoiceInputField } from "@/components/voice-input-field"
import { useVoice } from "@/components/voice-provider"
import { Save, Play, Brain, User } from "lucide-react"

export function CustomCharacterCreator() {
  const [characterData, setCharacterData] = useState({
    name: "",
    description: "",
    personality: "",
    expertise: "",
    language: "en",
    voiceEnabled: true,
    model: "mistral",
    systemPrompt: "",
    projectType: "",
    codeStyle: "",
    responseStyle: "professional",
  })

  const { speak } = useVoice()

  const handleSave = () => {
    // Save character logic here
    console.log("Saving character:", characterData)
    speak(`Character ${characterData.name} has been created successfully`, characterData.language as "en" | "bn")
  }

  const handleTest = () => {
    const testMessage = `Hello, I am ${characterData.name}. ${characterData.description}`
    speak(testMessage, characterData.language as "en" | "bn")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Create Custom Character
        </CardTitle>
        <CardDescription>Design an AI character with specific personality and expertise</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="personality">Personality</TabsTrigger>
            <TabsTrigger value="technical">Technical</TabsTrigger>
            <TabsTrigger value="voice">Voice & Style</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <div>
              <Label htmlFor="name">Character Name</Label>
              <VoiceInputField
                value={characterData.name}
                onChange={(value) => setCharacterData((prev) => ({ ...prev, name: value }))}
                placeholder="Enter character name..."
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <VoiceInputField
                value={characterData.description}
                onChange={(value) => setCharacterData((prev) => ({ ...prev, description: value }))}
                placeholder="Describe your character's role and purpose..."
                multiline
              />
            </div>

            <div>
              <Label htmlFor="expertise">Area of Expertise</Label>
              <Select
                value={characterData.expertise}
                onValueChange={(value) => setCharacterData((prev) => ({ ...prev, expertise: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select expertise area" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="web-development">Web Development</SelectItem>
                  <SelectItem value="mobile-development">Mobile Development</SelectItem>
                  <SelectItem value="data-science">Data Science</SelectItem>
                  <SelectItem value="devops">DevOps</SelectItem>
                  <SelectItem value="ui-ux">UI/UX Design</SelectItem>
                  <SelectItem value="project-management">Project Management</SelectItem>
                  <SelectItem value="business-analysis">Business Analysis</SelectItem>
                  <SelectItem value="general">General Assistant</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="project-type">Project Type</Label>
              <Select
                value={characterData.projectType}
                onValueChange={(value) => setCharacterData((prev) => ({ ...prev, projectType: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select project type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="react">React Application</SelectItem>
                  <SelectItem value="nextjs">Next.js Project</SelectItem>
                  <SelectItem value="nodejs">Node.js Backend</SelectItem>
                  <SelectItem value="python">Python Project</SelectItem>
                  <SelectItem value="mobile">Mobile App</SelectItem>
                  <SelectItem value="api">API Development</SelectItem>
                  <SelectItem value="database">Database Project</SelectItem>
                  <SelectItem value="general">General Project</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          <TabsContent value="personality" className="space-y-4">
            <div>
              <Label htmlFor="personality">Personality Traits</Label>
              <VoiceInputField
                value={characterData.personality}
                onChange={(value) => setCharacterData((prev) => ({ ...prev, personality: value }))}
                placeholder="Describe personality traits (e.g., helpful, patient, detail-oriented)..."
                multiline
              />
            </div>

            <div>
              <Label htmlFor="response-style">Response Style</Label>
              <Select
                value={characterData.responseStyle}
                onValueChange={(value) => setCharacterData((prev) => ({ ...prev, responseStyle: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select response style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="casual">Casual & Friendly</SelectItem>
                  <SelectItem value="technical">Technical & Detailed</SelectItem>
                  <SelectItem value="mentor">Mentor & Supportive</SelectItem>
                  <SelectItem value="creative">Creative & Innovative</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="system-prompt">System Prompt</Label>
              <VoiceInputField
                value={characterData.systemPrompt}
                onChange={(value) => setCharacterData((prev) => ({ ...prev, systemPrompt: value }))}
                placeholder="Enter the system prompt that defines how this character should behave..."
                multiline
              />
            </div>
          </TabsContent>

          <TabsContent value="technical" className="space-y-4">
            <div>
              <Label htmlFor="model">AI Model</Label>
              <Select
                value={characterData.model}
                onValueChange={(value) => setCharacterData((prev) => ({ ...prev, model: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select AI model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mistral">Mistral (Code Analysis)</SelectItem>
                  <SelectItem value="deepseek">DeepSeek (Code Generation)</SelectItem>
                  <SelectItem value="phi">Phi (General Purpose)</SelectItem>
                  <SelectItem value="gemma">Gemma (Documentation)</SelectItem>
                  <SelectItem value="tinyllama">TinyLlama (Quick Tasks)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="code-style">Preferred Code Style</Label>
              <VoiceInputField
                value={characterData.codeStyle}
                onChange={(value) => setCharacterData((prev) => ({ ...prev, codeStyle: value }))}
                placeholder="Describe preferred coding style and conventions..."
                multiline
              />
            </div>

            <div className="space-y-2">
              <Label>Technical Capabilities</Label>
              <div className="flex flex-wrap gap-2">
                {["Code Review", "Bug Fixing", "Architecture Design", "Testing", "Documentation", "Optimization"].map(
                  (capability) => (
                    <Badge key={capability} variant="outline" className="cursor-pointer hover:bg-blue-100">
                      {capability}
                    </Badge>
                  ),
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="voice" className="space-y-4">
            <div>
              <Label htmlFor="language">Primary Language</Label>
              <Select
                value={characterData.language}
                onValueChange={(value) => setCharacterData((prev) => ({ ...prev, language: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="bn">Bengali (বাংলা)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="voice-enabled"
                checked={characterData.voiceEnabled}
                onChange={(e) => setCharacterData((prev) => ({ ...prev, voiceEnabled: e.target.checked }))}
                className="rounded"
              />
              <Label htmlFor="voice-enabled">Enable Voice Responses</Label>
            </div>

            <div className="space-y-2">
              <Label>Voice Characteristics</Label>
              <div className="flex flex-wrap gap-2">
                {["Clear", "Friendly", "Professional", "Calm", "Enthusiastic", "Patient"].map((trait) => (
                  <Badge key={trait} variant="outline" className="cursor-pointer hover:bg-green-100">
                    {trait}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={handleTest} className="flex-1 bg-transparent">
                <Play className="h-4 w-4 mr-2" />
                Test Voice
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex gap-2 mt-6">
          <Button onClick={handleSave} className="flex-1">
            <Save className="h-4 w-4 mr-2" />
            Save Character
          </Button>
          <Button variant="outline" onClick={handleTest}>
            <Brain className="h-4 w-4 mr-2" />
            Test Character
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

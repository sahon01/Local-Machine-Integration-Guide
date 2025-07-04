import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Users, MessageSquare, Brain, Mic } from "lucide-react"
import { CustomCharacterCreator } from "@/components/custom-character-creator"
import { CharacterList } from "@/components/character-list"

export default function CustomCharactersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Custom Characters</h1>
            <p className="text-slate-600">Create and manage AI characters for different projects and conversations</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Character
          </Button>
        </div>

        {/* Character Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Characters</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Active Chats</p>
                  <p className="text-2xl font-bold">5</p>
                </div>
                <MessageSquare className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Project Characters</p>
                  <p className="text-2xl font-bold">8</p>
                </div>
                <Brain className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Voice Enabled</p>
                  <p className="text-2xl font-bold">7</p>
                </div>
                <Mic className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Character Creator */}
          <div className="lg:col-span-2">
            <CustomCharacterCreator />
          </div>

          {/* Character List */}
          <div>
            <CharacterList />
          </div>
        </div>
      </div>
    </div>
  )
}

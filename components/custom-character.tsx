"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { User, Settings, Save, Download, Sparkles } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface Character {
  id: string
  name: string
  description: string
  personality: string
  appearance: {
    hairColor: string
    eyeColor: string
    skinTone: string
    height: number
    build: string
  }
  traits: string[]
  skills: string[]
  backstory: string
  isActive: boolean
}

export function CustomCharacter() {
  const [characters, setCharacters] = useState<Character[]>([
    {
      id: "1",
      name: "আলিয়া",
      description: "একজন দক্ষ প্রোগ্রামার এবং AI বিশেষজ্ঞ",
      personality: "বুদ্ধিমান, সাহায্যকারী, ধৈর্যশীল",
      appearance: {
        hairColor: "কালো",
        eyeColor: "বাদামী",
        skinTone: "গমের রং",
        height: 165,
        build: "মাঝারি",
      },
      traits: ["বিশ্লেষণী", "সৃজনশীল", "নির্ভরযোগ্য"],
      skills: ["প্রোগ্রামিং", "AI/ML", "সমস্যা সমাধান"],
      backstory: "কম্পিউটার সায়েন্সে স্নাতক, AI গবেষণায় আগ্রহী",
      isActive: true,
    },
  ])

  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(characters[0] || null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(null)

  const [newCharacter, setNewCharacter] = useState({
    name: "",
    description: "",
    personality: "",
    hairColor: "",
    eyeColor: "",
    skinTone: "",
    height: 170,
    build: "",
    traits: "",
    skills: "",
    backstory: "",
  })

  const createCharacter = () => {
    if (!newCharacter.name.trim()) {
      toast({
        title: "ত্রুটি!",
        description: "ক্যারেক্টারের নাম দিন।",
        variant: "destructive",
      })
      return
    }

    const character: Character = {
      id: Date.now().toString(),
      name: newCharacter.name,
      description: newCharacter.description,
      personality: newCharacter.personality,
      appearance: {
        hairColor: newCharacter.hairColor,
        eyeColor: newCharacter.eyeColor,
        skinTone: newCharacter.skinTone,
        height: newCharacter.height,
        build: newCharacter.build,
      },
      traits: newCharacter.traits
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t),
      skills: newCharacter.skills
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s),
      backstory: newCharacter.backstory,
      isActive: false,
    }

    setCharacters((prev) => [...prev, character])
    setSelectedCharacter(character)
    setNewCharacter({
      name: "",
      description: "",
      personality: "",
      hairColor: "",
      eyeColor: "",
      skinTone: "",
      height: 170,
      build: "",
      traits: "",
      skills: "",
      backstory: "",
    })
    setShowCreateForm(false)

    toast({
      title: "ক্যারেক্টার তৈরি হয়েছে! ✅",
      description: `"${character.name}" সফলভাবে তৈরি হয়েছে।`,
    })
  }

  const toggleCharacterActive = (characterId: string) => {
    setCharacters((prev) =>
      prev.map((char) => ({
        ...char,
        isActive: char.id === characterId ? !char.isActive : char.isActive,
      })),
    )

    if (selectedCharacter?.id === characterId) {
      setSelectedCharacter((prev) => (prev ? { ...prev, isActive: !prev.isActive } : null))
    }
  }

  const exportCharacter = (character: Character) => {
    const dataStr = JSON.stringify(character, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${character.name}-character.json`
    link.click()
    URL.revokeObjectURL(url)

    toast({
      title: "ক্যারেক্টার এক্সপোর্ট হয়েছে! 📥",
      description: `"${character.name}" ডাউনলোড হয়েছে।`,
    })
  }

  const generateRandomCharacter = () => {
    const names = ["রহিম", "করিম", "ফাতিমা", "আয়েশা", "আলী", "হাসান", "জারিন", "তানিয়া"]
    const personalities = ["বন্ধুত্বপূর্ণ", "গুরুগম্ভীর", "হাস্যরসিক", "বুদ্ধিমান", "সাহসী", "দয়ালু"]
    const hairColors = ["কালো", "বাদামী", "গাঢ় বাদামী"]
    const eyeColors = ["কালো", "বাদামী", "হ্যাজেল"]
    const skinTones = ["ফর্সা", "গমের রং", "শ্যামলা"]
    const builds = ["পাতলা", "মাঝারি", "স্বাস্থ্যবান"]

    const randomName = names[Math.floor(Math.random() * names.length)]
    const randomPersonality = personalities[Math.floor(Math.random() * personalities.length)]

    setNewCharacter({
      name: randomName,
      description: `একজন ${randomPersonality} ব্যক্তিত্বের অধিকারী`,
      personality: randomPersonality,
      hairColor: hairColors[Math.floor(Math.random() * hairColors.length)],
      eyeColor: eyeColors[Math.floor(Math.random() * eyeColors.length)],
      skinTone: skinTones[Math.floor(Math.random() * skinTones.length)],
      height: Math.floor(Math.random() * 30) + 150, // 150-180
      build: builds[Math.floor(Math.random() * builds.length)],
      traits: "বন্ধুত্বপূর্ণ, সহায়ক",
      skills: "যোগাযোগ, সমস্যা সমাধান",
      backstory: "একজন আগ্রহী এবং শিক্ষার্থী ব্যক্তি",
    })

    toast({
      title: "র‍্যান্ডম ক্যারেক্টার জেনারেট হয়েছে! 🎲",
      description: "নতুন ক্যারেক্টার তৈরি করা হয়েছে।",
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">কাস্টম ক্যারেক্টার</h2>
          <p className="text-gray-600">আপনার নিজস্ব ক্যারেক্টার তৈরি এবং কাস্টমাইজ করুন</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={generateRandomCharacter} variant="outline">
            <Sparkles className="h-4 w-4 mr-2" />
            র‍্যান্ডম জেনারেট
          </Button>
          <Button onClick={() => setShowCreateForm(true)} className="bg-blue-600 hover:bg-blue-700">
            <User className="h-4 w-4 mr-2" />
            নতুন ক্যারেক্টার
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Character List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              ক্যারেক্টার তালিকা
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {characters.map((character) => (
                <div
                  key={character.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedCharacter?.id === character.id
                      ? "bg-blue-100 border-2 border-blue-300"
                      : "bg-gray-50 hover:bg-gray-100"
                  }`}
                  onClick={() => setSelectedCharacter(character)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm">{character.name}</div>
                      <div className="text-xs text-gray-600 mt-1">{character.description}</div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {character.isActive && (
                        <Badge className="bg-green-100 text-green-800" variant="outline">
                          সক্রিয়
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {characters.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <User className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">কোন ক্যারেক্টার নেই</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Character Details */}
        <div className="lg:col-span-3">
          {selectedCharacter ? (
            <div className="space-y-6">
              {/* Character Overview */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        {selectedCharacter.name}
                      </CardTitle>
                      <p className="text-gray-600 mt-1">{selectedCharacter.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => exportCharacter(selectedCharacter)}>
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setEditingCharacter(selectedCharacter)}>
                        <Settings className="h-4 w-4" />
                      </Button>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={selectedCharacter.isActive}
                          onCheckedChange={() => toggleCharacterActive(selectedCharacter.id)}
                        />
                        <span className="text-sm">সক্রিয়</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Basic Info */}
                    <div>
                      <h4 className="font-semibold mb-3">মৌলিক তথ্য</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">ব্যক্তিত্ব:</span>
                          <span>{selectedCharacter.personality}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">উচ্চতা:</span>
                          <span>{selectedCharacter.appearance.height} সেমি</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">গড়ন:</span>
                          <span>{selectedCharacter.appearance.build}</span>
                        </div>
                      </div>
                    </div>

                    {/* Appearance */}
                    <div>
                      <h4 className="font-semibold mb-3">চেহারা</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">চুলের রং:</span>
                          <span>{selectedCharacter.appearance.hairColor}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">চোখের রং:</span>
                          <span>{selectedCharacter.appearance.eyeColor}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">ত্বকের রং:</span>
                          <span>{selectedCharacter.appearance.skinTone}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Traits and Skills */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">বৈশিষ্ট্য</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {selectedCharacter.traits.map((trait, index) => (
                        <Badge key={index} variant="outline" className="bg-blue-50 text-blue-800">
                          {trait}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">দক্ষতা</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {selectedCharacter.skills.map((skill, index) => (
                        <Badge key={index} variant="outline" className="bg-green-50 text-green-800">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Backstory */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">পটভূমি</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">{selectedCharacter.backstory}</p>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">কোন ক্যারেক্টার নির্বাচিত নয়</h3>
                <p className="text-gray-500">একটি ক্যারেক্টার নির্বাচন করুন বা নতুন তৈরি করুন</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Create Character Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>নতুন ক্যারেক্টার তৈরি করুন</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="নাম"
                  value={newCharacter.name}
                  onChange={(e) => setNewCharacter((prev) => ({ ...prev, name: e.target.value }))}
                />
                <Input
                  placeholder="ব্যক্তিত্ব"
                  value={newCharacter.personality}
                  onChange={(e) => setNewCharacter((prev) => ({ ...prev, personality: e.target.value }))}
                />
              </div>

              <Textarea
                placeholder="বিবরণ"
                value={newCharacter.description}
                onChange={(e) => setNewCharacter((prev) => ({ ...prev, description: e.target.value }))}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  placeholder="চুলের রং"
                  value={newCharacter.hairColor}
                  onChange={(e) => setNewCharacter((prev) => ({ ...prev, hairColor: e.target.value }))}
                />
                <Input
                  placeholder="চোখের রং"
                  value={newCharacter.eyeColor}
                  onChange={(e) => setNewCharacter((prev) => ({ ...prev, eyeColor: e.target.value }))}
                />
                <Input
                  placeholder="ত্বকের রং"
                  value={newCharacter.skinTone}
                  onChange={(e) => setNewCharacter((prev) => ({ ...prev, skinTone: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">উচ্চতা: {newCharacter.height} সেমি</label>
                  <Slider
                    value={[newCharacter.height]}
                    onValueChange={(value) => setNewCharacter((prev) => ({ ...prev, height: value[0] }))}
                    max={200}
                    min={140}
                    step={1}
                  />
                </div>
                <Input
                  placeholder="গড়ন"
                  value={newCharacter.build}
                  onChange={(e) => setNewCharacter((prev) => ({ ...prev, build: e.target.value }))}
                />
              </div>

              <Input
                placeholder="বৈশিষ্ট্য (কমা দিয়ে আলাদা করুন)"
                value={newCharacter.traits}
                onChange={(e) => setNewCharacter((prev) => ({ ...prev, traits: e.target.value }))}
              />

              <Input
                placeholder="দক্ষতা (কমা দিয়ে আলাদা করুন)"
                value={newCharacter.skills}
                onChange={(e) => setNewCharacter((prev) => ({ ...prev, skills: e.target.value }))}
              />

              <Textarea
                placeholder="পটভূমি"
                value={newCharacter.backstory}
                onChange={(e) => setNewCharacter((prev) => ({ ...prev, backstory: e.target.value }))}
              />

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                  বাতিল
                </Button>
                <Button onClick={createCharacter}>
                  <Save className="h-4 w-4 mr-2" />
                  তৈরি করুন
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

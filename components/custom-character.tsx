"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { User, Palette, Save, Eye, Shirt, Heart, Star } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface Character {
  id: string
  name: string
  description: string
  appearance: {
    skinColor: string
    hairColor: string
    eyeColor: string
    height: number
    build: "slim" | "average" | "muscular"
  }
  personality: {
    traits: string[]
    mood: string
    energy: number
    friendliness: number
  }
  clothing: {
    style: string
    colors: string[]
    accessories: string[]
  }
  background: {
    occupation: string
    hobbies: string[]
    backstory: string
  }
}

export function CustomCharacter() {
  const [characters, setCharacters] = useState<Character[]>([])
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)

  const [newCharacter, setNewCharacter] = useState<Partial<Character>>({
    name: "",
    description: "",
    appearance: {
      skinColor: "#F4C2A1",
      hairColor: "#8B4513",
      eyeColor: "#654321",
      height: 170,
      build: "average",
    },
    personality: {
      traits: [],
      mood: "খুশি",
      energy: 50,
      friendliness: 50,
    },
    clothing: {
      style: "ক্যাজুয়াল",
      colors: ["#0066CC", "#FFFFFF"],
      accessories: [],
    },
    background: {
      occupation: "",
      hobbies: [],
      backstory: "",
    },
  })

  const personalityTraits = [
    "বন্ধুত্বপূর্ণ",
    "বুদ্ধিমান",
    "সৃজনশীল",
    "সাহসী",
    "দয়ালু",
    "হাস্যরসিক",
    "ধৈর্যশীল",
    "উৎসাহী",
    "নির্ভরযোগ্য",
    "অভিযানপ্রিয়",
  ]

  const clothingStyles = ["ক্যাজুয়াল", "ফর্মাল", "ঐতিহ্যবাহী", "আধুনিক", "স্পোর্টস", "আর্টিস্টিক"]

  const accessories = ["চশমা", "টুপি", "গহনা", "ঘড়ি", "ব্যাগ", "স্কার্ফ", "বেল্ট"]

  const hobbies = [
    "পড়া",
    "লেখা",
    "গান",
    "নাচ",
    "রান্না",
    "ভ্রমণ",
    "ফটোগ্রাফি",
    "খেলাধুলা",
    "গার্ডেনিং",
    "পেইন্টিং",
    "প্রোগ্রামিং",
    "সিনেমা দেখা",
  ]

  const createCharacter = () => {
    if (!newCharacter.name?.trim()) {
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
      description: newCharacter.description || "",
      appearance: newCharacter.appearance!,
      personality: newCharacter.personality!,
      clothing: newCharacter.clothing!,
      background: newCharacter.background!,
    }

    setCharacters((prev) => [...prev, character])
    setSelectedCharacter(character)
    setShowCreateForm(false)

    // Reset form
    setNewCharacter({
      name: "",
      description: "",
      appearance: {
        skinColor: "#F4C2A1",
        hairColor: "#8B4513",
        eyeColor: "#654321",
        height: 170,
        build: "average",
      },
      personality: {
        traits: [],
        mood: "খুশি",
        energy: 50,
        friendliness: 50,
      },
      clothing: {
        style: "ক্যাজুয়াল",
        colors: ["#0066CC", "#FFFFFF"],
        accessories: [],
      },
      background: {
        occupation: "",
        hobbies: [],
        backstory: "",
      },
    })

    toast({
      title: "ক্যারেক্টার তৈরি হয়েছে! ✅",
      description: `"${character.name}" সফলভাবে তৈরি হয়েছে।`,
    })
  }

  const saveCharacter = () => {
    if (selectedCharacter) {
      const dataStr = JSON.stringify(selectedCharacter, null, 2)
      const dataBlob = new Blob([dataStr], { type: "application/json" })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement("a")
      link.href = url
      link.download = `${selectedCharacter.name}-character.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      toast({
        title: "ক্যারেক্টার সেভ হয়েছে! 💾",
        description: "ক্যারেক্টার ফাইল ডাউনলোড হয়েছে।",
      })
    }
  }

  const toggleTrait = (trait: string) => {
    setNewCharacter((prev) => ({
      ...prev,
      personality: {
        ...prev.personality!,
        traits: prev.personality!.traits.includes(trait)
          ? prev.personality!.traits.filter((t) => t !== trait)
          : [...prev.personality!.traits, trait],
      },
    }))
  }

  const toggleAccessory = (accessory: string) => {
    setNewCharacter((prev) => ({
      ...prev,
      clothing: {
        ...prev.clothing!,
        accessories: prev.clothing!.accessories.includes(accessory)
          ? prev.clothing!.accessories.filter((a) => a !== accessory)
          : [...prev.clothing!.accessories, accessory],
      },
    }))
  }

  const toggleHobby = (hobby: string) => {
    setNewCharacter((prev) => ({
      ...prev,
      background: {
        ...prev.background!,
        hobbies: prev.background!.hobbies.includes(hobby)
          ? prev.background!.hobbies.filter((h) => h !== hobby)
          : [...prev.background!.hobbies, hobby],
      },
    }))
  }

  const CharacterPreview = ({ character }: { character: Character }) => (
    <div className="space-y-4">
      {/* Character Avatar */}
      <div className="text-center">
        <div
          className="w-32 h-32 mx-auto rounded-full flex items-center justify-center text-6xl"
          style={{ backgroundColor: character.appearance.skinColor }}
        >
          <User className="h-16 w-16" style={{ color: character.appearance.hairColor }} />
        </div>
        <h3 className="text-xl font-bold mt-2">{character.name}</h3>
        <p className="text-gray-600">{character.description}</p>
      </div>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">চেহারা</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>উচ্চতা:</span>
            <span>{character.appearance.height} সেমি</span>
          </div>
          <div className="flex justify-between">
            <span>গড়ন:</span>
            <span>
              {character.appearance.build === "slim"
                ? "চিকন"
                : character.appearance.build === "average"
                  ? "স্বাভাবিক"
                  : "পেশীবহুল"}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span>চামড়ার রং:</span>
            <div className="w-6 h-6 rounded-full border" style={{ backgroundColor: character.appearance.skinColor }} />
          </div>
          <div className="flex justify-between items-center">
            <span>চুলের রং:</span>
            <div className="w-6 h-6 rounded-full border" style={{ backgroundColor: character.appearance.hairColor }} />
          </div>
          <div className="flex justify-between items-center">
            <span>চোখের রং:</span>
            <div className="w-6 h-6 rounded-full border" style={{ backgroundColor: character.appearance.eyeColor }} />
          </div>
        </CardContent>
      </Card>

      {/* Personality */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">ব্যক্তিত্ব</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <span className="text-sm font-medium">বৈশিষ্ট্য:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {character.personality.traits.map((trait) => (
                <Badge key={trait} variant="outline" className="text-xs">
                  {trait}
                </Badge>
              ))}
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>মেজাজ:</span>
              <span>{character.personality.mood}</span>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span>শক্তি:</span>
                <span>{character.personality.energy}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${character.personality.energy}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span>বন্ধুত্ব:</span>
                <span>{character.personality.friendliness}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: `${character.personality.friendliness}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Clothing */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">পোশাক</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>স্টাইল:</span>
            <span>{character.clothing.style}</span>
          </div>
          <div>
            <span>রং:</span>
            <div className="flex gap-1 mt-1">
              {character.clothing.colors.map((color, index) => (
                <div key={index} className="w-4 h-4 rounded border" style={{ backgroundColor: color }} />
              ))}
            </div>
          </div>
          <div>
            <span>আনুষাঙ্গিক:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {character.clothing.accessories.map((accessory) => (
                <Badge key={accessory} variant="outline" className="text-xs">
                  {accessory}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Background */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">পটভূমি</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>পেশা:</span>
            <span>{character.background.occupation || "অনির্ধারিত"}</span>
          </div>
          <div>
            <span>শখ:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {character.background.hobbies.map((hobby) => (
                <Badge key={hobby} variant="outline" className="text-xs">
                  {hobby}
                </Badge>
              ))}
            </div>
          </div>
          {character.background.backstory && (
            <div>
              <span>জীবনী:</span>
              <p className="text-xs text-gray-600 mt-1">{character.background.backstory}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">কাস্টম ক্যারেক্টার</h2>
          <p className="text-gray-600">আপনার নিজস্ব ক্যারেক্টার তৈরি এবং কাস্টমাইজ করুন</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowCreateForm(true)} className="bg-blue-600 hover:bg-blue-700">
            <User className="h-4 w-4 mr-2" />
            নতুন ক্যারেক্টার
          </Button>
          {selectedCharacter && (
            <>
              <Button onClick={() => setPreviewMode(!previewMode)} variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                {previewMode ? "সম্পাদনা" : "প্রিভিউ"}
              </Button>
              <Button onClick={saveCharacter} variant="outline">
                <Save className="h-4 w-4 mr-2" />
                সেভ
              </Button>
            </>
          )}
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
            <div className="space-y-2">
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
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: character.appearance.skinColor }}
                    >
                      <User className="h-4 w-4" style={{ color: character.appearance.hairColor }} />
                    </div>
                    <div>
                      <div className="font-medium text-sm">{character.name}</div>
                      <div className="text-xs text-gray-500">{character.background.occupation}</div>
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

        {/* Main Content */}
        <div className="lg:col-span-3">
          {selectedCharacter ? (
            previewMode ? (
              <CharacterPreview character={selectedCharacter} />
            ) : (
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>ক্যারেক্টার সম্পাদনা: {selectedCharacter.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">এখানে ক্যারেক্টার সম্পাদনার ফিচার যোগ করা হবে।</p>
                  </CardContent>
                </Card>
              </div>
            )
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">কোন ক্যারেক্টার নির্বাচিত নয়</h3>
                <p className="text-gray-500 mb-4">একটি ক্যারেক্টার নির্বাচন করুন বা নতুন তৈরি করুন</p>
                <Button onClick={() => setShowCreateForm(true)}>
                  <User className="h-4 w-4 mr-2" />
                  নতুন ক্যারেক্টার তৈরি করুন
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Create Character Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">নতুন ক্যারেক্টার তৈরি করুন</h2>
                <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                  বন্ধ করুন
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Form */}
                <div className="space-y-6">
                  {/* Basic Info */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">মৌলিক তথ্য</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Input
                        placeholder="ক্যারেক্টারের নাম"
                        value={newCharacter.name}
                        onChange={(e) => setNewCharacter((prev) => ({ ...prev, name: e.target.value }))}
                      />
                      <Textarea
                        placeholder="বিবরণ"
                        value={newCharacter.description}
                        onChange={(e) => setNewCharacter((prev) => ({ ...prev, description: e.target.value }))}
                      />
                    </CardContent>
                  </Card>

                  {/* Appearance */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Palette className="h-4 w-4" />
                        চেহারা
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="text-xs font-medium">চামড়ার রং</label>
                          <input
                            type="color"
                            value={newCharacter.appearance?.skinColor}
                            onChange={(e) =>
                              setNewCharacter((prev) => ({
                                ...prev,
                                appearance: { ...prev.appearance!, skinColor: e.target.value },
                              }))
                            }
                            className="w-full h-8 rounded border"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium">চুলের রং</label>
                          <input
                            type="color"
                            value={newCharacter.appearance?.hairColor}
                            onChange={(e) =>
                              setNewCharacter((prev) => ({
                                ...prev,
                                appearance: { ...prev.appearance!, hairColor: e.target.value },
                              }))
                            }
                            className="w-full h-8 rounded border"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium">চোখের রং</label>
                          <input
                            type="color"
                            value={newCharacter.appearance?.eyeColor}
                            onChange={(e) =>
                              setNewCharacter((prev) => ({
                                ...prev,
                                appearance: { ...prev.appearance!, eyeColor: e.target.value },
                              }))
                            }
                            className="w-full h-8 rounded border"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-medium">উচ্চতা: {newCharacter.appearance?.height} সেমি</label>
                        <Slider
                          value={[newCharacter.appearance?.height || 170]}
                          onValueChange={(value) =>
                            setNewCharacter((prev) => ({
                              ...prev,
                              appearance: { ...prev.appearance!, height: value[0] },
                            }))
                          }
                          min={140}
                          max={200}
                          step={1}
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-medium">গড়ন</label>
                        <select
                          value={newCharacter.appearance?.build}
                          onChange={(e) =>
                            setNewCharacter((prev) => ({
                              ...prev,
                              appearance: { ...prev.appearance!, build: e.target.value as any },
                            }))
                          }
                          className="w-full p-2 border rounded mt-1"
                        >
                          <option value="slim">চিকন</option>
                          <option value="average">স্বাভাবিক</option>
                          <option value="muscular">পেশীবহুল</option>
                        </select>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Personality */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Heart className="h-4 w-4" />
                        ব্যক্তিত্ব
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-xs font-medium">বৈশিষ্ট্য</label>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {personalityTraits.map((trait) => (
                            <Badge
                              key={trait}
                              variant={newCharacter.personality?.traits.includes(trait) ? "default" : "outline"}
                              className="cursor-pointer text-xs"
                              onClick={() => toggleTrait(trait)}
                            >
                              {trait}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <Input
                        placeholder="মেজাজ (যেমন: খুশি, শান্ত, উৎসাহী)"
                        value={newCharacter.personality?.mood}
                        onChange={(e) =>
                          setNewCharacter((prev) => ({
                            ...prev,
                            personality: { ...prev.personality!, mood: e.target.value },
                          }))
                        }
                      />

                      <div>
                        <label className="text-xs font-medium">শক্তি: {newCharacter.personality?.energy}%</label>
                        <Slider
                          value={[newCharacter.personality?.energy || 50]}
                          onValueChange={(value) =>
                            setNewCharacter((prev) => ({
                              ...prev,
                              personality: { ...prev.personality!, energy: value[0] },
                            }))
                          }
                          min={0}
                          max={100}
                          step={1}
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-medium">বন্ধুত্ব: {newCharacter.personality?.friendliness}%</label>
                        <Slider
                          value={[newCharacter.personality?.friendliness || 50]}
                          onValueChange={(value) =>
                            setNewCharacter((prev) => ({
                              ...prev,
                              personality: { ...prev.personality!, friendliness: value[0] },
                            }))
                          }
                          min={0}
                          max={100}
                          step={1}
                          className="mt-2"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Clothing */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Shirt className="h-4 w-4" />
                        পোশাক
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <select
                        value={newCharacter.clothing?.style}
                        onChange={(e) =>
                          setNewCharacter((prev) => ({
                            ...prev,
                            clothing: { ...prev.clothing!, style: e.target.value },
                          }))
                        }
                        className="w-full p-2 border rounded"
                      >
                        {clothingStyles.map((style) => (
                          <option key={style} value={style}>
                            {style}
                          </option>
                        ))}
                      </select>

                      <div>
                        <label className="text-xs font-medium">আনুষাঙ্গিক</label>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {accessories.map((accessory) => (
                            <Badge
                              key={accessory}
                              variant={newCharacter.clothing?.accessories.includes(accessory) ? "default" : "outline"}
                              className="cursor-pointer text-xs"
                              onClick={() => toggleAccessory(accessory)}
                            >
                              {accessory}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Background */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Star className="h-4 w-4" />
                        পটভূমি
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Input
                        placeholder="পেশা"
                        value={newCharacter.background?.occupation}
                        onChange={(e) =>
                          setNewCharacter((prev) => ({
                            ...prev,
                            background: { ...prev.background!, occupation: e.target.value },
                          }))
                        }
                      />

                      <div>
                        <label className="text-xs font-medium">শখ</label>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {hobbies.map((hobby) => (
                            <Badge
                              key={hobby}
                              variant={newCharacter.background?.hobbies.includes(hobby) ? "default" : "outline"}
                              className="cursor-pointer text-xs"
                              onClick={() => toggleHobby(hobby)}
                            >
                              {hobby}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <Textarea
                        placeholder="জীবনী/পটভূমি"
                        value={newCharacter.background?.backstory}
                        onChange={(e) =>
                          setNewCharacter((prev) => ({
                            ...prev,
                            background: { ...prev.background!, backstory: e.target.value },
                          }))
                        }
                      />
                    </CardContent>
                  </Card>
                </div>

                {/* Preview */}
                <div className="lg:sticky lg:top-0">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">প্রিভিউ</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {newCharacter.name && <CharacterPreview character={newCharacter as Character} />}
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="flex gap-2 justify-end mt-6">
                <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                  বাতিল
                </Button>
                <Button onClick={createCharacter}>ক্যারেক্টার তৈরি করুন</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

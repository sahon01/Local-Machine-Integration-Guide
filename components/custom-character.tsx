"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { User, Palette, BookOpen, Trash2 } from "lucide-react"

interface Character {
  id: string
  name: string
  age: number
  gender: string
  appearance: {
    height: string
    build: string
    skinTone: string
    hairColor: string
    hairStyle: string
    eyeColor: string
    facialFeatures: string[]
  }
  personality: {
    traits: string[]
    likes: string[]
    dislikes: string[]
    fears: string[]
    goals: string[]
  }
  clothing: {
    style: string
    colors: string[]
    accessories: string[]
  }
  background: {
    occupation: string
    origin: string
    education: string
    family: string
    backstory: string
  }
}

export function CustomCharacter() {
  const [characters, setCharacters] = useState<Character[]>([])
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  const [newCharacter, setNewCharacter] = useState<Partial<Character>>({
    name: "",
    age: 25,
    gender: "male",
    appearance: {
      height: "average",
      build: "average",
      skinTone: "",
      hairColor: "",
      hairStyle: "",
      eyeColor: "",
      facialFeatures: [],
    },
    personality: {
      traits: [],
      likes: [],
      dislikes: [],
      fears: [],
      goals: [],
    },
    clothing: {
      style: "",
      colors: [],
      accessories: [],
    },
    background: {
      occupation: "",
      origin: "",
      education: "",
      family: "",
      backstory: "",
    },
  })

  const handleCreateCharacter = () => {
    const character: Character = {
      id: Date.now().toString(),
      name: newCharacter.name || "Unnamed Character",
      age: newCharacter.age || 25,
      gender: newCharacter.gender || "male",
      appearance: newCharacter.appearance || {},
      personality: newCharacter.personality || {},
      clothing: newCharacter.clothing || {},
      background: newCharacter.background || {},
    } as Character

    setCharacters([...characters, character])
    setIsCreating(false)
    setNewCharacter({
      name: "",
      age: 25,
      gender: "male",
      appearance: {
        height: "average",
        build: "average",
        skinTone: "",
        hairColor: "",
        hairStyle: "",
        eyeColor: "",
        facialFeatures: [],
      },
      personality: {
        traits: [],
        likes: [],
        dislikes: [],
        fears: [],
        goals: [],
      },
      clothing: {
        style: "",
        colors: [],
        accessories: [],
      },
      background: {
        occupation: "",
        origin: "",
        education: "",
        family: "",
        backstory: "",
      },
    })
  }

  const handleDeleteCharacter = (id: string) => {
    setCharacters(characters.filter((c) => c.id !== id))
    if (selectedCharacter?.id === id) {
      setSelectedCharacter(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">কাস্টম চরিত্র তৈরি করুন</h2>
          <p className="text-muted-foreground">আপনার নিজস্ব AI চরিত্র ডিজাইন এবং পরিচালনা করুন</p>
        </div>
        <Button onClick={() => setIsCreating(true)}>
          <User className="mr-2 h-4 w-4" />
          নতুন চরিত্র
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Character List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>চরিত্রের তালিকা</CardTitle>
            <CardDescription>{characters.length} টি চরিত্র</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {characters.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">কোন চরিত্র নেই। নতুন তৈরি করুন।</p>
            ) : (
              characters.map((character) => (
                <div
                  key={character.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedCharacter?.id === character.id ? "border-primary bg-primary/5" : "hover:bg-muted"
                  }`}
                  onClick={() => setSelectedCharacter(character)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{character.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {character.age} বছর •{" "}
                        {character.gender === "male" ? "পুরুষ" : character.gender === "female" ? "মহিলা" : "অন্যান্য"}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteCharacter(character.id)
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Character Details or Creation Form */}
        <Card className="lg:col-span-2">
          {isCreating ? (
            <>
              <CardHeader>
                <CardTitle>নতুন চরিত্র তৈরি করুন</CardTitle>
                <CardDescription>সম্পূর্ণ বিবরণ পূরণ করুন</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="basic">মৌলিক</TabsTrigger>
                    <TabsTrigger value="appearance">চেহারা</TabsTrigger>
                    <TabsTrigger value="personality">ব্যক্তিত্ব</TabsTrigger>
                    <TabsTrigger value="background">পটভূমি</TabsTrigger>
                  </TabsList>

                  {/* Basic Info */}
                  <TabsContent value="basic" className="space-y-4">
                    <div>
                      <Label>নাম *</Label>
                      <Input
                        value={newCharacter.name}
                        onChange={(e) => setNewCharacter({ ...newCharacter, name: e.target.value })}
                        placeholder="চরিত্রের নাম"
                      />
                    </div>
                    <div>
                      <Label>বয়স *</Label>
                      <div className="flex items-center gap-4">
                        <Slider
                          value={[newCharacter.age || 25]}
                          onValueChange={([value]) => setNewCharacter({ ...newCharacter, age: value })}
                          min={1}
                          max={100}
                          step={1}
                          className="flex-1"
                        />
                        <span className="w-12 text-center">{newCharacter.age}</span>
                      </div>
                    </div>
                    <div>
                      <Label>লিঙ্গ *</Label>
                      <Select
                        value={newCharacter.gender}
                        onValueChange={(value) => setNewCharacter({ ...newCharacter, gender: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">পুরুষ</SelectItem>
                          <SelectItem value="female">মহিলা</SelectItem>
                          <SelectItem value="other">অন্যান্য</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TabsContent>

                  {/* Appearance */}
                  <TabsContent value="appearance" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>উচ্চতা</Label>
                        <Select
                          value={newCharacter.appearance?.height}
                          onValueChange={(value) =>
                            setNewCharacter({
                              ...newCharacter,
                              appearance: { ...newCharacter.appearance!, height: value },
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="নির্বাচন করুন" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="short">খাটো</SelectItem>
                            <SelectItem value="average">মাঝারি</SelectItem>
                            <SelectItem value="tall">লম্বা</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>গঠন</Label>
                        <Select
                          value={newCharacter.appearance?.build}
                          onValueChange={(value) =>
                            setNewCharacter({
                              ...newCharacter,
                              appearance: { ...newCharacter.appearance!, build: value },
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="নির্বাচন করুন" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="slim">চিকন</SelectItem>
                            <SelectItem value="average">মাঝারি</SelectItem>
                            <SelectItem value="athletic">ক্রীড়াবিদ</SelectItem>
                            <SelectItem value="heavy">ভারী</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label>চুলের রঙ</Label>
                      <Input
                        value={newCharacter.appearance?.hairColor}
                        onChange={(e) =>
                          setNewCharacter({
                            ...newCharacter,
                            appearance: { ...newCharacter.appearance!, hairColor: e.target.value },
                          })
                        }
                        placeholder="যেমন: কালো, বাদামী"
                      />
                    </div>
                    <div>
                      <Label>চুলের ধরন</Label>
                      <Input
                        value={newCharacter.appearance?.hairStyle}
                        onChange={(e) =>
                          setNewCharacter({
                            ...newCharacter,
                            appearance: { ...newCharacter.appearance!, hairStyle: e.target.value },
                          })
                        }
                        placeholder="যেমন: ছোট, লম্বা, কোঁকড়া"
                      />
                    </div>
                    <div>
                      <Label>চোখের রঙ</Label>
                      <Input
                        value={newCharacter.appearance?.eyeColor}
                        onChange={(e) =>
                          setNewCharacter({
                            ...newCharacter,
                            appearance: { ...newCharacter.appearance!, eyeColor: e.target.value },
                          })
                        }
                        placeholder="যেমন: কালো, বাদামী, নীল"
                      />
                    </div>
                  </TabsContent>

                  {/* Personality */}
                  <TabsContent value="personality" className="space-y-4">
                    <div>
                      <Label>ব্যক্তিত্বের বৈশিষ্ট্য</Label>
                      <Textarea
                        placeholder="যেমন: বন্ধুত্বপূর্ণ, বুদ্ধিমান, সাহসী (কমা দিয়ে আলাদা করুন)"
                        value={newCharacter.personality?.traits?.join(", ")}
                        onChange={(e) =>
                          setNewCharacter({
                            ...newCharacter,
                            personality: {
                              ...newCharacter.personality!,
                              traits: e.target.value
                                .split(",")
                                .map((t) => t.trim())
                                .filter(Boolean),
                            },
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label>পছন্দ</Label>
                      <Textarea
                        placeholder="যেমন: বই পড়া, সঙ্গীত, ভ্রমণ"
                        value={newCharacter.personality?.likes?.join(", ")}
                        onChange={(e) =>
                          setNewCharacter({
                            ...newCharacter,
                            personality: {
                              ...newCharacter.personality!,
                              likes: e.target.value
                                .split(",")
                                .map((t) => t.trim())
                                .filter(Boolean),
                            },
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label>অপছন্দ</Label>
                      <Textarea
                        placeholder="যেমন: মিথ্যা, অন্যায়, অসততা"
                        value={newCharacter.personality?.dislikes?.join(", ")}
                        onChange={(e) =>
                          setNewCharacter({
                            ...newCharacter,
                            personality: {
                              ...newCharacter.personality!,
                              dislikes: e.target.value
                                .split(",")
                                .map((t) => t.trim())
                                .filter(Boolean),
                            },
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label>লক্ষ্য</Label>
                      <Textarea
                        placeholder="যেমন: সফল হওয়া, পরিবারকে সাহায্য করা"
                        value={newCharacter.personality?.goals?.join(", ")}
                        onChange={(e) =>
                          setNewCharacter({
                            ...newCharacter,
                            personality: {
                              ...newCharacter.personality!,
                              goals: e.target.value
                                .split(",")
                                .map((t) => t.trim())
                                .filter(Boolean),
                            },
                          })
                        }
                      />
                    </div>
                  </TabsContent>

                  {/* Background */}
                  <TabsContent value="background" className="space-y-4">
                    <div>
                      <Label>পেশা</Label>
                      <Input
                        value={newCharacter.background?.occupation}
                        onChange={(e) =>
                          setNewCharacter({
                            ...newCharacter,
                            background: { ...newCharacter.background!, occupation: e.target.value },
                          })
                        }
                        placeholder="যেমন: শিক্ষক, ডাক্তার, প্রকৌশলী"
                      />
                    </div>
                    <div>
                      <Label>উৎস/জন্মস্থান</Label>
                      <Input
                        value={newCharacter.background?.origin}
                        onChange={(e) =>
                          setNewCharacter({
                            ...newCharacter,
                            background: { ...newCharacter.background!, origin: e.target.value },
                          })
                        }
                        placeholder="যেমন: ঢাকা, চট্টগ্রাম"
                      />
                    </div>
                    <div>
                      <Label>শিক্ষা</Label>
                      <Input
                        value={newCharacter.background?.education}
                        onChange={(e) =>
                          setNewCharacter({
                            ...newCharacter,
                            background: { ...newCharacter.background!, education: e.target.value },
                          })
                        }
                        placeholder="যেমন: স্নাতক, মাস্টার্স"
                      />
                    </div>
                    <div>
                      <Label>পরিবার</Label>
                      <Input
                        value={newCharacter.background?.family}
                        onChange={(e) =>
                          setNewCharacter({
                            ...newCharacter,
                            background: { ...newCharacter.background!, family: e.target.value },
                          })
                        }
                        placeholder="যেমন: বাবা-মা, ভাই-বোন"
                      />
                    </div>
                    <div>
                      <Label>পটভূমি গল্প</Label>
                      <Textarea
                        rows={4}
                        value={newCharacter.background?.backstory}
                        onChange={(e) =>
                          setNewCharacter({
                            ...newCharacter,
                            background: { ...newCharacter.background!, backstory: e.target.value },
                          })
                        }
                        placeholder="চরিত্রের অতীত এবং অভিজ্ঞতা বর্ণনা করুন..."
                      />
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex justify-end gap-2 mt-6">
                  <Button variant="outline" onClick={() => setIsCreating(false)}>
                    বাতিল
                  </Button>
                  <Button onClick={handleCreateCharacter}>চরিত্র তৈরি করুন</Button>
                </div>
              </CardContent>
            </>
          ) : selectedCharacter ? (
            <>
              <CardHeader>
                <CardTitle>{selectedCharacter.name}</CardTitle>
                <CardDescription>
                  {selectedCharacter.age} বছর •{" "}
                  {selectedCharacter.gender === "male"
                    ? "পুরুষ"
                    : selectedCharacter.gender === "female"
                      ? "মহিলা"
                      : "অন্যান্য"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Appearance */}
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Palette className="h-4 w-4" />
                    চেহারা
                  </h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>উচ্চতা: {selectedCharacter.appearance.height || "N/A"}</div>
                    <div>গঠন: {selectedCharacter.appearance.build || "N/A"}</div>
                    <div>চুলের রঙ: {selectedCharacter.appearance.hairColor || "N/A"}</div>
                    <div>চোখের রঙ: {selectedCharacter.appearance.eyeColor || "N/A"}</div>
                  </div>
                </div>

                {/* Personality */}
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    ব্যক্তিত্ব
                  </h3>
                  {selectedCharacter.personality.traits && selectedCharacter.personality.traits.length > 0 && (
                    <div className="mb-2">
                      <p className="text-sm font-medium mb-1">বৈশিষ্ট্য:</p>
                      <div className="flex flex-wrap gap-1">
                        {selectedCharacter.personality.traits.map((trait, i) => (
                          <Badge key={i} variant="secondary">
                            {trait}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {selectedCharacter.personality.likes && selectedCharacter.personality.likes.length > 0 && (
                    <div className="mb-2">
                      <p className="text-sm font-medium mb-1">পছন্দ:</p>
                      <div className="flex flex-wrap gap-1">
                        {selectedCharacter.personality.likes.map((like, i) => (
                          <Badge key={i} variant="outline">
                            {like}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Background */}
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    পটভূমি
                  </h3>
                  <div className="space-y-2 text-sm">
                    {selectedCharacter.background.occupation && (
                      <div>
                        <span className="font-medium">পেশা:</span> {selectedCharacter.background.occupation}
                      </div>
                    )}
                    {selectedCharacter.background.origin && (
                      <div>
                        <span className="font-medium">উৎস:</span> {selectedCharacter.background.origin}
                      </div>
                    )}
                    {selectedCharacter.background.backstory && (
                      <div>
                        <span className="font-medium">গল্প:</span>
                        <p className="mt-1 text-muted-foreground">{selectedCharacter.background.backstory}</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="flex items-center justify-center h-96">
              <div className="text-center text-muted-foreground">
                <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>একটি চরিত্র নির্বাচন করুন বা নতুন তৈরি করুন</p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  )
}

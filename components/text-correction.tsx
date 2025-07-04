"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, AlertCircle, FileText, Zap, Copy, Download } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface CorrectionSuggestion {
  id: string
  type: "grammar" | "spelling" | "style" | "punctuation"
  original: string
  suggestion: string
  explanation: string
  position: { start: number; end: number }
}

export function TextCorrection() {
  const [inputText, setInputText] = useState("")
  const [correctedText, setCorrectedText] = useState("")
  const [suggestions, setSuggestions] = useState<CorrectionSuggestion[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [activeTab, setActiveTab] = useState("input")

  // Mock correction function - in real app, this would call an AI service
  const analyzeText = async () => {
    if (!inputText.trim()) {
      toast({
        title: "ত্রুটি!",
        description: "বিশ্লেষণের জন্য টেক্সট লিখুন।",
        variant: "destructive",
      })
      return
    }

    setIsAnalyzing(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Mock suggestions
    const mockSuggestions: CorrectionSuggestion[] = [
      {
        id: "1",
        type: "grammar",
        original: "আমি যাইতেছি",
        suggestion: "আমি যাচ্ছি",
        explanation: "সঠিক ব্যাকরণ অনুযায়ী 'যাচ্ছি' ব্যবহার করুন",
        position: { start: 0, end: 10 },
      },
      {
        id: "2",
        type: "spelling",
        original: "বাংলাদেশ",
        suggestion: "বাংলাদেশ",
        explanation: "বানান সঠিক আছে",
        position: { start: 15, end: 23 },
      },
      {
        id: "3",
        type: "punctuation",
        original: "কেমন আছেন",
        suggestion: "কেমন আছেন?",
        explanation: "প্রশ্নবোধক চিহ্ন যোগ করুন",
        position: { start: 25, end: 35 },
      },
    ]

    setSuggestions(mockSuggestions)

    // Apply corrections
    let corrected = inputText
    mockSuggestions.forEach((suggestion) => {
      corrected = corrected.replace(suggestion.original, suggestion.suggestion)
    })
    setCorrectedText(corrected)

    setIsAnalyzing(false)
    setActiveTab("results")

    toast({
      title: "বিশ্লেষণ সম্পন্ন! ✅",
      description: `${mockSuggestions.length}টি সাজেশন পাওয়া গেছে।`,
    })
  }

  const applySuggestion = (suggestionId: string) => {
    const suggestion = suggestions.find((s) => s.id === suggestionId)
    if (!suggestion) return

    const newText = inputText.replace(suggestion.original, suggestion.suggestion)
    setInputText(newText)
    setCorrectedText(newText)

    // Remove applied suggestion
    setSuggestions((prev) => prev.filter((s) => s.id !== suggestionId))

    toast({
      title: "সাজেশন প্রয়োগ হয়েছে! ✅",
      description: "টেক্সট আপডেট করা হয়েছে।",
    })
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "কপি হয়েছে! 📋",
      description: "টেক্সট ক্লিপবোর্ডে কপি হয়েছে।",
    })
  }

  const downloadText = (text: string, filename: string) => {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "ডাউনলোড সম্পন্ন! 📥",
      description: "ফাইল ডাউনলোড হয়ে গেছে।",
    })
  }

  const getSuggestionTypeColor = (type: string) => {
    switch (type) {
      case "grammar":
        return "bg-red-100 text-red-800"
      case "spelling":
        return "bg-blue-100 text-blue-800"
      case "style":
        return "bg-green-100 text-green-800"
      case "punctuation":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getSuggestionTypeText = (type: string) => {
    switch (type) {
      case "grammar":
        return "ব্যাকরণ"
      case "spelling":
        return "বানান"
      case "style":
        return "শৈলী"
      case "punctuation":
        return "যতিচিহ্ন"
      default:
        return "অন্যান্য"
    }
  }

  const stats = {
    total: suggestions.length,
    grammar: suggestions.filter((s) => s.type === "grammar").length,
    spelling: suggestions.filter((s) => s.type === "spelling").length,
    style: suggestions.filter((s) => s.type === "style").length,
    punctuation: suggestions.filter((s) => s.type === "punctuation").length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">টেক্সট সংশোধন</h2>
          <p className="text-gray-600">স্বয়ংক্রিয় টেক্সট সংশোধন এবং ব্যাকরণ পরীক্ষা</p>
        </div>
        <Button onClick={analyzeText} disabled={isAnalyzing} className="bg-blue-600 hover:bg-blue-700">
          {isAnalyzing ? (
            <>
              <Zap className="h-4 w-4 mr-2 animate-spin" />
              বিশ্লেষণ করছি...
            </>
          ) : (
            <>
              <Zap className="h-4 w-4 mr-2" />
              টেক্সট বিশ্লেষণ করুন
            </>
          )}
        </Button>
      </div>

      {/* Stats */}
      {suggestions.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
              <div className="text-sm text-gray-600">মোট সাজেশন</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{stats.grammar}</div>
              <div className="text-sm text-gray-600">ব্যাকরণ</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.spelling}</div>
              <div className="text-sm text-gray-600">বানান</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.style}</div>
              <div className="text-sm text-gray-600">শৈলী</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.punctuation}</div>
              <div className="text-sm text-gray-600">যতিচিহ্ন</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="input">টেক্সট ইনপুট</TabsTrigger>
          <TabsTrigger value="suggestions">সাজেশন</TabsTrigger>
          <TabsTrigger value="results">ফলাফল</TabsTrigger>
        </TabsList>

        {/* Input Tab */}
        <TabsContent value="input">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                টেক্সট ইনপুট
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="এখানে আপনার টেক্সট লিখুন যা সংশোধন করতে চান...

উদাহরণ:
আমি যাইতেছি বাংলাদেশ কেমন আছেন
আপনার নাম কি
আমি ভাল আছি ধন্যবাদ"
                  className="min-h-[300px] font-mono text-sm leading-relaxed"
                />

                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    {inputText.length} অক্ষর | {inputText.split(/\s+/).filter((w) => w.length > 0).length} শব্দ
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setInputText("")}>
                      পরিষ্কার করুন
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => copyToClipboard(inputText)}>
                      <Copy className="h-4 w-4 mr-1" />
                      কপি
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Suggestions Tab */}
        <TabsContent value="suggestions">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                সংশোধনের সাজেশন
              </CardTitle>
            </CardHeader>
            <CardContent>
              {suggestions.length > 0 ? (
                <div className="space-y-4">
                  {suggestions.map((suggestion) => (
                    <div key={suggestion.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <Badge className={getSuggestionTypeColor(suggestion.type)} variant="outline">
                            {getSuggestionTypeText(suggestion.type)}
                          </Badge>
                        </div>
                        <Button size="sm" onClick={() => applySuggestion(suggestion.id)}>
                          প্রয়োগ করুন
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <span className="text-sm font-medium text-red-600">আগে:</span>
                            <div className="bg-red-50 p-2 rounded text-sm">{suggestion.original}</div>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-green-600">পরে:</span>
                            <div className="bg-green-50 p-2 rounded text-sm">{suggestion.suggestion}</div>
                          </div>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-600">ব্যাখ্যা:</span>
                          <p className="text-sm text-gray-700 mt-1">{suggestion.explanation}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">কোন সাজেশন নেই</h3>
                  <p>প্রথমে টেক্সট বিশ্লেষণ করুন</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Results Tab */}
        <TabsContent value="results">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  সংশোধিত টেক্সট
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => copyToClipboard(correctedText)}>
                    <Copy className="h-4 w-4 mr-1" />
                    কপি
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => downloadText(correctedText, "সংশোধিত-টেক্সট.txt")}>
                    <Download className="h-4 w-4 mr-1" />
                    ডাউনলোড
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {correctedText ? (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="whitespace-pre-wrap font-mono text-sm leading-relaxed">{correctedText}</div>
                  </div>

                  <div className="text-sm text-gray-500">
                    সংশোধিত টেক্সট: {correctedText.length} অক্ষর |{" "}
                    {correctedText.split(/\s+/).filter((w) => w.length > 0).length} শব্দ
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">কোন ফলাফল নেই</h3>
                  <p>প্রথমে টেক্সট বিশ্লেষণ করুন</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

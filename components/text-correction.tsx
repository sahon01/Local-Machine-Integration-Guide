"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { FileText, CheckCircle, AlertCircle, Copy, Download, Wand2, RotateCcw } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface CorrectionSuggestion {
  original: string
  corrected: string
  type: "spelling" | "grammar" | "punctuation" | "style"
  explanation: string
  position: { start: number; end: number }
}

export function TextCorrection() {
  const [originalText, setOriginalText] = useState("")
  const [correctedText, setCorrectedText] = useState("")
  const [suggestions, setSuggestions] = useState<CorrectionSuggestion[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)

  // Common Bengali spelling corrections
  const bengaliCorrections = {
    কোরান: "কুরআন",
    নামায: "নামাজ",
    রোযা: "রোজা",
    হজ্জ: "হজ",
    যাকাত: "জাকাত",
    ইনশাল্লাহ: "ইনশাআল্লাহ",
    মাশাল্লাহ: "মাশাআল্লাহ",
    সুবহানাল্লাহ: "সুবহানাল্লাহি",
    আলহামদুলিল্লাহ: "আলহামদুলিল্লাহি",
    আস্তাগফিরুল্লাহ: "আস্তাগফিরুল্লাহ",
    বিসমিল্লাহ: "বিসমিল্লাহির রাহমানির রাহিম",
    জাযাকাল্লাহ: "জাযাকাল্লাহু খাইরান",
    বারাকাল্লাহ: "বারাকাল্লাহু ফিকুম",
  }

  // Grammar rules for Bengali
  const grammarRules = [
    {
      pattern: /\s+/g,
      replacement: " ",
      type: "spacing" as const,
      explanation: "অতিরিক্ত স্পেস সরানো হয়েছে",
    },
    {
      pattern: /([।!?])\s*([।!?])/g,
      replacement: "$1 $2",
      type: "punctuation" as const,
      explanation: "যতিচিহ্নের মধ্যে সঠিক স্পেসিং",
    },
    {
      pattern: /([।!?])\s*([a-zA-Zঅ-হ])/g,
      replacement: "$1 $2",
      type: "punctuation" as const,
      explanation: "যতিচিহ্নের পর স্পেস যোগ করা হয়েছে",
    },
  ]

  const processText = async () => {
    if (!originalText.trim()) {
      toast({
        title: "ত্রুটি!",
        description: "টেক্সট লিখুন।",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)
    setShowSuggestions(false)

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    let processedText = originalText
    const foundSuggestions: CorrectionSuggestion[] = []

    // Apply Bengali spelling corrections
    Object.entries(bengaliCorrections).forEach(([wrong, correct]) => {
      const regex = new RegExp(wrong, "g")
      let match
      while ((match = regex.exec(originalText)) !== null) {
        foundSuggestions.push({
          original: wrong,
          corrected: correct,
          type: "spelling",
          explanation: `"${wrong}" এর সঠিক বানান "${correct}"`,
          position: { start: match.index, end: match.index + wrong.length },
        })
      }
      processedText = processedText.replace(regex, correct)
    })

    // Apply grammar rules
    grammarRules.forEach((rule) => {
      const matches = [...originalText.matchAll(rule.pattern)]
      matches.forEach((match) => {
        if (match.index !== undefined) {
          foundSuggestions.push({
            original: match[0],
            corrected: match[0].replace(rule.pattern, rule.replacement),
            type: rule.type,
            explanation: rule.explanation,
            position: { start: match.index, end: match.index + match[0].length },
          })
        }
      })
      processedText = processedText.replace(rule.pattern, rule.replacement)
    })

    // Additional style suggestions
    if (processedText.includes("আমি")) {
      const matches = [...processedText.matchAll(/আমি/g)]
      matches.forEach((match) => {
        if (match.index !== undefined) {
          foundSuggestions.push({
            original: "আমি",
            corrected: "আমি",
            type: "style",
            explanation: 'ফর্মাল লেখায় "আমি" এর পরিবর্তে "আমরা" ব্যবহার করা যেতে পারে',
            position: { start: match.index, end: match.index + 2 },
          })
        }
      })
    }

    setCorrectedText(processedText)
    setSuggestions(foundSuggestions)
    setIsProcessing(false)
    setShowSuggestions(true)

    toast({
      title: "টেক্সট সংশোধন সম্পন্ন! ✅",
      description: `${foundSuggestions.length}টি সংশোধনী পাওয়া গেছে।`,
    })
  }

  const applySuggestion = (index: number) => {
    const suggestion = suggestions[index]
    const newText = correctedText.replace(suggestion.original, suggestion.corrected)
    setCorrectedText(newText)

    // Remove applied suggestion
    setSuggestions((prev) => prev.filter((_, i) => i !== index))

    toast({
      title: "সংশোধনী প্রয়োগ করা হয়েছে! ✅",
      description: `"${suggestion.original}" → "${suggestion.corrected}"`,
    })
  }

  const copyText = (text: string) => {
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

  const resetText = () => {
    setOriginalText("")
    setCorrectedText("")
    setSuggestions([])
    setShowSuggestions(false)

    toast({
      title: "রিসেট করা হয়েছে! 🔄",
      description: "সব টেক্সট পরিষ্কার করা হয়েছে।",
    })
  }

  const getSuggestionTypeColor = (type: string) => {
    switch (type) {
      case "spelling":
        return "bg-red-100 text-red-800 border-red-200"
      case "grammar":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "punctuation":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "style":
        return "bg-purple-100 text-purple-800 border-purple-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getSuggestionTypeText = (type: string) => {
    switch (type) {
      case "spelling":
        return "বানান"
      case "grammar":
        return "ব্যাকরণ"
      case "punctuation":
        return "যতিচিহ্ন"
      case "style":
        return "শৈলী"
      default:
        return "অন্যান্য"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">টেক্সট সংশোধন</h2>
          <p className="text-gray-600">স্বয়ংক্রিয় বানান, ব্যাকরণ এবং শৈলী সংশোধন</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={resetText} variant="outline">
            <RotateCcw className="h-4 w-4 mr-2" />
            রিসেট
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              মূল টেক্সট
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={originalText}
              onChange={(e) => setOriginalText(e.target.value)}
              placeholder="এখানে আপনার টেক্সট লিখুন...

উদাহরণ:
আসসালামু আলাইকুম। আমি আজ নামায পড়েছি এবং কোরান তেলাওয়াত করেছি। ইনশাল্লাহ রোযা রাখব। আলহামদুলিল্লাহ।"
              className="min-h-[300px] font-mono text-sm"
            />

            <div className="flex gap-2">
              <Button
                onClick={processText}
                disabled={isProcessing || !originalText.trim()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    প্রক্রিয়াকরণ...
                  </>
                ) : (
                  <>
                    <Wand2 className="h-4 w-4 mr-2" />
                    সংশোধন করুন
                  </>
                )}
              </Button>

              <Button onClick={() => copyText(originalText)} variant="outline" disabled={!originalText.trim()}>
                <Copy className="h-4 w-4 mr-2" />
                কপি
              </Button>

              <Button
                onClick={() => downloadText(originalText, "original-text.txt")}
                variant="outline"
                disabled={!originalText.trim()}
              >
                <Download className="h-4 w-4 mr-2" />
                ডাউনলোড
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-center p-2 bg-gray-50 rounded">
                <div className="font-bold text-blue-600">{originalText.length}</div>
                <div className="text-gray-600">অক্ষর</div>
              </div>
              <div className="text-center p-2 bg-gray-50 rounded">
                <div className="font-bold text-green-600">
                  {
                    originalText
                      .trim()
                      .split(/\s+/)
                      .filter((word) => word.length > 0).length
                  }
                </div>
                <div className="text-gray-600">শব্দ</div>
              </div>
              <div className="text-center p-2 bg-gray-50 rounded">
                <div className="font-bold text-purple-600">{originalText.split("\n").length}</div>
                <div className="text-gray-600">লাইন</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Output Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              সংশোধিত টেক্সট
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={correctedText}
              onChange={(e) => setCorrectedText(e.target.value)}
              placeholder="সংশোধিত টেক্সট এখানে দেখাবে..."
              className="min-h-[300px] font-mono text-sm"
              readOnly={!correctedText}
            />

            <div className="flex gap-2">
              <Button onClick={() => copyText(correctedText)} variant="outline" disabled={!correctedText.trim()}>
                <Copy className="h-4 w-4 mr-2" />
                কপি
              </Button>

              <Button
                onClick={() => downloadText(correctedText, "corrected-text.txt")}
                variant="outline"
                disabled={!correctedText.trim()}
              >
                <Download className="h-4 w-4 mr-2" />
                ডাউনলোড
              </Button>
            </div>

            {/* Improvement Stats */}
            {correctedText && (
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center p-2 bg-green-50 rounded">
                  <div className="font-bold text-green-600">{suggestions.length}</div>
                  <div className="text-gray-600">সংশোধনী</div>
                </div>
                <div className="text-center p-2 bg-blue-50 rounded">
                  <div className="font-bold text-blue-600">
                    {Math.round(((originalText.length - correctedText.length) / originalText.length) * 100) || 0}%
                  </div>
                  <div className="text-gray-600">উন্নতি</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              সংশোধনীর পরামর্শ ({suggestions.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {suggestions.map((suggestion, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getSuggestionTypeColor(suggestion.type)} variant="outline">
                          {getSuggestionTypeText(suggestion.type)}
                        </Badge>
                      </div>

                      <div className="text-sm space-y-1">
                        <div>
                          <span className="text-gray-600">মূল:</span>
                          <span className="ml-2 bg-red-100 px-2 py-1 rounded text-red-800">
                            "{suggestion.original}"
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">সংশোধিত:</span>
                          <span className="ml-2 bg-green-100 px-2 py-1 rounded text-green-800">
                            "{suggestion.corrected}"
                          </span>
                        </div>
                        <div className="text-gray-600 text-xs">{suggestion.explanation}</div>
                      </div>
                    </div>

                    <Button onClick={() => applySuggestion(index)} size="sm" className="ml-4">
                      প্রয়োগ করুন
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Help Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">সাহায্য ও টিপস</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <div>
            <strong>বানান সংশোধন:</strong> সাধারণ ভুল বানান স্বয়ংক্রিয়ভাবে সংশোধিত হবে
          </div>
          <div>
            <strong>ব্যাকরণ পরীক্ষা:</strong> বাক্য গঠন এবং শব্দ ব্যবহার পরীক্ষা করা হবে
          </div>
          <div>
            <strong>যতিচিহ্ন:</strong> সঠিক যতিচিহ্ন এবং স্পেসিং নিশ্চিত করা হবে
          </div>
          <div>
            <strong>শৈলী উন্নতি:</strong> আরও ভাল লেখার জন্য পরামর্শ দেওয়া হবে
          </div>
          <div>
            <strong>ইসলামিক পরিভাষা:</strong> আরবি শব্দের সঠিক বানান নিশ্চিত করা হবে
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

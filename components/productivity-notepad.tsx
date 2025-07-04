"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Save,
  Download,
  Upload,
  Copy,
  FileText,
  Search,
  Bold,
  Italic,
  Underline,
  List,
  Hash,
  Calendar,
  Clock,
  Palette,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"

export function ProductivityNotepad() {
  const [content, setContent] = useState("")
  const [fileName, setFileName] = useState("আমার-নোট")
  const [searchTerm, setSearchTerm] = useState("")
  const [wordCount, setWordCount] = useState(0)
  const [charCount, setCharCount] = useState(0)
  const [savedNotes, setSavedNotes] = useState<string[]>([])
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Update word and character count
  useEffect(() => {
    const words = content
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0)
    setWordCount(words.length)
    setCharCount(content.length)
  }, [content])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "s":
            e.preventDefault()
            saveNote()
            break
          case "o":
            e.preventDefault()
            fileInputRef.current?.click()
            break
          case "n":
            e.preventDefault()
            newNote()
            break
          case "f":
            e.preventDefault()
            document.getElementById("search-input")?.focus()
            break
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [content, fileName])

  const saveNote = () => {
    if (content.trim()) {
      const timestamp = new Date().toLocaleString("bn-BD")
      const noteWithTimestamp = `${fileName}\n${timestamp}\n\n${content}`
      setSavedNotes((prev) => [...prev, noteWithTimestamp])
      localStorage.setItem("productivity-notes", JSON.stringify([...savedNotes, noteWithTimestamp]))
      toast({
        title: "নোট সেভ হয়েছে! ✅",
        description: `"${fileName}" সফলভাবে সংরক্ষিত হয়েছে।`,
      })
    }
  }

  const downloadNote = () => {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${fileName}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast({
      title: "ডাউনলোড সম্পন্ন! 📥",
      description: "আপনার নোট ডাউনলোড হয়ে গেছে।",
    })
  }

  const uploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const text = e.target?.result as string
        setContent(text)
        setFileName(file.name.replace(".txt", ""))
        toast({
          title: "ফাইল আপলোড হয়েছে! 📤",
          description: `"${file.name}" সফলভাবে লোড হয়েছে।`,
        })
      }
      reader.readAsText(file)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content)
    toast({
      title: "কপি হয়েছে! 📋",
      description: "টেক্সট ক্লিপবোর্ডে কপি হয়েছে।",
    })
  }

  const newNote = () => {
    setContent("")
    setFileName("নতুন-নোট")
    toast({
      title: "নতুন নোট! 📝",
      description: "নতুন নোট শুরু করুন।",
    })
  }

  const insertTemplate = (template: string) => {
    const templates = {
      meeting: `📅 মিটিং নোট - ${new Date().toLocaleDateString("bn-BD")}\n\n🎯 উদ্দেশ্য:\n\n👥 অংশগ্রহণকারী:\n\n📝 আলোচনা:\n\n✅ সিদ্ধান্ত:\n\n📋 পরবর্তী পদক্ষেপ:\n\n`,
      todo: `📋 আজকের কাজের তালিকা - ${new Date().toLocaleDateString("bn-BD")}\n\n🔥 জরুরি:\n☐ \n☐ \n\n⭐ গুরুত্বপূর্ণ:\n☐ \n☐ \n\n📝 সাধারণ:\n☐ \n☐ \n\n`,
      project: `🚀 প্রজেক্ট পরিকল্পনা\n\n📌 প্রজেক্টের নাম:\n\n🎯 লক্ষ্য:\n\n📅 সময়সীমা:\n\n👥 টিম সদস্য:\n\n📋 কাজের তালিকা:\n☐ \n☐ \n☐ \n\n💰 বাজেট:\n\n📊 অগ্রগতি:\n\n`,
    }
    setContent((prev) => prev + templates[template as keyof typeof templates])
  }

  const formatText = (format: string) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = content.substring(start, end)

    let formattedText = selectedText
    switch (format) {
      case "bold":
        formattedText = `**${selectedText}**`
        break
      case "italic":
        formattedText = `*${selectedText}*`
        break
      case "underline":
        formattedText = `__${selectedText}__`
        break
      case "heading":
        formattedText = `# ${selectedText}`
        break
      case "list":
        formattedText = `• ${selectedText}`
        break
    }

    const newContent = content.substring(0, start) + formattedText + content.substring(end)
    setContent(newContent)
  }

  const highlightSearchTerm = (text: string) => {
    if (!searchTerm) return text
    const regex = new RegExp(`(${searchTerm})`, "gi")
    return text.replace(regex, "**$1**")
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-2 items-center">
          <Input
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            className="w-48"
            placeholder="ফাইলের নাম"
          />
          <Badge variant="outline" className="bg-blue-50">
            {wordCount} শব্দ | {charCount} অক্ষর
          </Badge>
        </div>

        <div className="flex gap-2">
          <Button onClick={newNote} variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-1" />
            নতুন
          </Button>
          <Button onClick={saveNote} variant="outline" size="sm">
            <Save className="h-4 w-4 mr-1" />
            সেভ
          </Button>
          <Button onClick={downloadNote} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-1" />
            ডাউনলোড
          </Button>
          <Button onClick={() => fileInputRef.current?.click()} variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-1" />
            আপলোড
          </Button>
          <Button onClick={copyToClipboard} variant="outline" size="sm">
            <Copy className="h-4 w-4 mr-1" />
            কপি
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex gap-2 items-center">
        <Search className="h-4 w-4 text-gray-500" />
        <Input
          id="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="খুঁজুন... (Ctrl+F)"
          className="max-w-md"
        />
      </div>

      {/* Formatting Toolbar */}
      <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg">
        <Button onClick={() => formatText("bold")} variant="outline" size="sm">
          <Bold className="h-4 w-4" />
        </Button>
        <Button onClick={() => formatText("italic")} variant="outline" size="sm">
          <Italic className="h-4 w-4" />
        </Button>
        <Button onClick={() => formatText("underline")} variant="outline" size="sm">
          <Underline className="h-4 w-4" />
        </Button>
        <Button onClick={() => formatText("heading")} variant="outline" size="sm">
          <Hash className="h-4 w-4" />
        </Button>
        <Button onClick={() => formatText("list")} variant="outline" size="sm">
          <List className="h-4 w-4" />
        </Button>

        <div className="border-l mx-2"></div>

        <Button onClick={() => insertTemplate("meeting")} variant="outline" size="sm">
          <Calendar className="h-4 w-4 mr-1" />
          মিটিং
        </Button>
        <Button onClick={() => insertTemplate("todo")} variant="outline" size="sm">
          <Clock className="h-4 w-4 mr-1" />
          টুডু
        </Button>
        <Button onClick={() => insertTemplate("project")} variant="outline" size="sm">
          <Palette className="h-4 w-4 mr-1" />
          প্রজেক্ট
        </Button>
      </div>

      {/* Main Text Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="এখানে লিখুন... 

শর্টকাট কী:
• Ctrl+S = সেভ করুন
• Ctrl+O = ফাইল খুলুন  
• Ctrl+N = নতুন নোট
• Ctrl+F = খুঁজুন

টেমপ্লেট ব্যবহার করুন উপরের বাটন থেকে!"
            className="min-h-[500px] font-mono text-sm leading-relaxed"
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">পরিসংখ্যান</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span>শব্দ:</span>
                <Badge>{wordCount}</Badge>
              </div>
              <div className="flex justify-between">
                <span>অক্ষর:</span>
                <Badge>{charCount}</Badge>
              </div>
              <div className="flex justify-between">
                <span>লাইন:</span>
                <Badge>{content.split("\n").length}</Badge>
              </div>
              <div className="flex justify-between">
                <span>প্যারাগ্রাফ:</span>
                <Badge>{content.split("\n\n").length}</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Shortcuts Help */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">শর্টকাট কী</CardTitle>
            </CardHeader>
            <CardContent className="text-xs space-y-1">
              <div>
                <kbd className="bg-gray-100 px-1 rounded">Ctrl+S</kbd> সেভ
              </div>
              <div>
                <kbd className="bg-gray-100 px-1 rounded">Ctrl+O</kbd> খুলুন
              </div>
              <div>
                <kbd className="bg-gray-100 px-1 rounded">Ctrl+N</kbd> নতুন
              </div>
              <div>
                <kbd className="bg-gray-100 px-1 rounded">Ctrl+F</kbd> খুঁজুন
              </div>
            </CardContent>
          </Card>

          {/* Recent Notes */}
          {savedNotes.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">সাম্প্রতিক নোট</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {savedNotes
                    .slice(-5)
                    .reverse()
                    .map((note, index) => (
                      <div
                        key={index}
                        className="p-2 bg-gray-50 rounded text-xs cursor-pointer hover:bg-gray-100"
                        onClick={() => setContent(note.split("\n\n").slice(1).join("\n\n"))}
                      >
                        {note.split("\n")[0]}
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Hidden file input */}
      <input ref={fileInputRef} type="file" accept=".txt,.md" onChange={uploadFile} className="hidden" />
    </div>
  )
}

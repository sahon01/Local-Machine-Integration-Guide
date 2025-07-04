"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProjectScheduler } from "@/components/project-scheduler"
import { ProjectManager } from "@/components/project-manager"
import { ProjectDelivery } from "@/components/project-delivery"
import { DateTodoList } from "@/components/date-todo-list"
import { CustomCharacter } from "@/components/custom-character"
import { TextCorrection } from "@/components/text-correction"
import { MP3Playlist } from "@/components/mp3-playlist"
import { ProductivityNotepad } from "@/components/productivity-notepad"
import {
  Calendar,
  FolderOpen,
  Truck,
  CheckSquare,
  User,
  FileText,
  Music,
  NotebookPen,
  Download,
  Github,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function AdminProductivityToolkit() {
  const [activeTab, setActiveTab] = useState("notepad")

  const downloadProject = () => {
    alert("প্রজেক্ট ডাউনলোড শুরু হচ্ছে... GitHub থেকে সম্পূর্ণ কোড পাবেন!")
  }

  const toolStats = [
    { name: "নোটপ্যাড", count: "12", icon: NotebookPen, color: "text-blue-600" },
    { name: "প্রজেক্ট", count: "8", icon: FolderOpen, color: "text-green-600" },
    { name: "টুডু", count: "24", icon: CheckSquare, color: "text-orange-600" },
    { name: "ডেলিভারি", count: "5", icon: Truck, color: "text-purple-600" },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Zap className="h-8 w-8 text-blue-600" />
            প্রোডাক্টিভিটি টুলকিট
          </h1>
          <p className="text-slate-600 mt-2">
            সম্পূর্ণ প্রোডাক্টিভিটি সমাধান - প্রজেক্ট ম্যানেজমেন্ট থেকে শুরু করে দৈনিক কাজের পরিকল্পনা
          </p>
        </div>
        <div className="flex gap-3">
          <Button onClick={downloadProject} className="bg-green-600 hover:bg-green-700">
            <Download className="h-4 w-4 mr-2" />
            প্রজেক্ট ডাউনলোড
          </Button>
          <Button variant="outline" className="border-slate-300 bg-transparent">
            <Github className="h-4 w-4 mr-2" />
            GitHub
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {toolStats.map((stat) => {
          const IconComponent = stat.icon
          return (
            <Card key={stat.name}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">{stat.name}</p>
                    <p className="text-2xl font-bold">{stat.count}</p>
                    <p className="text-xs text-slate-500 mt-1">সক্রিয় আইটেম</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-full">
                    <IconComponent className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Main Productivity Tools */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <NotebookPen className="h-6 w-6" />
                প্রোডাক্টিভিটি টুলস
              </CardTitle>
              <CardDescription>আপনার সকল কাজের জন্য একটি সম্পূর্ণ সমাধান</CardDescription>
            </div>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              8 টি টুল
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 mb-6">
              <TabsTrigger value="notepad" className="flex items-center gap-2">
                <NotebookPen className="h-4 w-4" />
                <span className="hidden sm:inline">নোটপ্যাড</span>
              </TabsTrigger>
              <TabsTrigger value="schedule" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">সময়সূচী</span>
              </TabsTrigger>
              <TabsTrigger value="projects" className="flex items-center gap-2">
                <FolderOpen className="h-4 w-4" />
                <span className="hidden sm:inline">প্রজেক্ট</span>
              </TabsTrigger>
              <TabsTrigger value="delivery" className="flex items-center gap-2">
                <Truck className="h-4 w-4" />
                <span className="hidden sm:inline">ডেলিভারি</span>
              </TabsTrigger>
              <TabsTrigger value="todo" className="flex items-center gap-2">
                <CheckSquare className="h-4 w-4" />
                <span className="hidden sm:inline">টুডু</span>
              </TabsTrigger>
              <TabsTrigger value="character" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">ক্যারেক্টার</span>
              </TabsTrigger>
              <TabsTrigger value="correction" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">সংশোধন</span>
              </TabsTrigger>
              <TabsTrigger value="music" className="flex items-center gap-2">
                <Music className="h-4 w-4" />
                <span className="hidden sm:inline">মিউজিক</span>
              </TabsTrigger>
            </TabsList>

            {/* Notepad Tab */}
            <TabsContent value="notepad">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <NotebookPen className="h-5 w-5" />
                    প্রোডাক্টিভিটি নোটপ্যাড
                  </CardTitle>
                  <CardDescription>শর্টকাট এবং বিভিন্ন প্রোডাক্টিভিটি ফিচার সহ উন্নত নোটপ্যাড</CardDescription>
                </CardHeader>
                <CardContent>
                  <ProductivityNotepad />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Project Schedule Tab */}
            <TabsContent value="schedule">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    প্রজেক্ট সময়সূচী
                  </CardTitle>
                  <CardDescription>আপনার প্রজেক্টের সময়সূচী পরিকল্পনা এবং ব্যবস্থাপনা করুন</CardDescription>
                </CardHeader>
                <CardContent>
                  <ProjectScheduler />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Project Management Tab */}
            <TabsContent value="projects">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FolderOpen className="h-5 w-5" />
                    প্রজেক্ট ম্যানেজমেন্ট
                  </CardTitle>
                  <CardDescription>সম্পূর্ণ প্রজেক্ট ব্যবস্থাপনা এবং ট্র্যাকিং সিস্টেম</CardDescription>
                </CardHeader>
                <CardContent>
                  <ProjectManager />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Project Delivery Tab */}
            <TabsContent value="delivery">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    প্রজেক্ট ডেলিভারি
                  </CardTitle>
                  <CardDescription>প্রজেক্ট ডেলিভারি ট্র্যাকিং এবং ক্লায়েন্ট কমিউনিকেশন</CardDescription>
                </CardHeader>
                <CardContent>
                  <ProjectDelivery />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Date Todo List Tab */}
            <TabsContent value="todo">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckSquare className="h-5 w-5" />
                    আজকের কাজের তালিকা
                  </CardTitle>
                  <CardDescription>দৈনিক কাজের তালিকা এবং অগ্রাধিকার ব্যবস্থাপনা</CardDescription>
                </CardHeader>
                <CardContent>
                  <DateTodoList />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Custom Character Tab */}
            <TabsContent value="character">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    কাস্টম ক্যারেক্টার
                  </CardTitle>
                  <CardDescription>আপনার নিজস্ব ক্যারেক্টার তৈরি এবং কাস্টমাইজ করুন</CardDescription>
                </CardHeader>
                <CardContent>
                  <CustomCharacter />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Text Correction Tab */}
            <TabsContent value="correction">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    টেক্সট সংশোধন
                  </CardTitle>
                  <CardDescription>স্বয়ংক্রিয় টেক্সট সংশোধন এবং ব্যাকরণ পরীক্ষা</CardDescription>
                </CardHeader>
                <CardContent>
                  <TextCorrection />
                </CardContent>
              </Card>
            </TabsContent>

            {/* MP3 Playlist Tab */}
            <TabsContent value="music">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Music className="h-5 w-5" />
                    কাস্টম MP3 প্লেলিস্ট
                  </CardTitle>
                  <CardDescription>আপনার প্রিয় গানের প্লেলিস্ট তৈরি এবং পরিচালনা করুন</CardDescription>
                </CardHeader>
                <CardContent>
                  <MP3Playlist />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Footer */}
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-slate-600">
            🤲 আল্লাহর রহমতে এই টুলটি তৈরি করা হয়েছে। আশা করি এটি আপনার প্রোডাক্টিভিটি বৃদ্ধিতে সাহায্য করবে।
          </p>
          <p className="text-sm text-slate-500 mt-2">বারাকাল্লাহু ফিকুম - আল্লাহ আপনাদের মধ্যে বরকত দান করুন</p>
        </CardContent>
      </Card>
    </div>
  )
}

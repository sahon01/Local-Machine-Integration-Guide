"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Brain,
  Bot,
  Server,
  Database,
  MessageSquare,
  Settings,
  Book,
  Home,
  Webhook,
  FileText,
  Lightbulb,
  Music,
  CheckSquare,
  User,
  Calendar,
  Package,
  Send,
  BookOpen,
  Wrench,
} from "lucide-react"

const menuItems = [
  {
    title: "মূল পাতা",
    items: [
      { name: "হোম", href: "/", icon: Home },
      { name: "ড্যাশবোর্ড", href: "/admin", icon: LayoutDashboard },
    ],
  },
  {
    title: "AI ম্যানেজমেন্ট",
    items: [
      { name: "মডেল", href: "/admin/models", icon: Brain },
      { name: "এজেন্ট", href: "/admin/agents", icon: Bot },
      { name: "সার্ভার", href: "/server/whm-domains", icon: Server },
    ],
  },
  {
    title: "টুলস",
    items: [
      { name: "ডাটাবেস", href: "/database", icon: Database },
      { name: "এআই চ্যাট", href: "/ai-chat", icon: MessageSquare },
      { name: "ওয়েবহুক", href: "/webhooks", icon: Webhook },
    ],
  },
  {
    title: "উৎপাদনশীলতা",
    items: [
      { name: "নোটপ্যাড", href: "/admin/productivity/notepad", icon: FileText },
      { name: "শিডিউলার", href: "/admin/productivity/scheduler", icon: Calendar },
      { name: "প্রজেক্ট", href: "/admin/productivity/projects", icon: Package },
      { name: "ডেলিভারি", href: "/admin/productivity/delivery", icon: Send },
      { name: "টুডু", href: "/admin/productivity/todo", icon: CheckSquare },
      { name: "চরিত্র", href: "/admin/productivity/character", icon: User },
      { name: "টেক্সট সংশোধন", href: "/admin/productivity/correction", icon: Wrench },
      { name: "মিউজিক", href: "/admin/productivity/music", icon: Music },
    ],
  },
  {
    title: "ডকুমেন্টেশন",
    items: [
      { name: "ডকস", href: "/documentation", icon: Book },
      { name: "ইনস্টলেশন", href: "/installation", icon: BookOpen },
      { name: "সেটআপ", href: "/setup", icon: Settings },
      { name: "ট্রাবলশুটিং", href: "/troubleshooting", icon: Lightbulb },
    ],
  },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col gap-2 border-r bg-background p-4">
      <div className="mb-4">
        <h2 className="text-lg font-bold">ZombieCoder AI</h2>
        <p className="text-xs text-muted-foreground">Admin Panel</p>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto">
        {menuItems.map((section) => (
          <div key={section.title}>
            <h3 className="mb-2 px-2 text-xs font-semibold text-muted-foreground">{section.title}</h3>
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
                      isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>
    </div>
  )
}

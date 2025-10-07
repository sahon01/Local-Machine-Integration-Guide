"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
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
  Terminal,
  Code,
  Plug,
  Users,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Globe,
  Languages,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"

const menuItems = [
  {
    title: "Main",
    items: [
      { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
      { name: "Public Site", href: "/", icon: Home },
    ],
  },
  {
    title: "AI Management",
    items: [
      { name: "Models", href: "/admin/models", icon: Brain },
      { name: "Agents", href: "/admin/agents", icon: Bot },
      { name: "Servers", href: "/server/whm-domains", icon: Server },
      { name: "Providers", href: "/admin/providers", icon: Plug },
    ],
  },
  {
    title: "Tools",
    items: [
      { name: "Database", href: "/database", icon: Database },
      { name: "AI Chat", href: "/ai-chat", icon: MessageSquare },
      { name: "Prompts", href: "/admin/prompts", icon: Code },
      { name: "Commands", href: "/admin/commands", icon: Terminal },
      { name: "Webhooks", href: "/webhooks", icon: Webhook },
    ],
  },
  {
    title: "Productivity",
    items: [
      { name: "Notepad", href: "/admin/productivity/notepad", icon: FileText },
      { name: "Scheduler", href: "/admin/productivity/scheduler", icon: Calendar },
      { name: "Projects", href: "/admin/productivity/projects", icon: Package },
      { name: "Delivery", href: "/admin/productivity/delivery", icon: Send },
      { name: "Todo List", href: "/admin/productivity/todo", icon: CheckSquare },
      { name: "Character", href: "/admin/productivity/character", icon: User },
      { name: "Text Correction", href: "/admin/productivity/correction", icon: Wrench },
      { name: "Music Player", href: "/admin/productivity/music", icon: Music },
    ],
  },
  {
    title: "System",
    items: [
      { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
      { name: "Users", href: "/admin/users", icon: Users },
      { name: "WHMCS", href: "/admin/whmcs", icon: Globe },
      { name: "Settings", href: "/admin/settings", icon: Settings },
    ],
  },
  {
    title: "Documentation",
    items: [
      { name: "Docs", href: "/documentation", icon: Book },
      { name: "Installation", href: "/installation", icon: BookOpen },
      { name: "Setup Guide", href: "/setup", icon: Settings },
      { name: "Troubleshooting", href: "/troubleshooting", icon: Lightbulb },
    ],
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [language, setLanguage] = useState<"en" | "bn">("en")

  return (
    <div
      className={cn(
        "flex h-full flex-col gap-2 border-r bg-background transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div>
              <h2 className="text-lg font-bold">ZombieCoder AI</h2>
              <p className="text-xs text-muted-foreground">Admin Panel</p>
            </div>
          )}
          <Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-6 overflow-y-auto p-4">
        {menuItems.map((section) => (
          <div key={section.title}>
            {!collapsed && <h3 className="mb-2 px-2 text-xs font-semibold text-muted-foreground">{section.title}</h3>}
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href

                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      className={cn("w-full justify-start", collapsed && "justify-center px-2")}
                      title={collapsed ? item.name : undefined}
                    >
                      <Icon className={cn("h-4 w-4", !collapsed && "mr-3")} />
                      {!collapsed && item.name}
                    </Button>
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Language Toggle */}
      {!collapsed && (
        <div className="p-4 border-t">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Languages className="h-4 w-4 mr-3" />
                {language === "en" ? "English" : "বাংলা"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Language</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setLanguage("en")}>{language === "en" && "✓ "}English</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage("bn")}>{language === "bn" && "✓ "}বাংলা</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {/* Status Indicator */}
      <div className={cn("p-4 border-t", collapsed && "flex justify-center")}>
        <div className={cn("flex items-center", collapsed ? "justify-center" : "gap-3")}>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          {!collapsed && (
            <div>
              <p className="text-xs font-medium">System Status</p>
              <p className="text-xs text-muted-foreground">All Systems Operational</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

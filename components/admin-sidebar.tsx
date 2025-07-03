"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/lib/language-context"
import {
  Home,
  Brain,
  Server,
  Database,
  Terminal,
  Code,
  Headphones,
  BookOpen,
  Settings,
  ChevronDown,
  ChevronRight,
  Globe,
  Menu,
  X,
  MessageSquare,
  Wand2,
  Lightbulb,
  Shield,
  Key,
  Wrench,
  GitBranch,
  DockIcon as Docker,
  Zap,
  BarChart3,
  LogOut,
} from "lucide-react"

interface SidebarProps {
  className?: string
}

interface NavItem {
  title: string
  href?: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
  children?: NavItem[]
}

export function AdminSidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const { t, language, setLanguage } = useLanguage()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [expandedItems, setExpandedItems] = useState<string[]>(["ai-tools", "server", "database", "commands", "dev"])

  const navigation: NavItem[] = [
    {
      title: t("dashboard"),
      href: "/admin",
      icon: Home,
    },
    {
      title: t("models"),
      href: "/admin/models",
      icon: Brain,
      badge: "5",
    },
    {
      title: t("aiTools"),
      icon: MessageSquare,
      children: [
        { title: "AI Chat", href: "/admin/ai-chat", icon: MessageSquare },
        { title: "Prompt Generator", href: "/admin/prompt-generator", icon: Wand2 },
        { title: "Project Ideas", href: "/admin/project-ideas", icon: Lightbulb },
      ],
    },
    {
      title: t("serverMgmt"),
      icon: Server,
      children: [
        { title: "WHM Domains", href: "/admin/server/whm-domains", icon: Globe },
        { title: "Server Access", href: "/admin/server/access", icon: Shield },
        { title: "SSH Tools", href: "/admin/server/ssh-tools", icon: Key },
      ],
    },
    {
      title: t("database"),
      icon: Database,
      children: [
        { title: "Database Tools", href: "/admin/database", icon: Database },
        { title: "Database Analysis", href: "/admin/database/analysis", icon: BarChart3 },
        { title: "DB Connection", href: "/admin/database/connection", icon: Zap },
        { title: "cPanel DB Access", href: "/admin/database/cpanel", icon: Wrench },
      ],
    },
    {
      title: t("commands"),
      icon: Terminal,
      children: [
        { title: "PHP Commands", href: "/admin/commands/php", icon: Code },
        { title: "Node.js Commands", href: "/admin/commands/nodejs", icon: Code },
        { title: "Python Commands", href: "/admin/commands/python", icon: Code },
        { title: "Linux Commands", href: "/admin/commands/linux", icon: Terminal },
        { title: "Ollama Commands", href: "/admin/commands/ollama", icon: Brain },
      ],
    },
    {
      title: t("devTools"),
      icon: Code,
      children: [
        { title: "Git Commands", href: "/admin/dev/git", icon: GitBranch },
        { title: "Docker Commands", href: "/admin/dev/docker", icon: Docker },
      ],
    },
    {
      title: t("webhooks"),
      href: "/admin/webhooks",
      icon: Headphones,
    },
    {
      title: t("documentation"),
      href: "/admin/documentation",
      icon: BookOpen,
    },
  ]

  const toggleExpanded = (key: string) => {
    setExpandedItems((prev) => (prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key]))
  }

  const renderNavItem = (item: NavItem, level = 0) => {
    const key = item.title.toLowerCase().replace(/\s+/g, "-")
    const isExpanded = expandedItems.includes(key)
    const isActive = item.href ? pathname === item.href : false
    const hasChildren = item.children && item.children.length > 0

    return (
      <div key={key}>
        {item.href ? (
          <Link href={item.href}>
            <div
              className={cn(
                "flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors",
                level > 0 && "ml-4 pl-6",
                isActive ? "bg-blue-100 text-blue-900 font-medium" : "text-slate-700 hover:bg-slate-100",
              )}
            >
              <item.icon className="h-4 w-4 flex-shrink-0" />
              {!isCollapsed && (
                <>
                  <span className="flex-1">{item.title}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </>
              )}
            </div>
          </Link>
        ) : (
          <div
            className={cn(
              "flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors cursor-pointer",
              level > 0 && "ml-4 pl-6",
              "text-slate-700 hover:bg-slate-100",
            )}
            onClick={() => toggleExpanded(key)}
          >
            <item.icon className="h-4 w-4 flex-shrink-0" />
            {!isCollapsed && (
              <>
                <span className="flex-1">{item.title}</span>
                {hasChildren && (
                  <div className="flex-shrink-0">
                    {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </div>
                )}
                {item.badge && (
                  <Badge variant="secondary" className="text-xs">
                    {item.badge}
                  </Badge>
                )}
              </>
            )}
          </div>
        )}

        {hasChildren && isExpanded && !isCollapsed && (
          <div className="mt-1 space-y-1">{item.children?.map((child) => renderNavItem(child, level + 1))}</div>
        )}
      </div>
    )
  }

  return (
    <div
      className={cn(
        "flex flex-col h-screen bg-white border-r border-slate-200 transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200">
        {!isCollapsed && <h1 className="text-lg font-semibold text-slate-900">AI Admin Panel</h1>}
        <Button variant="ghost" size="sm" onClick={() => setIsCollapsed(!isCollapsed)} className="h-8 w-8 p-0">
          {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
        </Button>
      </div>

      {/* Language Switcher */}
      {!isCollapsed && (
        <div className="p-4 border-b border-slate-200">
          <div className="flex gap-2">
            <Button
              variant={language === "en" ? "default" : "outline"}
              size="sm"
              onClick={() => setLanguage("en")}
              className="flex-1"
            >
              EN
            </Button>
            <Button
              variant={language === "bn" ? "default" : "outline"}
              size="sm"
              onClick={() => setLanguage("bn")}
              className="flex-1"
            >
              বাং
            </Button>
          </div>
        </div>
      )}

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-2">{navigation.map((item) => renderNavItem(item))}</div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-slate-200">
        <div className="space-y-2">
          <Link href="/admin/settings">
            <div className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg text-slate-700 hover:bg-slate-100 transition-colors">
              <Settings className="h-4 w-4" />
              {!isCollapsed && <span>{t("settings")}</span>}
            </div>
          </Link>

          <div className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer">
            <LogOut className="h-4 w-4" />
            {!isCollapsed && <span>Logout</span>}
          </div>
        </div>
      </div>
    </div>
  )
}

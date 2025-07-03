import type React from "react"
import type { Metadata } from "next"
import { LanguageProvider } from "@/lib/language-context"
import { AdminSidebar } from "@/components/admin-sidebar"
import { ThemeProvider } from "@/components/theme-provider"

export const metadata: Metadata = {
  title: "AI Admin Panel",
  description: "Comprehensive AI model management and administration panel",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <LanguageProvider>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
        <div className="flex h-screen bg-slate-50">
          <AdminSidebar />
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </ThemeProvider>
    </LanguageProvider>
  )
}

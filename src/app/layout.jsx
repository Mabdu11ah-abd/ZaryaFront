"use client"

import React, { Suspense } from "react"
import { Inter } from "next/font/google"
import { Toaster } from "sonner"
import { ThemeProvider } from "next-themes"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

const metadata = {
  title: "DIGLynx BD Tool",
  description: "A complete tool for finding and contacting business leads",
  keywords: ["business", "leads", "contact"],
  authors: [{ name: "DIGLynx", url: "https://diglynx.com" }],
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans bg-background text-foreground`}>
        {/* ✅ Theme provider for dark/light mode */}
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {/* ✅ Sidebar + main layout */}
          <SidebarProvider>
            <div className="flex min-h-screen w-full">
              <AppSidebar />
              <main className="flex-1 overflow-y-auto p-6">
                <Suspense fallback={null}>{children}</Suspense>
              </main>
            </div>
          </SidebarProvider>

          {/* ✅ Toasts */}
          <Toaster position="bottom-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  )
}

"use client"

import { BottomNav } from '@/components/mobile/bottom-nav'
import { ChatbotFloatingButton } from '@/components/mobile/chatbot-floating-button'

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mobile-shell text-foreground">
      <div className="mobile-scroll app-safe-padding">
        <main className="mx-auto w-full max-w-[420px] min-h-[100dvh]">
          {children}
        </main>
      </div>
      <ChatbotFloatingButton />
      <BottomNav />
    </div>
  )
}

'use client'

import Link from 'next/link'
import { MessageCircle } from 'lucide-react'
import { useState } from 'react'

export function ChatbotFloatingButton() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Link
      href="/itinerary"
      className="fixed bottom-24 right-4 z-40 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Floating Button */}
      <div
        className="flex items-center justify-center rounded-full shadow-lg transition-all duration-300 cursor-pointer"
        style={{
          width: isHovered ? 'auto' : '56px',
          height: '56px',
          background: 'linear-gradient(135deg, #D4893F, #C9A84C)',
          paddingLeft: isHovered ? '16px' : '0',
          paddingRight: isHovered ? '16px' : '0',
        }}
      >
        <MessageCircle size={24} style={{ color: '#0F0B1E' }} className="flex-shrink-0" />
        {isHovered && (
          <span
            style={{
              color: '#0F0B1E',
              marginLeft: '8px',
              whiteSpace: 'nowrap',
              fontWeight: 600,
              fontSize: '14px',
            }}
          >
            Chat
          </span>
        )}
      </div>

      {/* Tooltip/Label */}
      <div
        style={{
          position: 'absolute',
          bottom: '70px',
          right: '0',
          background: 'rgba(28, 22, 56, 0.95)',
          border: '1px solid rgba(201, 168, 76, 0.3)',
          color: '#F5E6D3',
          padding: '8px 12px',
          borderRadius: '8px',
          fontSize: '12px',
          fontWeight: 600,
          opacity: isHovered ? 1 : 0,
          pointerEvents: 'none',
          transition: 'opacity 0.2s ease',
          whiteSpace: 'nowrap',
        }}
      >
        Ask Heritage Guide
      </div>

      {/* Pulsing dot indicator */}
      <div
        style={{
          position: 'absolute',
          top: '-4px',
          right: '-4px',
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          background: '#C9A84C',
          animation: 'pulse 2s infinite',
        }}
      />
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.2); }
        }
      `}</style>
    </Link>
  )
}

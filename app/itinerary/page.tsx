'use client'
import { useState, useRef, useEffect } from 'react'
import { AppShell } from '@/components/app-shell'
import { useLang } from '@/lib/languageContext'
import { useAuth } from '@/lib/authContext'
import { Send } from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function ItineraryPage() {
  const { t } = useLang()
  const { user, profile } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const quickSuggestions = [
    { emoji: '🗺️', text: t('itinerary_q1'), prompt: t('itinerary_q1_prompt') },
    { emoji: '🏛️', text: t('itinerary_q2'), prompt: t('itinerary_q2_prompt') },
    { emoji: '🚗', text: t('itinerary_q3'), prompt: t('itinerary_q3_prompt') },
    { emoji: '🎭', text: t('itinerary_q4'), prompt: t('itinerary_q4_prompt') },
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async (text: string = '') => {
    const messageText = text || input
    if (!messageText.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('https://heritageai-backend.onrender.com/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageText,
          userId: user?.id,
          userName: profile?.full_name,
          conversationHistory: messages.map(m => ({ role: m.role, content: m.content }))
        })
      })

      const data = await response.json()
      
      if (data.response) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.response,
          timestamp: new Date(),
        }
        setMessages(prev => [...prev, assistantMessage])
      }
    } catch (error) {
      console.error('Chat error:', error)
      // Fallback response
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: t('itinerary_connect_error'),
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, assistantMessage])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <AppShell>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100dvh - 72px)',
        backgroundColor: '#050816',
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid rgba(201,168,76,0.2)',
          background: 'rgba(8,7,22,0.8)',
          backdropFilter: 'blur(10px)',
        }}>
          <h1 style={{
            fontFamily: 'Georgia, serif',
            fontSize: '1.8rem',
            color: '#C9A84C',
            fontWeight: 700,
            margin: '0 0 4px 0',
          }}>
            {t('itinerary_chat_title')}
          </h1>
          <p style={{ color: '#C4A882', margin: 0, fontSize: '14px' }}>
            {t('itinerary_chat_subtitle')}
          </p>
        </div>

        {/* Messages Container */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}>
          {messages.length === 0 ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🏛️</div>
              <h2 style={{
                fontFamily: 'Georgia, serif',
                color: '#C9A84C',
                fontSize: '1.4rem',
                margin: '0 0 8px 0',
              }}>
                {t('itinerary_chat_welcome')}
              </h2>
              <p style={{ color: '#C4A882', maxWidth: '320px', margin: '0 0 24px 0' }}>
                {t('itinerary_chat_welcome_desc')}
              </p>

              {/* Quick Suggestions */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                gap: '10px',
                width: '100%',
                maxWidth: '480px',
              }}>
                {quickSuggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => sendMessage(suggestion.prompt)}
                    disabled={loading}
                    style={{
                      padding: '12px 14px',
                      borderRadius: '12px',
                      border: '1px solid rgba(201,168,76,0.3)',
                      background: 'rgba(28,22,56,0.8)',
                      color: '#F5E6D3',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      textAlign: 'left',
                    }}
                    onMouseEnter={(e) => {
                      (e.target as HTMLElement).style.background = 'rgba(201,168,76,0.15)';
                      (e.target as HTMLElement).style.borderColor = 'rgba(201,168,76,0.6)';
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLElement).style.background = 'rgba(28,22,56,0.8)';
                      (e.target as HTMLElement).style.borderColor = 'rgba(201,168,76,0.3)';
                    }}
                  >
                    <div style={{ fontSize: '16px', marginBottom: '4px' }}>{suggestion.emoji}</div>
                    <div>{suggestion.text}</div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <div
                  key={message.id}
                  style={{
                    display: 'flex',
                    justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                    gap: '8px',
                  }}
                >
                  <div
                    style={{
                      maxWidth: '80%',
                      padding: '12px 16px',
                      borderRadius: '14px',
                      background:
                        message.role === 'user'
                          ? 'linear-gradient(135deg, #D4893F, #C9A84C)'
                          : 'rgba(28,22,56,0.9)',
                      color: message.role === 'user' ? '#0F0B1E' : '#F5E6D3',
                      border:
                        message.role === 'user'
                          ? 'none'
                          : '1px solid rgba(201,168,76,0.3)',
                      fontSize: '14px',
                      lineHeight: 1.5,
                      wordBreak: 'break-word',
                    }}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  gap: '8px',
                }}>
                  <div
                    style={{
                      padding: '12px 16px',
                      borderRadius: '14px',
                      background: 'rgba(28,22,56,0.9)',
                      border: '1px solid rgba(201,168,76,0.3)',
                      display: 'flex',
                      gap: '4px',
                      alignItems: 'center',
                    }}
                  >
                    <div
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: '#C9A84C',
                        animation: 'pulse 1.4s infinite',
                      }}
                    />
                    <div
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: '#C9A84C',
                        animation: 'pulse 1.4s infinite',
                        animationDelay: '0.2s',
                      }}
                    />
                    <div
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: '#C9A84C',
                        animation: 'pulse 1.4s infinite',
                        animationDelay: '0.4s',
                      }}
                    />
                    <style>{`
                      @keyframes pulse {
                        0%, 60%, 100% { opacity: 0.3; }
                        30% { opacity: 1; }
                      }
                    `}</style>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input Area */}
        <div style={{
          padding: '16px 24px 24px 24px',
          borderTop: '1px solid rgba(201,168,76,0.2)',
          background: 'rgba(8,7,22,0.95)',
          backdropFilter: 'blur(10px)',
        }}>
          <div style={{
            display: 'flex',
            gap: '8px',
            alignItems: 'flex-end',
          }}>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t('itinerary_chat_placeholder')}
              disabled={loading}
              style={{
                flex: 1,
                padding: '12px 14px',
                borderRadius: '12px',
                border: '1px solid rgba(201,168,76,0.3)',
                background: 'rgba(15,11,30,0.8)',
                color: '#F5E6D3',
                fontSize: '14px',
                fontFamily: 'inherit',
                resize: 'none',
                minHeight: '44px',
                maxHeight: '120px',
                outline: 'none',
              }}
              rows={1}
            />
            <button
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              style={{
                padding: '10px 16px',
                borderRadius: '12px',
                border: 'none',
                background:
                  loading || !input.trim()
                    ? 'rgba(201,168,76,0.2)'
                    : 'linear-gradient(135deg, #D4893F, #C9A84C)',
                color: loading || !input.trim() ? '#C4A882' : '#0F0B1E',
                cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease',
              }}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  )
}

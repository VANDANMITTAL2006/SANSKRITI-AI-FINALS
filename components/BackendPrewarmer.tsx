'use client'
import { useEffect } from 'react'
import { prewarmBackend } from '@/lib/cache'

export function BackendPrewarmer() {
  useEffect(() => {
    // Ping backend silently on app load to wake it up
    prewarmBackend()
  }, [])
  return null
}

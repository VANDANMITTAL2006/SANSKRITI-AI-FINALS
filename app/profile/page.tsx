"use client"

import { useMemo } from 'react'
import { useTheme } from 'next-themes'
import { AppShell } from '@/components/app-shell'
import { AppCard } from '@/components/mobile/app-card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/authContext'
import { useLang } from '@/lib/languageContext'
import { useUser } from '@/lib/userContext'
import { BadgeCheck, Globe, MoonStar, Flame, Trophy, MapPinned, ChevronRight } from 'lucide-react'

const LEVELS = [
  { min: 0, max: 499, title: 'Heritage Explorer', next: 500 },
  { min: 500, max: 999, title: 'Monument Seeker', next: 1000 },
  { min: 1000, max: 1999, title: 'Culture Guardian', next: 2000 },
  { min: 2000, max: 3499, title: 'History Keeper', next: 3500 },
  { min: 3500, max: 99999, title: 'Sanskriti Master', next: null },
]

const BADGES = [
  { id: 'first_scan', icon: '🏛️', title: 'First Glimpse', desc: 'Identify your first monument' },
  { id: 'quiz_master', icon: '🎓', title: 'Quiz Master', desc: 'Earn 100+ quiz points' },
  { id: 'explorer', icon: '🗺️', title: 'Explorer', desc: 'Visit 3 or more monuments' },
  { id: 'hunter', icon: '🏆', title: 'Treasure Hunter', desc: 'Reach 500+ XP' },
]

function getLevel(xp: number) {
  return LEVELS.find((level) => xp >= level.min && xp <= level.max) || LEVELS[0]
}

export default function ProfilePage() {
  const { profile } = useAuth()
  const { lang, toggleLang } = useLang()
  const { userType, setUserType, userConfig } = useUser()
  const { theme, setTheme } = useTheme()

  const safeProfile = profile || {
    full_name: 'Explorer',
    email: 'local@sanskriti.ai',
    total_xp: 0,
    monuments_visited: [],
    quiz_scores: [],
    badges: [],
    chat_history: [],
    user_type: 'tourist' as const,
    language: 'en' as const,
    admin_mode: false,
  }

  const level = getLevel(safeProfile.total_xp)
  const progress = level.next ? Math.min(100, Math.round(((safeProfile.total_xp - level.min) / (level.next - level.min)) * 100)) : 100
  const initials = useMemo(() => {
    const source = safeProfile.full_name || safeProfile.email || 'Explorer'
    return source.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()
  }, [safeProfile])

  return (
    <AppShell>
      <div className="space-y-4 px-4 pb-6">
        <AppCard className="p-0 overflow-hidden">
          <div style={{ background: 'linear-gradient(180deg, rgba(17,24,39,0.9), rgba(9,13,25,0.96))', padding: '1rem' }}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-[22px] border" style={{ borderColor: 'var(--primary)', backgroundColor: 'rgba(0,0,0,0.25)', color: 'var(--primary)', fontSize: 'large', fontWeight: 600 }}>
                  {initials}
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.22em] font-semibold" style={{ color: 'var(--muted-secondary)' }}>Profile</p>
                  <h1 className="mt-1 text-xl font-semibold" style={{ color: 'var(--foreground)' }}>{safeProfile.full_name || 'Explorer'}</h1>
                  <p className="text-sm" style={{ color: 'var(--muted-secondary)' }}>{userConfig?.subtitle || 'Your XP, badges, and settings live here.'}</p>
                </div>
              </div>
              <span className="rounded-full border px-3 py-1 text-xs font-semibold transition-colors" style={{ borderColor: 'var(--primary)', backgroundColor: 'rgba(201, 168, 76, 0.12)', color: 'var(--primary)' }}>⚡ {safeProfile.total_xp} XP</span>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              {[
                { label: 'Visited', value: safeProfile.monuments_visited.length, icon: MapPinned },
                { label: 'Badges', value: safeProfile.badges.length, icon: BadgeCheck },
                { label: 'Rank', value: '#24', icon: Trophy },
              ].map((item) => (
                <div key={item.label} className="rounded-[18px] border p-3 transition-colors" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
                  <item.icon className="h-4 w-4" style={{ color: 'var(--primary)' }} />
                  <p className="mt-2 text-[10px] uppercase tracking-[0.18em] font-semibold" style={{ color: 'var(--muted-secondary)' }}>{item.label}</p>
                  <p className="mt-1 text-lg font-semibold" style={{ color: 'var(--foreground)' }}>{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </AppCard>

        <AppCard>
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] font-semibold" style={{ color: 'var(--muted-secondary)' }}>Current level</p>
              <h2 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>{level.title}</h2>
            </div>
            <div className="rounded-full border px-3 py-1 text-sm font-semibold transition-colors" style={{ borderColor: 'var(--primary)', backgroundColor: 'rgba(201, 168, 76, 0.12)', color: 'var(--primary)' }}>
              {progress}%
            </div>
          </div>
          <div className="h-2 rounded-full" style={{ backgroundColor: 'var(--muted, rgba(28, 22, 56, 0.6))' }}>
            <div className="h-full rounded-full bg-[linear-gradient(135deg,#C9A84C,#D4893F)]" style={{ width: `${progress}%`, transition: 'width 0.3s ease' }} />
          </div>
        </AppCard>

        <section className="grid grid-cols-2 gap-2">
          <button className="app-card flex items-center justify-between rounded-[20px] px-4 py-3 text-left transition-colors" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} style={{ color: 'var(--foreground)' }}>
            <div className="flex items-center gap-3">
              <MoonStar className="h-5 w-5" style={{ color: 'var(--primary)' }} />
              <div>
                <p className="text-sm font-semibold" style={{ color: 'var(--card-foreground)' }}>Theme</p>
                <p className="text-xs" style={{ color: 'var(--muted-secondary)' }}>{theme === 'light' ? 'Light mode' : 'Dark mode'}</p>
              </div>
            </div>
          </button>

          <button type="button" className="app-card flex items-center justify-between rounded-[20px] px-4 py-3 text-left transition-colors" onClick={toggleLang} style={{ color: 'var(--foreground)' }}>
            <div className="flex items-center gap-3">
              <Globe className="h-5 w-5" style={{ color: 'var(--primary)' }} />
              <div>
                <p className="text-sm font-semibold" style={{ color: 'var(--card-foreground)' }}>Language</p>
                <p className="text-xs" style={{ color: 'var(--muted-secondary)' }}>{lang === 'en' ? 'English' : 'हिंदी'}</p>
              </div>
            </div>
          </button>
        </section>

        <AppCard>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold" style={{ color: 'var(--card-foreground)' }}>Mode</h2>
            <button onClick={() => setUserType(userType === 'student' ? 'tourist' : 'student')} className="rounded-full border px-3 py-1 text-xs font-semibold transition-colors" style={{ borderColor: 'var(--border)', color: 'var(--primary)' }}>
              Switch
            </button>
          </div>
          <p className="text-sm" style={{ color: 'var(--muted-secondary)' }}>{userConfig?.subtitle || 'Toggle between learning and travel-focused guidance.'}</p>
        </AppCard>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold" style={{ color: 'var(--card-foreground)' }}>Badges</h2>
          {BADGES.map((badge) => {
            const earned = safeProfile.badges.includes(badge.id)
            return (
              <div 
                key={badge.id} 
                className={`app-card flex items-center gap-3 rounded-[20px] p-4 transition-colors`}
                style={{
                  borderColor: earned ? 'var(--primary)' : 'var(--border)',
                  backgroundColor: earned ? 'rgba(201, 168, 76, 0.08)' : 'var(--card)',
                }}
              >
                <div className="text-2xl">{earned ? badge.icon : '🔒'}</div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold" style={{ color: 'var(--card-foreground)' }}>{badge.title}</p>
                  <p className="text-sm" style={{ color: 'var(--muted-secondary)' }}>{badge.desc}</p>
                </div>
                <ChevronRight className="h-4 w-4" style={{ color: 'var(--muted-secondary)' }} />
              </div>
            )
          })}
        </section>

        <AppCard className="safe-bottom-space">
          <div className="flex items-center gap-3">
            <Flame className="h-5 w-5" style={{ color: 'var(--primary)' }} />
            <div>
              <p className="font-semibold" style={{ color: 'var(--card-foreground)' }}>Offline-first UI</p>
              <p className="text-sm" style={{ color: 'var(--muted-secondary)' }}>Core screens stay usable with cached data and local state.</p>
            </div>
          </div>
          <div className="mt-4">
            <Button asChild className="w-full rounded-2xl" style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}>
              <a href="/explore">Continue exploring</a>
            </Button>
          </div>
        </AppCard>
      </div>
    </AppShell>
  )
}
import { useSyncExternalStore } from 'react'

export type ThemePreference = 'auto' | 'light' | 'dark'
type ThemeSnapshot = { preference: ThemePreference; resolved: 'light' | 'dark' }

const STORAGE_KEY = 'expo-homepage-theme'
const listeners = new Set<() => void>()
const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')

function isPreference(value: unknown): value is ThemePreference {
  return value === 'auto' || value === 'light' || value === 'dark'
}

function readPreference(): ThemePreference {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    return isPreference(value) ? value : 'auto'
  } catch {
    return 'auto'
  }
}

function resolve(preference: ThemePreference): ThemeSnapshot {
  return {
    preference,
    resolved: preference === 'auto' ? (systemTheme.matches ? 'dark' : 'light') : preference,
  }
}

let snapshot = resolve(readPreference())

function applyTheme(preference: ThemePreference) {
  const next = resolve(preference)
  const root = document.documentElement
  root.dataset.theme = next.resolved
  root.style.colorScheme = next.resolved
  document.querySelector('meta[name="theme-color"]')?.setAttribute(
    'content', next.resolved === 'dark' ? '#111113' : '#ffffff',
  )
  if (next.preference === snapshot.preference && next.resolved === snapshot.resolved) return
  snapshot = next
  listeners.forEach(listener => listener())
}

export function setTheme(preference: ThemePreference) {
  try { localStorage.setItem(STORAGE_KEY, preference) } catch { /* Keep this tab usable without storage. */ }
  applyTheme(preference)
}

/** Called once by main.tsx; HMR disposes these listeners before replacing them. */
export function startThemeSync() {
  applyTheme(snapshot.preference)
  const onSystemChange = () => {
    if (snapshot.preference === 'auto') applyTheme('auto')
  }
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY || event.key === null) applyTheme(readPreference())
  }
  systemTheme.addEventListener('change', onSystemChange)
  window.addEventListener('storage', onStorage)
  return () => {
    systemTheme.removeEventListener('change', onSystemChange)
    window.removeEventListener('storage', onStorage)
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => { listeners.delete(listener) }
}

export function useTheme() {
  return useSyncExternalStore(subscribe, () => snapshot)
}

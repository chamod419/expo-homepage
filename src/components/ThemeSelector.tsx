import { setTheme, useTheme } from '../hooks/useTheme'
import type { ThemePreference } from '../hooks/useTheme'
import './ThemeSelector.css'

export default function ThemeSelector() {
  const { preference } = useTheme()
  return (
    <label className="theme-selector">
      <svg className="theme-selector__icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        {preference === 'dark' ? (
          <path d="M16.6 12.2A7 7 0 0 1 7.8 3.4 7 7 0 1 0 16.6 12.2Z" fill="currentColor" />
        ) : preference === 'light' ? (
          <><circle cx="10" cy="10" r="3.5" fill="currentColor" /><path d="M10 1v2m0 14v2M1 10h2m14 0h2M3.6 3.6 5 5m10 10 1.4 1.4M3.6 16.4 5 15M15 5l1.4-1.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></>
        ) : (
          <><circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.4" /><path d="M10 3a7 7 0 0 0 0 14Z" fill="currentColor" /></>
        )}
      </svg>
      <select aria-label="Theme selector" value={preference} onChange={event => setTheme(event.target.value as ThemePreference)}>
        <option value="auto">Auto</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
      <svg className="theme-selector__chevron" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m4 6 4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </label>
  )
}

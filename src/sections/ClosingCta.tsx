import { useLayoutEffect, useRef } from 'react'
import metaIcon from '../assets/footer/meta.svg'
import reactIcon from '../assets/footer/react.svg'
import MonoIcon from '../components/MonoIcon'
import '../styles/expo-bottom.css'
import './ClosingCta.css'

const badges = [
  { text: 'Recommended by Meta', icon: metaIcon },
  { text: 'React Foundation', detail: 'Member', icon: reactIcon },
  { text: 'SOC 2 Type II', detail: 'Compliant' },
  { text: 'GDPR', detail: 'Compliant' },
  { text: 'CCPA', detail: 'Compliant' },
  { text: 'SSO' },
]

export default function ClosingCta() {
  const sectionRef = useRef<HTMLElement>(null)
  const shapeRef = useRef<HTMLDivElement>(null)
  const shadeRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const section = sectionRef.current
    const shape = shapeRef.current
    const shade = shadeRef.current
    if (!section || !shape || !shade) return
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0
    let nearViewport = true
    let previousTime = 0
    const readProgress = () => {
      const top = section.getBoundingClientRect().top
      return preference.matches ? 1 : Math.max(0, Math.min(1, (window.innerHeight - top) / (window.innerHeight * 0.85)))
    }
    let progress = readProgress()
    const paint = () => {
      const remaining = 1 - progress
      shape.style.transform = `translate3d(0, ${remaining * 109}%, 0) scale(${1 + remaining * 0.611})`
      shade.style.opacity = String(remaining)
    }
    const update = (now: number) => {
      frame = 0
      const target = readProgress()
      const delta = previousTime ? Math.min((now - previousTime) / 1000, 0.05) : 1 / 60
      previousTime = now
      progress = preference.matches ? target : progress + (target - progress) * (1 - Math.exp(-16 * delta))
      if (Math.abs(target - progress) < 0.0005) progress = target
      paint()
      if (progress !== target && nearViewport && !document.hidden) frame = requestAnimationFrame(update)
      else previousTime = 0
    }
    const schedule = () => {
      if (!frame && nearViewport && !document.hidden) frame = requestAnimationFrame(update)
    }
    const syncPreference = () => {
      cancelAnimationFrame(frame)
      frame = 0
      previousTime = 0
      if (preference.matches) {
        progress = 1
        paint()
      } else schedule()
    }
    const syncVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(frame)
        frame = 0
        previousTime = 0
      } else schedule()
    }
    const observer = 'IntersectionObserver' in window ? new IntersectionObserver(([entry]) => {
      nearViewport = entry.isIntersecting
      if (nearViewport) schedule()
      else {
        cancelAnimationFrame(frame)
        frame = 0
        previousTime = 0
      }
    }, { rootMargin: '200px 0px' }) : undefined
    observer?.observe(section)
    paint()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    document.addEventListener('visibilitychange', syncVisibility)
    preference.addEventListener('change', syncPreference)
    return () => {
      cancelAnimationFrame(frame)
      observer?.disconnect()
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      document.removeEventListener('visibilitychange', syncVisibility)
      preference.removeEventListener('change', syncPreference)
    }
  }, [])

  return (
    <div className="expo-bottom">
      <section className="closing-cta" aria-labelledby="closing-title" ref={sectionRef}>
        <div className="closing-cta__art" aria-hidden="true">
          <div className="closing-cta__shape" ref={shapeRef}>
            <div className="closing-cta__surface" />
            <div className="closing-cta__shade" ref={shadeRef} />
            <div className="closing-cta__grain" />
          </div>
        </div>
        <div className="closing-cta__fade" aria-hidden="true" />
        <div className="expo-bottom__container closing-cta__content">
          <h2 id="closing-title">Build beautiful<br />native apps</h2>
          <a className="closing-cta__button" href="https://expo.dev/new" target="_blank" rel="noopener noreferrer">
            Get started
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14m-7-7 7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <span className="expo-bottom__sr"> with Expo (opens in a new tab)</span>
          </a>
        </div>
      </section>
      <div className="closing-trust" aria-label="Expo reference credentials">
        <div className="closing-trust__track">
          {[0, 1].map(copy => (
            <div className={`closing-trust__set${copy ? ' closing-trust__set--duplicate' : ''}`} key={copy} aria-hidden={copy === 1 ? true : undefined}>
              {badges.map(badge => (
                <span className="closing-trust__badge" key={badge.text}>
                  {badge.icon ? <MonoIcon src={badge.icon} /> : <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                  <strong>{badge.text}</strong>{badge.detail && <span>{badge.detail}</span>}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

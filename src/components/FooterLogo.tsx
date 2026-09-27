import { useEffect, useRef } from 'react'
import './FooterLogo.css'

/** Small animated light surface behind the stationary Expo mark. */
export default function FooterLogo() {
  const linkRef = useRef<HTMLAnchorElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const link = linkRef.current
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!link || !canvas || !context) return

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const size = 44
    const ratio = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = Math.round(size * ratio)
    canvas.height = Math.round(size * ratio)
    context.setTransform(ratio, 0, 0, ratio, 0, 0)

    let frame = 0
    let previous = 0
    let elapsed = 0
    let visible = false
    let hovered = false
    let focused = false
    let intensity = 0
    let x = 22
    let y = 18
    let targetX = x
    let targetY = y

    function glow(cx: number, cy: number, radius: number, alpha: number) {
      const gradient = context!.createRadialGradient(cx, cy, 0, cx, cy, radius)
      gradient.addColorStop(0, `rgba(225,232,245,${alpha})`)
      gradient.addColorStop(0.4, `rgba(135,145,164,${alpha * 0.4})`)
      gradient.addColorStop(1, 'rgba(135,145,164,0)')
      context!.fillStyle = gradient
      context!.fillRect(0, 0, size, size)
    }

    function paint(time: number) {
      context!.fillStyle = '#000'
      context!.fillRect(0, 0, size, size)
      // Slow, overlapping reflections keep the tile black rather than flashing white.
      glow(22 + Math.cos(time * 0.65) * 24, 22 + Math.sin(time * 0.53) * 24, 28, 0.14)
      glow(22 + Math.sin(time * 0.43) * 22, 22 + Math.cos(time * 0.59) * 22, 20, 0.09)
      if (intensity > 0.001) glow(x, y, 25, intensity * 0.32)
    }

    function tick(now: number) {
      frame = 0
      if (!visible || document.hidden || motion.matches) return
      const dt = previous ? Math.min((now - previous) / 1000, 0.05) : 1 / 60
      previous = now
      elapsed += dt
      const ease = 1 - Math.exp(-12 * dt)
      intensity += ((hovered || focused ? 1 : 0) - intensity) * ease
      x += (targetX - x) * ease
      y += (targetY - y) * ease
      paint(elapsed)
      frame = requestAnimationFrame(tick)
    }

    function syncPlayback() {
      cancelAnimationFrame(frame)
      frame = 0
      previous = 0
      if (motion.matches) {
        intensity = 0
        paint(0)
      } else if (visible && !document.hidden) frame = requestAnimationFrame(tick)
    }

    function onPointerMove(event: PointerEvent) {
      if (event.pointerType === 'touch') return
      const rect = link!.getBoundingClientRect()
      targetX = (event.clientX - rect.left) / rect.width * size
      targetY = (event.clientY - rect.top) / rect.height * size
      hovered = true
    }
    function onPointerLeave() { hovered = false }
    function onFocus() { focused = true; targetX = 22; targetY = 14 }
    function onBlur() { focused = false; hovered = false }

    const observer = 'IntersectionObserver' in window ? new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      syncPlayback()
    }) : undefined
    paint(0)
    if (observer) observer.observe(link)
    else { visible = true; syncPlayback() }
    link.addEventListener('pointermove', onPointerMove)
    link.addEventListener('pointerleave', onPointerLeave)
    link.addEventListener('pointercancel', onPointerLeave)
    link.addEventListener('focus', onFocus)
    link.addEventListener('blur', onBlur)
    document.addEventListener('visibilitychange', syncPlayback)
    motion.addEventListener('change', syncPlayback)
    return () => {
      cancelAnimationFrame(frame)
      observer?.disconnect()
      link.removeEventListener('pointermove', onPointerMove)
      link.removeEventListener('pointerleave', onPointerLeave)
      link.removeEventListener('pointercancel', onPointerLeave)
      link.removeEventListener('focus', onFocus)
      link.removeEventListener('blur', onBlur)
      document.removeEventListener('visibilitychange', syncPlayback)
      motion.removeEventListener('change', syncPlayback)
    }
  }, [])

  return (
    <a ref={linkRef} className="footer-expo-logo" href="#main-content" aria-label="Back to main content">
      <canvas ref={canvasRef} aria-hidden="true" />
      <svg viewBox="0 0 20 20" aria-hidden="true" fill="white">
        <path d="M9.477 7.638c.164-.24.343-.27.488-.27.145 0 .387.03.551.27 2.13 2.901 6.55 10.56 6.959 10.976.605.618 1.436.233 1.918-.468.475-.69.607-1.174.607-1.69 0-.352-6.883-13.05-7.576-14.106-.667-1.017-.884-1.274-2.025-1.274h-.854c-1.138 0-1.302.257-1.969 1.274C6.883 3.406 0 16.104 0 16.456c0 .517.132 1 .607 1.69.482.7 1.313 1.086 1.918.468.41-.417 4.822-8.075 6.952-10.977z" />
      </svg>
      <span className="footer-expo-logo__rim" aria-hidden="true" />
    </a>
  )
}

import { useEffect, useRef } from 'react'
import './FooterLogo.css'

const EXPO_PATH =
  'M9.477 7.638c.164-.24.343-.27.488-.27.145 0 .387.03.551.27 2.13 2.901 6.55 10.56 6.959 10.976.605.618 1.436.233 1.918-.468.475-.69.607-1.174.607-1.69 0-.352-6.883-13.05-7.576-14.106-.667-1.017-.884-1.274-2.025-1.274h-.854c-1.138 0-1.302.257-1.969 1.274C6.883 3.406 0 16.104 0 16.456c0 .517.132 1 .607 1.69.482.7 1.313 1.086 1.918.468.41-.417 4.822-8.075 6.952-10.977z'

type RGB = readonly [number, number, number]

function smoothstep(start: number, end: number, value: number) {
  const amount = Math.max(
    0,
    Math.min(1, (value - start) / (end - start)),
  )

  return amount * amount * (3 - 2 * amount)
}

function createSpectrum(): RGB[] {
  return Array.from({ length: 360 }, (_, hue): RGB => {
    const sector = hue / 60
    const secondary = 1 - Math.abs((sector % 2) - 1)

    let channels: RGB

    if (sector < 1) {
      channels = [1, secondary, 0]
    } else if (sector < 2) {
      channels = [secondary, 1, 0]
    } else if (sector < 3) {
      channels = [0, 1, secondary]
    } else if (sector < 4) {
      channels = [0, secondary, 1]
    } else if (sector < 5) {
      channels = [secondary, 0, 1]
    } else {
      channels = [1, 0, secondary]
    }

    return [
      Math.round(channels[0] * 255),
      Math.round(channels[1] * 255),
      Math.round(channels[2] * 255),
    ]
  })
}

const SPECTRUM = createSpectrum()
const BLACK: RGB = [0, 0, 0]

function getColor(hue: number): RGB {
  const index = ((Math.floor(hue) % 360) + 360) % 360
  return SPECTRUM[index] ?? BLACK
}

export default function FooterLogo() {
  const linkRef = useRef<HTMLAnchorElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const link = linkRef.current
    const canvas = canvasRef.current

    if (!link || !canvas) return

    const context = canvas.getContext('2d')

    if (!context) return

    const size = 44
    const resolution = 88
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2)

    canvas.width = Math.round(size * pixelRatio)
    canvas.height = Math.round(size * pixelRatio)

    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)

    const texture = document.createElement('canvas')

    texture.width = resolution
    texture.height = resolution

    const textureContext = texture.getContext('2d')

    if (!textureContext) return

    const pixels = textureContext.createImageData(
      resolution,
      resolution,
    )

    const motion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    )

    let frame = 0
    let lastTime: number | null = null
    let elapsed = 1.1
    let visible = false
    let pointerInside = false
    let focused = false

    function paint(time: number) {
      if (!context || !textureContext) return

      const t = time * 0.85

      const angle = -0.55 + Math.sin(t * 0.57) * 0.65
      const cosine = Math.cos(angle)
      const sine = Math.sin(angle)

      const widthA =
        0.035 +
        0.2 * (0.5 + 0.5 * Math.sin(t * 1.3 - 0.8))

      const widthB =
        0.025 +
        0.11 * (0.5 + 0.5 * Math.cos(t * 1.7))

      for (let y = 0; y < resolution; y++) {
        for (let x = 0; x < resolution; x++) {
          const px = (x / (resolution - 1)) * 2 - 1
          const py = (y / (resolution - 1)) * 2 - 1

          const u = px * cosine - py * sine
          const v = px * sine + py * cosine

          const curveA =
            Math.sin(u * 2.4 + t * 1.5) * 0.33 +
            Math.sin(u * 4.1 - t * 0.8) * 0.12 +
            Math.sin(t * 0.9) * 0.72

          const curveB =
            Math.sin(v * 2.8 - t * 1.2) * 0.34 +
            Math.cos(v * 4.7 + t * 0.6) * 0.13 +
            Math.cos(t * 0.73 + 1.2) * 0.85

          const distanceA = (v - curveA) / widthA
          const distanceB = (u - curveB) / widthB

          const strengthA =
            1 -
            smoothstep(0.55, 1.05, Math.abs(distanceA))

          const strengthB =
            (1 -
              smoothstep(0.5, 1.1, Math.abs(distanceB))) *
            0.9

          const hueA =
            210 + distanceA * 145 + u * 35 - t * 45

          const hueB =
            30 + distanceB * 160 - v * 45 + t * 35

          const colorA = getColor(hueA)
          const colorB = getColor(hueB)

          const offset = (y * resolution + x) * 4

          pixels.data[offset] = Math.min(
            255,
            colorA[0] * strengthA + colorB[0] * strengthB,
          )

          pixels.data[offset + 1] = Math.min(
            255,
            colorA[1] * strengthA + colorB[1] * strengthB,
          )

          pixels.data[offset + 2] = Math.min(
            255,
            colorA[2] * strengthA + colorB[2] * strengthB,
          )

          pixels.data[offset + 3] = 255
        }
      }

      textureContext.putImageData(pixels, 0, 0)

      context.imageSmoothingEnabled = true
      context.clearRect(0, 0, size, size)
      context.drawImage(texture, 0, 0, size, size)
    }

    function tick(now: number) {
      frame = 0

      if (!visible || document.hidden || motion.matches) {
        return
      }

      const delta =
        lastTime === null
          ? 0
          : Math.min((now - lastTime) / 1000, 0.05)

      lastTime = now

      const active = pointerInside || focused
      elapsed += delta * (active ? 1.25 : 1)

      paint(elapsed)

      frame = window.requestAnimationFrame(tick)
    }

    function syncPlayback() {
      window.cancelAnimationFrame(frame)

      frame = 0
      lastTime = null

      if (motion.matches) {
        paint(1.1)
        return
      }

      if (visible && !document.hidden) {
        frame = window.requestAnimationFrame(tick)
      }
    }

    function handlePointerEnter() {
      pointerInside = true
    }

    function handlePointerLeave() {
      pointerInside = false
    }

    function handleFocus() {
      focused = true
    }

    function handleBlur() {
      focused = false
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]

        visible = entry?.isIntersecting ?? false
        syncPlayback()
      },
      { threshold: 0.1 },
    )

    paint(elapsed)
    observer.observe(link)

    link.addEventListener('pointerenter', handlePointerEnter)
    link.addEventListener('pointerleave', handlePointerLeave)
    link.addEventListener('pointercancel', handlePointerLeave)
    link.addEventListener('focus', handleFocus)
    link.addEventListener('blur', handleBlur)

    document.addEventListener('visibilitychange', syncPlayback)
    motion.addEventListener('change', syncPlayback)

    return () => {
      window.cancelAnimationFrame(frame)
      observer.disconnect()

      link.removeEventListener('pointerenter', handlePointerEnter)
      link.removeEventListener('pointerleave', handlePointerLeave)
      link.removeEventListener('pointercancel', handlePointerLeave)
      link.removeEventListener('focus', handleFocus)
      link.removeEventListener('blur', handleBlur)

      document.removeEventListener(
        'visibilitychange',
        syncPlayback,
      )

      motion.removeEventListener('change', syncPlayback)
    }
  }, [])

  return (
    <a
      ref={linkRef}
      className="footer-expo-logo"
      href="#main-content"
      aria-label="Back to main content"
    >
      <canvas ref={canvasRef} aria-hidden="true" />

      <svg
        className="footer-expo-logo__mark"
        viewBox="0 2 20 17"
        aria-hidden="true"
        focusable="false"
      >
        <path fill="#ffffff" d={EXPO_PATH} />
      </svg>

      <span
        className="footer-expo-logo__rim"
        aria-hidden="true"
      />
    </a>
  )
}
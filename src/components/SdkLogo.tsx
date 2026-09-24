import { useEffect, useId, useRef, useState } from 'react'
import { LiquidMetal } from '@paper-design/shaders-react'
import './SdkLogo.css'

const LOGO_PATH =
  'M9.477 7.638c.164-.24.343-.27.488-.27.145 0 .387.03.551.27 2.13 2.901 6.55 10.56 6.959 10.976.605.618 1.436.233 1.918-.468.475-.69.607-1.174.607-1.69 0-.352-6.883-13.05-7.576-14.106-.667-1.017-.884-1.274-2.025-1.274h-.854c-1.138 0-1.302.257-1.969 1.274C6.883 3.406 0 16.104 0 16.456c0 .517.132 1 .607 1.69.482.7 1.313 1.086 1.918.468.41-.417 4.822-8.075 6.952-10.977z'

// Transparent SVG used as the shader's shape mask.
const LOGO_IMAGE = `data:image/svg+xml,${encodeURIComponent(`
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="512"
    height="512"
    viewBox="0 0 20 20"
  >
    <path fill="white" d="${LOGO_PATH}" />
  </svg>
`)}`

export default function SdkLogo() {
  const id = useId().replace(/:/g, '')
  const rootRef = useRef<HTMLDivElement>(null)

  const [supported, setSupported] = useState(false)
  const [running, setRunning] = useState(false)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    // Keep the SVG fallback when WebGL is unavailable.
    const probe = document.createElement('canvas')
    let available = false

    try {
      const context = probe.getContext('webgl2')
      available = Boolean(context)

      context?.getExtension('WEBGL_lose_context')?.loseContext()
    } catch {
      available = false
    }

    setSupported(available)
    if (!available) return

    const motion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    )

    let inView = false

    const updatePlayback = () => {
      setRunning(
        inView &&
          !document.hidden &&
          !motion.matches,
      )
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting
        updatePlayback()
      },
      { threshold: 0.1 },
    )

    observer.observe(root)

    document.addEventListener(
      'visibilitychange',
      updatePlayback,
    )

    motion.addEventListener('change', updatePlayback)

    return () => {
      observer.disconnect()

      document.removeEventListener(
        'visibilitychange',
        updatePlayback,
      )

      motion.removeEventListener('change', updatePlayback)
    }
  }, [])

  return (
    <div
      ref={rootRef}
      className="sdk-metal-logo"
      aria-hidden="true"
    >
      {/* Visible while the shader loads, or without WebGL. */}
      <svg
        className="sdk-metal-logo__fallback"
        viewBox="0 0 20 20"
        focusable="false"
      >
        <defs>
          <linearGradient
            id={`${id}-base`}
            x1="8%"
            y1="92%"
            x2="88%"
            y2="6%"
          >
            <stop offset="0%" stopColor="#3d4652" />
            <stop offset="32%" stopColor="#b5bcc7" />
            <stop offset="58%" stopColor="#f7f8fb" />
            <stop offset="100%" stopColor="#d8dee8" />
          </linearGradient>

          <linearGradient
            id={`${id}-shadow`}
            x1="0%"
            y1="70%"
            x2="100%"
            y2="30%"
          >
            <stop
              offset="0%"
              stopColor="#111827"
              stopOpacity="0.78"
            />
            <stop
              offset="38%"
              stopColor="#111827"
              stopOpacity="0.18"
            />
            <stop
              offset="100%"
              stopColor="#111827"
              stopOpacity="0"
            />
          </linearGradient>

          <radialGradient
            id={`${id}-shine`}
            cx="58%"
            cy="27%"
            r="58%"
          >
            <stop
              offset="0%"
              stopColor="#ffffff"
              stopOpacity="0.75"
            />
            <stop
              offset="52%"
              stopColor="#ffffff"
              stopOpacity="0.22"
            />
            <stop
              offset="100%"
              stopColor="#ffffff"
              stopOpacity="0"
            />
          </radialGradient>
        </defs>

        <path d={LOGO_PATH} fill={`url(#${id}-base)`} />
        <path d={LOGO_PATH} fill={`url(#${id}-shadow)`} />
        <path d={LOGO_PATH} fill={`url(#${id}-shine)`} />
      </svg>

      {supported && (
        <LiquidMetal
          className="sdk-metal-logo__shader"
          image={LOGO_IMAGE}
          width="100%"
          height="100%"
          colorBack="#00000000"
          colorTint="#ffffff"
          shape="none"
          fit="contain"
          scale={1}
          rotation={0}
          offsetX={0}
          offsetY={0}
          repetition={2}
          softness={0.1}
          shiftRed={0.3}
          shiftBlue={0.3}
          distortion={0.07}
          contour={0.4}
          angle={70}
          speed={running ? 1 : 0}
          frame={0}
          minPixelRatio={1.5}
          maxPixelCount={262144}
        />
      )}
    </div>
  )
}
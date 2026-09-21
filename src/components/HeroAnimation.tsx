import { useEffect, useId, useRef } from 'react'
import type { PointerEvent } from 'react'
import HeroRays from './HeroRays'
import './HeroAnimation.css'

const LOGO_PATH =
  'M217.896 0H183.933C168.254 0 153.881 8.73298 146.657 22.6483L2.69936 299.945C-0.642955 306.383 -0.894049 313.987 2.01629 320.632L13.936 347.845C21.3533 364.78 44.7068 366.486 54.5066 350.809L190.969 132.512C193.112 129.083 196.871 127 200.914 127C204.958 127 208.716 129.083 210.86 132.512L347.322 350.809C357.122 366.486 380.475 364.78 387.893 347.845L399.812 320.632C402.723 313.987 402.472 306.383 399.129 299.945L255.172 22.6483C247.948 8.73298 233.575 0 217.896 0Z'

// Stable values keep the graphic consistent between renders.
function noise(seed: number) {
  const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453
  return value - Math.floor(value)
}

const rays = Array.from({ length: 220 }, (_, index) => {
  const layer = index % 3

  return {
    id: index,
    angle: (index / 220) * 360 + noise(index + 1) * 3,
    length: 210 + layer * 80 + noise(index + 5) * 100,
    radius: 1.7 + noise(index + 9) * 1.7,
    opacity: [0.08, 0.13, 0.19][layer],
    delay: 1.05 + noise(index + 13) * 0.65,
    duration: 9 + noise(index + 17) * 11,
    phase: -noise(index + 21) * 20,
  }
})

// A rounded square with the soft corners used by the reference.
const platePath =
  Array.from({ length: 181 }, (_, index) => {
    const angle = (index / 180) * Math.PI * 2
    const cosine = Math.cos(angle)
    const sine = Math.sin(angle)

    const x = Math.sign(cosine) * Math.abs(cosine) ** 0.4 * 148
    const y = Math.sign(sine) * Math.abs(sine) ** 0.4 * 148

    return `${index === 0 ? 'M' : 'L'}${x.toFixed(2)} ${y.toFixed(2)}`
  }).join(' ') + ' Z'

export default function HeroAnimation() {
  const id = useId().replace(/:/g, '')

  const svgRef = useRef<SVGSVGElement>(null)
  const plateRef = useRef<SVGGElement>(null)
  const beamRef = useRef<SVGRadialGradientElement>(null)
  const shadeRef = useRef<SVGPathElement>(null)

  // Pause the animation while it is outside the screen or in a hidden tab.
  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return

    let visible = true

    const syncPlayback = () => {
      svg.dataset.paused = String(!visible || document.hidden)
    }

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      syncPlayback()
    })

    observer.observe(svg)
    document.addEventListener('visibilitychange', syncPlayback)
    syncPlayback()

    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', syncPlayback)
    }
  }, [])

  function clearHighlight() {
    if (shadeRef.current) {
      shadeRef.current.style.opacity = '0'
    }
  }

  function moveHighlight(event: PointerEvent<SVGSVGElement>) {
    const matrix = plateRef.current?.getScreenCTM()
    const beam = beamRef.current
    const shade = shadeRef.current

    if (!matrix || !beam || !shade) return

    // Convert browser coordinates into the logo plate's coordinates.
    const point = new DOMPoint(
      event.clientX,
      event.clientY,
    ).matrixTransform(matrix.inverse())

    const inside =
      Math.abs(point.x / 148) ** 5 +
        Math.abs(point.y / 148) ** 5 <=
      1

    if (!inside) {
      clearHighlight()
      return
    }

    beam.setAttribute('cx', point.x.toFixed(1))
    beam.setAttribute('cy', point.y.toFixed(1))
    shade.style.opacity = '0.14'
  }

  return (
    <svg
      ref={svgRef}
      className="hero-graphic hero-animation"
      viewBox="-590 -590 1180 1180"
      fill="none"
      aria-hidden="true"
      onPointerMove={moveHighlight}
      onPointerDown={moveHighlight}
      onPointerLeave={clearHighlight}
      onPointerCancel={clearHighlight}
      onPointerUp={(event) => {
        if (event.pointerType !== 'mouse') clearHighlight()
      }}
    >
      <defs>
        <radialGradient
          id={`${id}-threads`}
          gradientUnits="userSpaceOnUse"
          cx="0"
          cy="0"
          r="560"
        >
          <stop offset="0" stopColor="#60646c" />
          <stop offset="0.3" stopColor="#60646c" stopOpacity="0.9" />
          <stop offset="0.7" stopColor="#60646c" stopOpacity="0.5" />
          <stop offset="1" stopColor="#60646c" stopOpacity="0.12" />
        </radialGradient>

        <pattern
          id={`${id}-dots`}
          width="10"
          height="10"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="5" cy="5" r="3.6" fill="#000000" />
        </pattern>

        <radialGradient
          ref={beamRef}
          id={`${id}-beam`}
          gradientUnits="userSpaceOnUse"
          cx="0"
          cy="0"
          r="135"
        >
          <stop offset="0" stopColor="#000000" />
          <stop offset="0.2" stopColor="#060606" />
          <stop offset="0.48" stopColor="#4e4e4e" />
          <stop offset="0.74" stopColor="#b4b4b4" />
          <stop offset="1" stopColor="#ffffff" />
        </radialGradient>

        <mask
          id={`${id}-shade`}
          maskUnits="userSpaceOnUse"
          x="-150"
          y="-150"
          width="300"
          height="300"
        >
          <rect
            x="-150"
            y="-150"
            width="300"
            height="300"
            fill={`url(#${id}-beam)`}
          />
        </mask>
      </defs>

      <rect
        x="-590"
        y="-590"
        width="1180"
        height="1180"
        fill="transparent"
      />

    <HeroRays
        rays={rays}
        gradientId={`${id}-threads`}
    />

      <g ref={plateRef} className="hero-logo-plate">
        <path
          d={platePath}
          fill="#ffffff"
          stroke="#e3e5e8"
          strokeWidth="1.5"
        />

        <path
          ref={shadeRef}
          className="hero-logo-shade"
          d={platePath}
          fill="#7e8794"
          mask={`url(#${id}-shade)`}
        />

        <g transform="scale(0.4428) translate(-201 -181)">
          <path
            className="hero-logo-dots"
            d={LOGO_PATH}
            fill={`url(#${id}-dots)`}
          />

          <path
            className="hero-logo-solid"
            d={LOGO_PATH}
            fill="#000000"
          />
        </g>
      </g>
    </svg>
  )
}
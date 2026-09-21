import { useEffect, useRef } from 'react'

type Ray = {
  id: number
  angle: number
  length: number
  radius: number
  delay: number
  duration: number
  phase: number
}

type HeroRaysProps = {
  rays: readonly Ray[]
  gradientId: string
}

const POINTER_RADIUS = 150
const POINTER_FORCE = 75
const SPRING_STRENGTH = 110
const SPRING_DAMPING = 17

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function easeOutCubic(value: number) {
  return 1 - (1 - value) ** 3
}

export default function HeroRays({
  rays,
  gradientId,
}: HeroRaysProps) {
  const groupRef = useRef<SVGGElement>(null)

  useEffect(() => {
    const group = groupRef.current
    const svg = group?.ownerSVGElement

    if (!group || !svg) return

    const paths = Array.from(
      group.querySelectorAll<SVGPathElement>('path'),
    )

    const dots = Array.from(
      group.querySelectorAll<SVGCircleElement>('circle'),
    )

    const motionPreference = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    )

    const particles = rays.map((ray) => {
      const angle = (ray.angle * Math.PI) / 180

      return {
        ...ray,
        baseAngle: angle,
        x: Math.cos(angle) * ray.length * 0.13,
        y: Math.sin(angle) * ray.length * 0.13,
        vx: 0,
        vy: 0,
      }
    })

    const pointer = {
      x: 0,
      y: 0,
      active: false,
      strength: 0,
    }

    let frameId = 0
    let elapsed = 0
    let previousTime: number | null = null
    let visible = true

    function clearPointer() {
      pointer.active = false
    }

    function movePointer(event: PointerEvent) {
      if (motionPreference.matches) return

      const matrix = svg!.getScreenCTM()
      if (!matrix) return

      const point = new DOMPoint(
        event.clientX,
        event.clientY,
      ).matrixTransform(matrix.inverse())

      pointer.x = point.x
      pointer.y = point.y
      pointer.active = true
    }

    function releasePointer(event: PointerEvent) {
      if (event.pointerType !== 'mouse') {
        clearPointer()
      }
    }

    function paint(
      time: number,
      delta: number,
      still = false,
    ) {
      const segments = ['', '', '']

      const pointerTarget = pointer.active ? 1 : 0
      const pointerEase = 1 - Math.exp(-8 * delta)

      pointer.strength = still
        ? 0
        : pointer.strength +
          (pointerTarget - pointer.strength) * pointerEase

      particles.forEach((particle, index) => {
        const progress = still
          ? 1
          : clamp((time - particle.delay) / 2.4, 0, 1)

        const growth = easeOutCubic(progress)
        const speed = (Math.PI * 2) / particle.duration

        // Each ray has its own continuous idle movement.
        const angle =
          particle.baseAngle +
          (still
            ? 0
            : Math.sin(
                time * speed * 0.8 + particle.phase,
              ) * 0.022)

        const radialWave = still
          ? 0
          : Math.sin(time * speed + particle.phase) * 16 +
            Math.sin(
              time * speed * 1.9 + particle.phase * 0.4,
            ) * 7

        const radius =
          particle.length * (0.13 + growth * 0.87) +
          radialWave * growth

        let targetX = Math.cos(angle) * radius
        let targetY = Math.sin(angle) * radius

        if (
          !still &&
          growth > 0.7 &&
          radius > 185 &&
          pointer.strength > 0.001
        ) {
          // Find the closest point on the visible part of the ray.
          // This responds along the line, not only at its endpoint.
          const projection = clamp(
            (pointer.x * targetX + pointer.y * targetY) /
              (radius * radius),
            Math.min(185 / radius, 1),
            1,
          )

          const closestX = targetX * projection
          const closestY = targetY * projection

          const dx = closestX - pointer.x
          const dy = closestY - pointer.y
          const distance = Math.hypot(dx, dy)

          if (distance < POINTER_RADIUS) {
            const influence =
              (1 - distance / POINTER_RADIUS) ** 2

            const force =
              influence * POINTER_FORCE * pointer.strength

            const directionX =
              distance > 0.01
                ? dx / distance
                : -Math.sin(angle)

            const directionY =
              distance > 0.01
                ? dy / distance
                : Math.cos(angle)

            targetX += directionX * force
            targetY += directionY * force
          }
        }

        if (still) {
          particle.x = targetX
          particle.y = targetY
          particle.vx = 0
          particle.vy = 0
        } else {
          // Spring motion gives the rays a soft response and return.
          particle.vx +=
            ((targetX - particle.x) * SPRING_STRENGTH -
              particle.vx * SPRING_DAMPING) *
            delta

          particle.vy +=
            ((targetY - particle.y) * SPRING_STRENGTH -
              particle.vy * SPRING_DAMPING) *
            delta

          particle.x += particle.vx * delta
          particle.y += particle.vy * delta
        }

        const x = particle.x.toFixed(2)
        const y = particle.y.toFixed(2)

        segments[index % 3] += `M0 0L${x} ${y}`

        const dotOpacity = still
          ? 0.9
          : growth *
            (0.7 +
              Math.sin(time * 0.9 + particle.phase) ** 2 *
                0.3)

        dots[index].setAttribute('cx', x)
        dots[index].setAttribute('cy', y)
        dots[index].setAttribute(
          'opacity',
          dotOpacity.toFixed(3),
        )
      })

      paths.forEach((path, index) => {
        path.setAttribute('d', segments[index])
      })

      group!.setAttribute(
        'opacity',
        still ? '1' : clamp(time / 0.6, 0, 1).toFixed(3),
      )
    }

    function tick(now: number) {
      frameId = 0

      if (
        !visible ||
        document.hidden ||
        motionPreference.matches
      ) {
        return
      }

      const delta =
        previousTime === null
          ? 1 / 60
          : Math.min((now - previousTime) / 1000, 1 / 30)

      previousTime = now
      elapsed += delta

      paint(elapsed, delta)
      frameId = requestAnimationFrame(tick)
    }

    function syncPlayback() {
      cancelAnimationFrame(frameId)
      frameId = 0
      previousTime = null

      if (motionPreference.matches) {
        clearPointer()
        elapsed = Math.max(elapsed, 5)
        paint(0, 0, true)
        return
      }

      if (visible && !document.hidden) {
        frameId = requestAnimationFrame(tick)
      }
    }

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting

      if (!visible) clearPointer()
      syncPlayback()
    })

    svg.addEventListener('pointermove', movePointer)
    svg.addEventListener('pointerleave', clearPointer)
    svg.addEventListener('pointercancel', clearPointer)
    svg.addEventListener('pointerup', releasePointer)

    window.addEventListener('blur', clearPointer)
    document.addEventListener('visibilitychange', syncPlayback)
    motionPreference.addEventListener('change', syncPlayback)

    paint(0, 0, motionPreference.matches)
    observer.observe(svg)
    syncPlayback()

    return () => {
      cancelAnimationFrame(frameId)
      observer.disconnect()

      svg.removeEventListener('pointermove', movePointer)
      svg.removeEventListener('pointerleave', clearPointer)
      svg.removeEventListener('pointercancel', clearPointer)
      svg.removeEventListener('pointerup', releasePointer)

      window.removeEventListener('blur', clearPointer)
      document.removeEventListener(
        'visibilitychange',
        syncPlayback,
      )
      motionPreference.removeEventListener(
        'change',
        syncPlayback,
      )
    }
  }, [rays])

  return (
    <g ref={groupRef} opacity="0">
      <g
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeLinecap="round"
      >
        <path strokeWidth="0.8" strokeOpacity="0.08" />
        <path strokeWidth="1" strokeOpacity="0.13" />
        <path strokeWidth="1.2" strokeOpacity="0.19" />
      </g>

      <g fill="#60646c" fillOpacity="0.65">
        {rays.map((ray) => (
          <circle key={ray.id} r={ray.radius} />
        ))}
      </g>
    </g>
  )
}
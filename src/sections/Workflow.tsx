import { Fragment, useEffect, useId, useRef, useState } from 'react'
import WorkflowVisual from '../components/WorkFlowVisual'
import type { WorkflowStage } from '../components/WorkFlowVisual'
import './Workflow.css'

const AUTOPLAY_MS = 6000

const steps: {
  id: WorkflowStage
  title: string
  description: string
}[] = [
  {
    id: 'develop',
    title: 'Develop',
    description:
      'Turn an idea into a native app using Expo’s development tools. Preview changes on a phone and keep your team working from the same project.',
  },
  {
    id: 'test',
    title: 'Test',
    description:
      'Check important user journeys on cloud devices. Run repeatable checks as your code changes, and catch problems before a release reaches your users.',
  },
  {
    id: 'deploy',
    title: 'Deploy',
    description:
      'Deliver new versions to iOS, Android, and the web. Coordinate releases and send compatible updates without rebuilding the entire app.',
  },
  {
    id: 'monitor',
    title: 'Monitor',
    description:
      'Follow stability, performance, and release adoption after launch. Use production insights to decide what to improve next.',
  },
]

export default function Workflow() {
  const id = useId()

  const sectionRef = useRef<HTMLElement>(null)
  const ringRef = useRef<SVGCircleElement>(null)
  const progressRef = useRef(0)

  const [active, setActive] = useState(0)
  const [inView, setInView] = useState(false)
  const [pageVisible, setPageVisible] = useState(
    () => !document.hidden,
  )

  const [reducedMotion, setReducedMotion] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  const [playing, setPlaying] = useState(() => !reducedMotion)

  const running =
    playing && inView && pageVisible && !reducedMotion

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.15 },
    )

    const preference = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    )

    function handleVisibility() {
      setPageVisible(!document.hidden)
    }

    function handleMotion(event: MediaQueryListEvent) {
      setReducedMotion(event.matches)

      if (event.matches) {
        setPlaying(false)
      }
    }

    observer.observe(section)
    document.addEventListener('visibilitychange', handleVisibility)
    preference.addEventListener('change', handleMotion)

    return () => {
      observer.disconnect()
      document.removeEventListener(
        'visibilitychange',
        handleVisibility,
      )
      preference.removeEventListener('change', handleMotion)
    }
  }, [])

  useEffect(() => {
    if (!running) return

    let frameId = 0
    let previousTime = performance.now()

    function tick(now: number) {
      const delta = Math.min(now - previousTime, 100)
      previousTime = now

      progressRef.current += delta / AUTOPLAY_MS

      if (progressRef.current >= 1) {
        progressRef.current = 0
        setActive((current) => (current + 1) % steps.length)
      }

      if (ringRef.current) {
        ringRef.current.style.strokeDashoffset = String(
          1 - progressRef.current,
        )
      }

      frameId = requestAnimationFrame(tick)
    }

    frameId = requestAnimationFrame(tick)

    return () => cancelAnimationFrame(frameId)
  }, [running])

  function selectStep(index: number) {
    setActive(index)
    setPlaying(false)
    progressRef.current = 0

    if (ringRef.current) {
      ringRef.current.style.strokeDashoffset = '1'
    }
  }

  return (
    <section
      ref={sectionRef}
      className="workflow"
      aria-labelledby={`${id}-heading`}
    >
      <h2 id={`${id}-heading`} className="workflow__heading">
        Building blocks
        <br />
        for agentic workflows
      </h2>

      <div className="workflow__art">
        <WorkflowVisual
          active={steps[active].id}
          running={inView && pageVisible && !reducedMotion}
        />
      </div>

      <div className="workflow__options">
        <button
          type="button"
          className="workflow__playback"
          style={{
            gridRow: active * 2 + 1,
            marginTop: active === 0 ? 0 : 16,
          }}
          onClick={() => setPlaying((current) => !current)}
          disabled={reducedMotion}
          aria-label={playing ? 'Pause autoplay' : 'Resume autoplay'}
          title={
            reducedMotion
              ? 'Reduced motion is enabled'
              : playing
                ? 'Pause autoplay'
                : 'Resume autoplay'
          }
        >
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="#dedfe4"
              strokeWidth="2"
            />

            <circle
              ref={ringRef}
              cx="12"
              cy="12"
              r="10"
              pathLength="1"
              stroke="#1687d3"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="1"
              strokeDashoffset="1"
              transform="rotate(-90 12 12)"
            />

            {playing ? (
              <g fill="currentColor">
                <rect x="8" y="7.5" width="2.8" height="9" rx="1" />
                <rect x="13.2" y="7.5" width="2.8" height="9" rx="1" />
              </g>
            ) : (
              <path d="M9 7L17 12L9 17Z" fill="currentColor" />
            )}
          </svg>
        </button>

        {steps.map((step, index) => {
          const selected = active === index

          return (
            <Fragment key={step.id}>
              <button
                id={`${id}-${step.id}-button`}
                type="button"
                className={`workflow__option ${
                  selected ? 'is-active' : ''
                }`}
                style={{
                  gridRow: index * 2 + 1,
                  gridColumn: selected ? '1' : '1 / -1',
                  marginTop: index === 0 ? 0 : 16,
                }}
                aria-expanded={selected}
                aria-controls={`${id}-${step.id}-description`}
                onClick={() => selectStep(index)}
              >
                {step.title}
              </button>

              <div
                id={`${id}-${step.id}-description`}
                className={`workflow__description ${
                  selected ? 'is-active' : ''
                }`}
                style={{ gridRow: index * 2 + 2 }}
                role="region"
                aria-labelledby={`${id}-${step.id}-button`}
                aria-hidden={!selected}
              >
                <div>
                  <p>{step.description}</p>
                </div>
              </div>
            </Fragment>
          )
        })}
      </div>
    </section>
  )
}
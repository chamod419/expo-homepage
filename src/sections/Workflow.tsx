import { Fragment, useEffect, useId, useRef, useState } from 'react'
import WorkflowVisual from '../components/WorkflowVisual'
import type { WorkflowStage } from '../components/WorkflowVisual'
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
      'Build beautiful apps anywhere powered by Expo’s CLI, Skills, and MCP. Test on your device with Expo Go, validate with Simulators, distribute with Launch or Builds.',
  },
  {
    id: 'test',
    title: 'Test',
    description:
      'Find what breaks before your users do. Cloud simulators and device infrastructure for your team and your agents. Workflows runs your test suites on every change, starting from ready-made templates.',
  },
  {
    id: 'deploy',
    title: 'Deploy',
    description:
      'Deploy to TestFlight and the app stores for native releases, Update for everything after, with channels and rollouts you control.',
  },
  {
    id: 'monitor',
    title: 'Monitor',
    description:
      'See how the app behaves in production. Observe surfaces crash information, performance metrics, and Update adoption, and Update ships the fix if something breaks.',
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
        setPlaying(!reducedMotion)
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
          running={running}
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
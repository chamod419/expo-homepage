import { useId, useLayoutEffect, useMemo, useRef } from 'react'
import developSvg from '../assets/workflow/develop.svg?raw'
import testSvg from '../assets/workflow/test.svg?raw'
import deploySvg from '../assets/workflow/deploy.svg?raw'
import monitorSvg from '../assets/workflow/monitor.svg?raw'
import './WorkflowVisual.css'

export type WorkflowStage = 'develop' | 'test' | 'deploy' | 'monitor'

const STAGES: WorkflowStage[] = ['develop', 'test', 'deploy', 'monitor']

const ARTWORK: Record<WorkflowStage, string> = {
  develop: developSvg,
  test: testSvg,
  deploy: deploySvg,
  monitor: monitorSvg,
}

function applyWorkflowTheme(svg: string): string {
  const colors: Record<string, string> = {
    '#fff': 'var(--art-surface)',
    '#ffffff': 'var(--art-surface)',
    '#1c2024': 'var(--art-ink)',
    '#f9f9fb': 'var(--art-subtle)',
    '#f0f0f3': 'var(--art-panel)',
    '#e8e8ec': 'var(--art-fill)',
    '#d9d9e0': 'var(--art-shadow)',
    '#b9bbc6': 'var(--art-edge)',
    '#8b8d98': 'var(--art-muted)',
    '#0d74ce': 'var(--art-blue)',
    '#0588f0': 'var(--art-blue-bright)',
    '#8ec8f6': 'var(--art-blue-soft)',
    '#c2e5ff': 'var(--art-blue-pale)',
  }

  return svg.replace(
    /\b(fill|stroke|stop-color)=["'](#[0-9a-fA-F]{3,8})["']/g,
    (original: string, attribute: string, value: string) => {
      const color = value.toLowerCase()

      // Keep white line icons on blue shapes white.
      if (
        attribute === 'stroke' &&
        (color === '#fff' || color === '#ffffff')
      ) {
        return original
      }

      const replacement = colors[color]

      return replacement
        ? `${attribute}="${replacement}"`
        : original
    },
  )
}

// Keep gradient and clip-path IDs unique when this component is reused.
function scopeSvgIds(svg: string, prefix: string) {
  return svg
    .replace(/\bid="([^"]+)"/g, (_, id: string) => `id="${prefix}-${id}"`)
    .replace(/url\(#([^)]+)\)/g, (_, id: string) => `url(#${prefix}-${id})`)
    .replace(
      /\b(xlink:href|href)="#([^"]+)"/g,
      (_, name: string, id: string) => `${name}="#${prefix}-${id}"`,
    )
}

export default function WorkflowVisual({
  active,
  running,
}: {
  active: WorkflowStage
  running: boolean
}) {
  const instanceId = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const containers = useRef<Partial<Record<WorkflowStage, HTMLDivElement>>>({})

  const scenes = useMemo(
    () => STAGES.map(stage => ({
      stage,
      markup: scopeSvgIds(
        applyWorkflowTheme(ARTWORK[stage]),
        `workflow-${instanceId}-${stage}`,
      ),
    })),
    [instanceId],
  )

  // Initialize each native SVG timeline before its first paint.
  useLayoutEffect(() => {
    const illustrations = STAGES.map(stage =>
      containers.current[stage]?.querySelector<SVGSVGElement>('svg'),
    )

    for (const svg of illustrations) {
      if (!svg) continue
      svg.pauseAnimations()
      svg.setCurrentTime(0)
    }

    return () => {
      for (const svg of illustrations) svg?.pauseAnimations()
    }
  }, [scenes])

  // SMIL uses an SVG timeline, not CSS animation-play-state.
  // Pause freezes the current frame; resume continues from that frame.
  useLayoutEffect(() => {
    for (const stage of STAGES) {
      const svg = containers.current[stage]?.querySelector<SVGSVGElement>('svg')
      if (!svg) continue

      if (running && stage === active) {
        svg.unpauseAnimations()
      } else {
        svg.pauseAnimations()
      }
    }
  }, [active, running, scenes])

  return (
    <div
      className="workflow-visual workflow-svg"
      data-running={running}
      aria-hidden="true"
    >
      {scenes.map(({ stage, markup }) => (
        <div
          key={stage}
          ref={node => {
            if (node) containers.current[stage] = node
            else delete containers.current[stage]
          }}
          className={`workflow-svg__scene${active === stage ? ' is-active' : ''}`}
          // Only the bundled illustration assets belong here.
          dangerouslySetInnerHTML={{ __html: markup }}
        />
      ))}
    </div>
  )
}

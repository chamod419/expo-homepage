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
      markup: scopeSvgIds(ARTWORK[stage], `workflow-${instanceId}-${stage}`),
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

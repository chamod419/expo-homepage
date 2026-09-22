import { useId } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import './WorkflowVisual.css'

export type WorkflowStage = 'develop' | 'test' | 'deploy' | 'monitor'

type MotionStyle = CSSProperties & {
  [key: `--${string}`]: string | number
}

type CubeTone = 'gray' | 'blue' | 'dark' | 'wire'
type IconKind = 'web' | 'ios' | 'android' | 'layers'

function timing(duration: number, delay = 0): MotionStyle {
  return {
    '--duration': `${duration}s`,
    '--delay': `${delay}s`,
  }
}

function Float({
  children,
  duration = 6,
  delay = 0,
  x = 0,
  y = -3,
}: {
  children: ReactNode
  duration?: number
  delay?: number
  x?: number
  y?: number
}) {
  const style: MotionStyle = {
    ...timing(duration, delay),
    '--float-x': `${x}px`,
    '--float-y': `${y}px`,
  }

  return (
    <g className="wf-motion wf-float" style={style}>
      {children}
    </g>
  )
}

function Cube({
  x,
  y,
  size = 50,
  tone = 'gray',
  windowMark = false,
}: {
  x: number
  y: number
  size?: number
  tone?: CubeTone
  windowMark?: boolean
}) {
  const half = size / 2

  const palettes: Record<CubeTone, [string, string, string]> = {
    gray: ['#ffffff', '#d9dbe1', '#b9bdc7'],
    blue: ['#ffffff', '#0878cb', '#94c9f2'],
    dark: ['#252a30', '#343a42', '#151a20'],
    wire: ['none', 'none', 'none'],
  }

  const [top, left, right] = palettes[tone]

  return (
    <g
      transform={`translate(${x} ${y})`}
      stroke={tone === 'blue' ? '#609fce' : '#8f949e'}
      strokeWidth="1"
    >
      <polygon
        points={`0,${-half} ${size},0 0,${half} ${-size},0`}
        fill={top}
      />

      <polygon
        points={`${-size},0 0,${half} 0,${half + size} ${-size},${size}`}
        fill={left}
      />

      <polygon
        points={`0,${half} ${size},0 ${size},${size} 0,${half + size}`}
        fill={right}
      />

      {windowMark && (
        <g
          transform={`matrix(1 .5 0 1 ${-size * 0.74} ${size * 0.2})`}
          stroke="none"
        >
          <rect
            width={size * 0.48}
            height={size * 0.62}
            fill="#ffffff"
          />

          <rect
            x={size * 0.06}
            y={size * 0.06}
            width={size * 0.14}
            height={size * 0.5}
            fill="#252a30"
          />

          <rect
            x={size * 0.27}
            y={size * 0.06}
            width={size * 0.14}
            height={size * 0.5}
            fill="#252a30"
          />
        </g>
      )}
    </g>
  )
}

function Plane({
  x,
  y,
  size = 65,
  blue = false,
  duration = 4.6,
  delay = 0,
}: {
  x: number
  y: number
  size?: number
  blue?: boolean
  duration?: number
  delay?: number
}) {
  return (
    <path
      d={`M${x} ${y - size / 2}L${x + size} ${y}L${x} ${
        y + size / 2
      }L${x - size} ${y}Z`}
      fill={blue ? '#55aceb' : 'none'}
      fillOpacity={blue ? 0.25 : 1}
      stroke={blue ? '#68a9d8' : '#c6c9d1'}
      className={blue ? 'wf-motion wf-fill' : undefined}
      style={timing(duration, delay)}
    />
  )
}

function Flow({
  d,
  duration = 5,
  delay = 0,
  dashed = false,
  color = '#178bd4',
}: {
  d: string
  duration?: number
  delay?: number
  dashed?: boolean
  color?: string
}) {
  return (
    <g fill="none">
      <path
        d={d}
        stroke="#bcc3cf"
        strokeOpacity=".55"
        strokeDasharray={dashed ? '8 8' : undefined}
      />

      <path
        d={d}
        pathLength={1000}
        stroke={color}
        strokeWidth="1.5"
        strokeDasharray="80 920"
        className="wf-motion wf-signal"
        style={timing(duration, delay)}
      />
    </g>
  )
}

function DashedLine({
  d,
  duration = 3,
  delay = 0,
  reverse = false,
  blue = false,
}: {
  d: string
  duration?: number
  delay?: number
  reverse?: boolean
  blue?: boolean
}) {
  const style: MotionStyle = {
    ...timing(duration, delay),
    '--dash-end': reverse ? '32' : '-32',
  }

  return (
    <path
      d={d}
      fill="none"
      stroke={blue ? '#68a9d8' : '#c6c9d1'}
      strokeDasharray="8 8"
      className="wf-motion wf-dashes"
      style={style}
    />
  )
}

function Pulse({
  x,
  y,
  radius = 7,
  duration = 3,
  delay = 0,
  solid = true,
}: {
  x: number
  y: number
  radius?: number
  duration?: number
  delay?: number
  solid?: boolean
}) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle
        r={radius}
        fill="none"
        stroke="#83bae0"
        className="wf-motion wf-ripple"
        style={timing(duration, delay)}
      />

      {solid && (
        <circle
          r={radius}
          fill="#087acb"
          stroke="none"
        />
      )}
    </g>
  )
}

function Agent({
  x,
  y,
  radius = 26,
  blink = 8.8,
  delay = 0,
}: {
  x: number
  y: number
  radius?: number
  blink?: number
  delay?: number
}) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g transform={`scale(${radius / 26})`}>
        <circle r="26" fill="#20252a" stroke="none" />

        <g
          className="wf-motion wf-look"
          style={timing(16, delay)}
        >
          <g
            className="wf-motion wf-blink"
            style={timing(blink, delay)}
            fill="#ffffff"
            stroke="none"
          >
            <rect x="-10" y="-11" width="7" height="22" rx="3.5" />
            <rect x="3" y="-11" width="7" height="22" rx="3.5" />
          </g>
        </g>
      </g>
    </g>
  )
}

function PlatformIcon({ kind }: { kind: IconKind }) {
  if (kind === 'web') {
    return (
      <g fill="none" stroke="#252a30" strokeWidth="3.4">
        <circle r="19" />
        <ellipse rx="8" ry="19" />
        <path d="M-19 0H19" />
      </g>
    )
  }

  if (kind === 'ios') {
    return (
      <g fill="#252a30" stroke="none">
        <path d="M0-11C-6-16-15-10-14 0C-13 9-7 16-3 15L2 14L6 15C10 14 14 6 14 4C6 1 6-8 13-10C8-16 3-14 0-11Z" />
        <path d="M0-13C0-19 5-22 9-22C9-17 4-13 0-13Z" />
      </g>
    )
  }

  if (kind === 'android') {
    return (
      <g>
        <path
          d="M-12-12L-17-20M12-12L17-20"
          stroke="#252a30"
          strokeWidth="2"
        />
        <path
          d="M-21 9A21 21 0 0 1 21 9Z"
          fill="#252a30"
          stroke="none"
        />
        <circle cx="-8" cy="-1" r="1.7" fill="white" stroke="none" />
        <circle cx="8" cy="-1" r="1.7" fill="white" stroke="none" />
      </g>
    )
  }

  return (
    <g fill="none" stroke="#087acb" strokeWidth="3.5">
      <path d="M0-15L21-5L0 5L-21-5Z" />
      <path d="M-21 4L0 14L21 4" />
    </g>
  )
}

function PlatformCard({
  x,
  y,
  kind,
}: {
  x: number
  y: number
  kind: IconKind
}) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect
        x="-47"
        y="-47"
        width="94"
        height="94"
        rx="24"
        fill="#ffffff"
        stroke={kind === 'layers' ? '#70abd5' : '#d1d4db'}
      />
      <PlatformIcon kind={kind} />
    </g>
  )
}

function DevelopScene() {
  return (
    <>
      <Flow
        d="M120 136L300 46L480 136V356L300 446L120 356Z"
        duration={6}
        delay={-2}
      />

      <path
        d="M174 176L300 113L426 176V322L300 385L174 322Z"
        stroke="#b2b6bf"
      />

      <Flow
        d="M174 176L300 239L426 176"
        duration={4.6}
        delay={-1.2}
      />

      <DashedLine d="M300 239V446" duration={3} />

      <path
        d="M120 214L246 277V419L120 356Z"
        fill="#e5e6ec"
        fillOpacity=".85"
        stroke="none"
      />

      <DashedLine
        d="M120 214L246 277V419L120 356Z"
        duration={3}
        reverse
      />

      <Float duration={6} y={-5}>
        <Plane x={300} y={114} size={140} blue duration={4.5} />
      </Float>

      <DashedLine
        d="M354 143V419L480 356V214"
        blue
        duration={3}
      />

      <Flow
        d="M354 419V280L480 217"
        duration={5.6}
        delay={-3.4}
      />

      <Flow
        d="M354 143L480 206"
        duration={3.8}
        delay={-0.6}
      />

      <Cube x={300} y={214} size={54} tone="wire" />

      <Float duration={5}>
        <circle
          cx="300"
          cy="240"
          r="25"
          stroke="#373e47"
        />
      </Float>

      <Flow d="M300 267V380" duration={5} />

      <Pulse x={300} y={347} radius={5.5} solid={false} />

      <Float duration={8.2} delay={-3.1}>
        <Cube
          x={300}
          y={386}
          size={30}
          tone="dark"
          windowMark
        />
      </Float>
    </>
  )
}

function TestScene({ id }: { id: string }) {
  const panel =
    'M163 256L278 314Q296 323 296 344V380Q296 400 278 391L163 333Q148 325 148 307V272Q148 249 163 256Z'

  return (
    <>
      <defs>
        <clipPath id={`${id}-scan-clip`}>
          <path d={panel} />
        </clipPath>

        <linearGradient id={`${id}-scan-light`}>
          <stop stopColor="#ffffff" stopOpacity="0" />
          <stop offset=".5" stopColor="#ffffff" stopOpacity=".9" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>

      <path
        d="M329 42L443 99Q476 115 476 151V365Q476 403 442 386L329 330Q307 319 307 291V67Q307 31 329 42Z"
        fill="#e8e9ee"
        stroke="#bfc3cb"
      />

      <path
        d="M246 67L360 123Q391 138 391 170V390Q391 425 359 409L246 353Q223 342 223 312V92Q223 55 246 67Z"
        fill="#f8f8fa"
        stroke="#6caddb"
      />

      <path
        d="M281 106L324 127Q340 135 340 148Q340 155 329 150L285 128Q274 122 274 112Q274 103 281 106Z"
        fill="none"
        stroke="#c4d5e4"
        className="wf-motion wf-soft-pulse"
        style={timing(3.2)}
      />

      <DashedLine
        d="M164 103L274 158Q307 174 307 204V427Q307 459 276 444L164 388Q140 376 140 347V126Q140 91 164 103Z"
        blue
        duration={2.6}
      />

      <path
        d={panel}
        fill="#5cafe8"
        stroke="#6aaad6"
        className="wf-motion wf-fill"
        style={timing(5)}
      />

      <g clipPath={`url(#${id}-scan-clip)`}>
        <rect
          x="105"
          y="245"
          width="48"
          height="170"
          fill={`url(#${id}-scan-light)`}
          stroke="none"
          className="wf-motion wf-scan"
          style={timing(4.6)}
        />
      </g>

      <Float duration={5.5}>
        <Cube x={307} y={216} size={56} />
      </Float>

      <Float duration={4.4} delay={-1.5}>
        <circle
          cx="255"
          cy="332"
          r="20"
          fill="#087acb"
          stroke="none"
        />
      </Float>

      <DashedLine
        d="M193 376L235 321M193 376L270 345"
        blue
        duration={2.2}
      />

      <path
        d="M168 405L214 428L168 451L122 428Z"
        fill="#e7e8ee"
        stroke="none"
      />

      <Float duration={5.5} delay={-2}>
        <Agent x={168} y={397} blink={7.6} />
      </Float>
    </>
  )
}

function DeployScene() {
  return (
    <>
      <Flow
        d="M133 106H467Q489 106 489 130V414Q489 436 466 436H134Q111 436 111 413V130Q111 106 133 106Z"
        duration={5.2}
        dashed
      />

      <DashedLine d="M300 106V436" duration={3.4} />

      <Float duration={6} x={3} y={-4}>
        <Cube x={300} y={80} size={44} />
      </Float>

      <Float duration={5.2}>
        <Agent x={111} y={218} radius={22} blink={8.8} delay={-4} />
      </Float>

      <Float duration={3.6} delay={-1.8}>
        <Cube
          x={484}
          y={326}
          size={27}
          tone="dark"
          windowMark
        />
      </Float>

      <PlatformCard x={111} y={279} kind="web" />
      <PlatformCard x={300} y={261} kind="ios" />
      <PlatformCard x={489} y={279} kind="android" />

      <Flow
        d="M300 310V390"
        duration={3.8}
        delay={-1.4}
      />

      <Float duration={5.2} delay={-2.1}>
        <PlatformCard x={300} y={435} kind="layers" />

        <Flow
          d="M277 388H323Q347 388 347 412V458Q347 482 323 482H277Q253 482 253 458V412Q253 388 277 388Z"
          duration={4.4}
          delay={-2.2}
        />

        <Pulse
          x={330}
          y={407}
          radius={7.2}
          duration={2.8}
        />
      </Float>
    </>
  )
}

function MonitorScene() {
  return (
    <>
      <DashedLine d="M170 74V355" duration={3} reverse />
      <DashedLine d="M300 50V421" duration={3} delay={-1} reverse />
      <DashedLine d="M430 146V435" duration={3} delay={-2} reverse />

      <Float duration={8} delay={-1.6}>
        <DashedLine
          d="M170 70L235 102L170 135L105 102Z"
          duration={3.2}
        />
      </Float>

      <Float duration={5.8}>
        <Plane x={300} y={104} size={65} />
      </Float>

      <Float duration={5.6}>
        <Plane x={300} y={172} size={44} blue duration={4.6} />
      </Float>

      <Float duration={6.2} delay={-1.1}>
        <Cube x={170} y={189} size={65} />
      </Float>

      <Float duration={8.6} delay={-5.1}>
        <Cube x={430} y={189} size={65} />
      </Float>

      <Float duration={6.6} delay={-2.2}>
        <Plane x={300} y={266} size={44} blue delay={-1.7} />
      </Float>

      <Float duration={7.4} delay={-3.5}>
        <Cube x={300} y={299} size={65} tone="blue" />
      </Float>

      <Float duration={7} delay={-2.8}>
        <Plane x={170} y={320} size={65} />
        <Plane x={430} y={362} size={30} />
        <Plane x={430} y={429} size={65} />
      </Float>

      <Float duration={6.2} delay={-1.1}>
        <Agent
          x={170}
          y={151}
          radius={30}
          blink={9.4}
          delay={-7}
        />
      </Float>

      <Pulse
        x={430}
        y={150}
        radius={6.5}
        duration={3.6}
        solid={false}
      />

      <Float duration={5.8} delay={-2}>
        <Pulse
          x={300}
          y={218}
          radius={32}
          duration={3.4}
          solid={false}
        />

        <g transform="translate(300 218)">
          <circle r="32" fill="#087acb" stroke="none" />
          <g fill="none" stroke="#ffffff" strokeWidth="3">
            <path d="M0-14L18-5L0 4L-18-5Z" />
            <path d="M-18 3L0 12L18 3" />
          </g>
        </g>
      </Float>
    </>
  )
}

export default function WorkflowVisual({
  active,
  running,
}: {
  active: WorkflowStage
  running: boolean
}) {
  const id = `workflow-${useId().replace(/:/g, '')}`

  return (
    <svg
      className="workflow-visual wf-art"
      viewBox="0 0 600 500"
      fill="none"
      stroke="#bfc4ce"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      data-running={running}
      aria-hidden="true"
      focusable="false"
    >
      <g className={`wf-scene ${active === 'develop' ? 'is-active' : ''}`}>
        <DevelopScene />
      </g>

      <g className={`wf-scene ${active === 'test' ? 'is-active' : ''}`}>
        <TestScene id={id} />
      </g>

      <g className={`wf-scene ${active === 'deploy' ? 'is-active' : ''}`}>
        <DeployScene />
      </g>

      <g className={`wf-scene ${active === 'monitor' ? 'is-active' : ''}`}>
        <MonitorScene />
      </g>
    </svg>
  )
}
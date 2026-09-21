import HeroAnimation from '../components/HeroAnimation'
import './Hero.css'

const rays = Array.from({ length: 80 }, (_, index) => {
  const angle = (index / 80) * Math.PI * 2
  const innerRadius = 88 + (index % 4) * 4
  const outerRadius = 172 + (index % 7) * 7

  return {
    id: index,
    x1: 250 + Math.cos(angle) * innerRadius,
    y1: 250 + Math.sin(angle) * innerRadius,
    x2: 250 + Math.cos(angle) * outerRadius,
    y2: 250 + Math.sin(angle) * outerRadius,
    opacity: 0.2 + (index % 5) * 0.12,
  }
})

function ArrowIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 12h15M13 5l7 7-7 7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function HeroGraphic() {
  return (
    <svg
      className="hero-graphic"
      viewBox="0 0 500 500"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <filter
          id="hero-logo-shadow"
          x="-30%"
          y="-30%"
          width="160%"
          height="160%"
        >
          <feDropShadow
            dx="0"
            dy="4"
            stdDeviation="8"
            floodColor="#202326"
            floodOpacity="0.04"
          />
        </filter>
      </defs>

      <g>
        {rays.map((ray) => (
          <g key={ray.id} opacity={ray.opacity}>
            <line
              x1={ray.x1}
              y1={ray.y1}
              x2={ray.x2}
              y2={ray.y2}
              stroke="#c5c9ce"
              strokeWidth="0.8"
            />

            <circle
              cx={ray.x2}
              cy={ray.y2}
              r={ray.id % 3 === 0 ? 1.7 : 1.1}
              fill="#8b929a"
            />
          </g>
        ))}
      </g>

      <rect
        x="170"
        y="170"
        width="160"
        height="160"
        rx="40"
        fill="#ffffff"
        stroke="#e8eaed"
        strokeWidth="1.2"
        filter="url(#hero-logo-shadow)"
      />

      <svg
        x="193"
        y="190"
        width="114"
        height="114"
        viewBox="0 0 32 32"
        fill="none"
      >
        <path
          d="M14.3 5.2c.8-1.4 2.6-1.4 3.4 0l12 20.6c.9 1.7-.8 3.1-2.1 1.8L16 13.1 4.4 27.6c-1.3 1.3-3-.1-2.1-1.8l12-20.6Z"
          fill="#202326"
        />
      </svg>
    </svg>
  )
}

function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-copy">
        <h1 id="hero-title" className="hero-title">
          Build beautiful apps that keep getting better
        </h1>

        <div className="hero-actions">
          <a
            className="hero-button hero-button-primary"
            href="https://expo.dev/signup"
          >
            Get started
            <ArrowIcon />
          </a>

          <a
            className="hero-button hero-button-secondary"
            href="https://expo.dev/contact"
          >
            Talk to our team
          </a>
        </div>
      </div>

        <div className="hero-visual">
            <HeroAnimation />
        </div>

      <div className="hero-details">
        <a
          className="hero-announcement"
          href="https://expo.dev/services/eas-observe"
        >
          <span className="hero-announcement-badge">
            <span className="hero-status-dot" />
            New
          </span>

          <span>Try Observe</span>

          <ArrowIcon />
        </a>

        <p className="hero-description">
          Build with Expo’s CLI and development tools.
          Test your apps, automate releases, and learn
          from every update.
        </p>
      </div>
    </section>
  )
}

export default Hero
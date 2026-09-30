import HeroAnimation from '../components/HeroAnimation'
import './Hero.css'


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


function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-copy">
        <h1 id="hero-title" className="hero-title">
          Mobile AI infrastructure
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
          Build with our CLI and dev tools. 
          Test on simulators made for agents. 
          Ship with the best CI/CD for mobile and learn from every release.
        </p>
      </div>
    </section>
  )
}

export default Hero
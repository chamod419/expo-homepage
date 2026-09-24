import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import SdkLogo from '../components/SdkLogo'
import './DeveloperTools.css'

const EXPO_PATH =
  'M9.477 7.638c.164-.24.343-.27.488-.27.145 0 .387.03.551.27 2.13 2.901 6.55 10.56 6.959 10.976.605.618 1.436.233 1.918-.468.475-.69.607-1.174.607-1.69 0-.352-6.883-13.05-7.576-14.106-.667-1.017-.884-1.274-2.025-1.274h-.854c-1.138 0-1.302.257-1.969 1.274C6.883 3.406 0 16.104 0 16.456c0 .517.132 1 .607 1.69.482.7 1.313 1.086 1.918.468.41-.417 4.822-8.075 6.952-10.977z'

const languages = [
  {
    name: 'JavaScript',
    image: 'javascript-logo.png',
    background: '#f7df1e',
    full: true,
  },
  {
    name: 'Kotlin',
    image: 'kotlin-k.svg',
    background: 'linear-gradient(135deg, #e44857, #c711e1, #7f52ff)',
  },
  {
    name: 'Swift',
    image: 'swift-bird.svg',
    background: '#f15139',
  },
  {
    name: 'Java',
    text: 'Java',
    background: '#ffffff',
  },
  {
    name: 'TypeScript',
    image: 'typescript-logo.png',
    background: '#3178c6',
    full: true,
  },
  {
    name: 'Objective-C',
    image: 'objc-logo.png',
    background: '#ffffff',
  },
]

function Arrow() {
  return (
    <span className="dev-card__arrow" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none">
        <path
          d="M7 17 17 7M7 7h10v10"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  )
}

function ExpoMark() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d={EXPO_PATH} />
    </svg>
  )
}

export default function DeveloperTools() {
  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [running, setRunning] = useState(false)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let visible = false

    const update = () => {
      setRunning(visible && !document.hidden && !motion.matches)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        update()
      },
      { threshold: 0.1 },
    )

    observer.observe(section)
    document.addEventListener('visibilitychange', update)
    motion.addEventListener('change', update)

    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', update)
      motion.removeEventListener('change', update)
    }
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (running) {
      void video.play().catch(() => {
        // Keep the poster visible when autoplay is unavailable.
      })
    } else {
      video.pause()
    }
  }, [running])

  return (
    <section
      ref={sectionRef}
      className="developer-tools"
      aria-label="Developer tools"
      data-running={running}
    >
      <div className="page-container dev-grid">
        <a
          className="dev-card dev-sdk"
          href="https://github.com/expo/expo"
          target="_blank"
          rel="noreferrer"
          onPointerMove={(event) => {
              if (
                event.pointerType === 'touch' ||
                window.matchMedia('(prefers-reduced-motion: reduce)').matches
              ) {
                return
              }
          
              const logo =
                event.currentTarget.querySelector<HTMLElement>('.dev-sdk__logo')
          
              if (!logo) return
          
              const bounds = logo.getBoundingClientRect()
          
              const x = Math.max(
                0,
                Math.min(100, ((event.clientX - bounds.left) / bounds.width) * 100),
              )
          
              const y = Math.max(
                0,
                Math.min(100, ((event.clientY - bounds.top) / bounds.height) * 100),
              )
          
              event.currentTarget.style.setProperty('--pointer-x', `${x}%`)
              event.currentTarget.style.setProperty('--pointer-y', `${y}%`)
            }}
            onPointerLeave={(event) => {
              event.currentTarget.style.removeProperty('--pointer-x')
              event.currentTarget.style.removeProperty('--pointer-y')
            }}
        >
          <Arrow />

          <SdkLogo />

          <div className="dev-sdk__content">
            <h2>The Expo SDK</h2>
            <p>
              Built for real-world apps.
              <br />
              Open source from the start.
            </p>
            <span className="dev-pill dev-pill--dark">↗ expo/expo</span>
          </div>
        </a>

        <div className="dev-grid__right">
          <a
            className="dev-card dev-ai"
            href="https://claude.ai/directory/expo"
            target="_blank"
            rel="noreferrer"
          >
            <Arrow />

            <div className="dev-ai__glow" aria-hidden="true">
              <i />
              <i />
              <i />
            </div>

            <div className="dev-ai__icons" aria-hidden="true">
              <span className="dev-ai__claude">✳</span>
              <span className="dev-ai__expo">
                <span>
                  <ExpoMark />
                  <strong>MCP</strong>
                </span>
              </span>
            </div>

            <div className="dev-ai__copy">
              <h3>Build with AI assistance</h3>
              <span className="dev-pill">Explore the Claude connector</span>
            </div>
          </a>

          <div className="dev-grid__bottom">
            <a
              className="dev-card dev-api"
              href="https://docs.expo.dev/versions/latest/"
              target="_blank"
              rel="noreferrer"
            >
              <Arrow />

              <div className="dev-api__phone" aria-hidden="true">
                <div className="dev-api__screen">
                  <video
                    ref={videoRef}
                    muted
                    loop
                    playsInline
                    preload="none"
                    poster="https://static.expo.dev/static/home/2026/bento/api-video-placeholder.webp"
                  >
                    <source
                      src="https://static.expo.dev/static/home/2026/bento/api-demo.mp4"
                      type="video/mp4"
                    />
                  </video>
                </div>

                <img
                  className="dev-api__bezel"
                  src="https://static.expo.dev/static/home/2026/bento/bezel.webp"
                  alt=""
                  loading="lazy"
                />
              </div>

              <h3>
                100+ production APIs
                <br />
                ready to <code>install</code>
              </h3>
            </a>

            <a
              className="dev-card dev-native"
              href="https://docs.expo.dev/modules/overview/"
              target="_blank"
              rel="noreferrer"
            >
              <Arrow />

              <div className="dev-native__visual" aria-hidden="true">
                <div className="dev-native__arc">
                  {languages.map((language, index) => (
                    <div
                      key={language.name}
                      className="dev-native__arm"
                      style={
                        {
                          '--delay': `${(-16 / languages.length) * index}s`,
                        } as CSSProperties
                      }
                    >
                      <div
                        className={`dev-native__tile ${
                          language.full ? 'dev-native__tile--full' : ''
                        }`}
                        style={{ background: language.background }}
                      >
                        {language.image ? (
                          <img
                            src={`https://expo.dev/static/images/services/icons/${language.image}`}
                            alt=""
                            loading="lazy"
                          />
                        ) : (
                          <span>{language.text}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <svg className="dev-native__pointer" viewBox="0 0 21 13">
                  <polygon points="10.5,0 21,13 0,13" />
                </svg>
              </div>

              <h3>
                All native
                <br />
                code welcome
              </h3>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
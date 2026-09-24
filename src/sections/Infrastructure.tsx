import { useEffect, useRef, useState } from 'react'
import './Infrastructure.css'

const ASSETS = 'https://static.expo.dev/static/home/2026/cloud'

const technologies = [
  { name: 'React Native', image: 'logo-react-native.svg' },
  { name: 'Swift', image: 'logo-swift.svg' },
  { name: 'Jetpack Compose', image: 'logo-jetpack-compose.svg' },
  { name: 'Kotlin', image: 'logo-kotlin.webp' },
]

type Feature = {
  id: string
  title: [string, string]
  description: string
  href: string
  image: string
  mobileImage?: string
  width: number
  height: number
  wide?: boolean
  imageFirst?: boolean
  effect: 'rise' | 'scale'
}

const features: Feature[] = [
  {
    id: 'build',
    title: ['Get your app', 'on every device'],
    description:
      'Build your app and distribute it to Android, iOS, and the web from a single codebase with Build and Hosting.',
    href: 'https://docs.expo.dev/build/',
    image: 'box-1.webp',
    width: 1440,
    height: 900,
    imageFirst: true,
    effect: 'scale',
  },
  {
    id: 'update',
    title: ['Get the latest to', 'every useer,instantly'],
    description:
      'Send fast over-the-air updates to get the latest fixes and improvements to your users fast with Update.',
    href: 'https://docs.expo.dev/eas-update/introduction/',
    image: 'box-2.webp',
    width: 1677,
    height: 945,
    imageFirst: true,
    effect: 'rise',
  },
  {
    id: 'simulators',
    title: ['A device in', 'your agent\'s hands'],
    description:
      'Cloud simulators your coding agent can drive on demand. It runs your app, verifies its own work, and attaches screenshots, recordings, and logs as proof. No Mac required.',
    href: 'https://expo.dev/services/simulators',
    image: 'box-6.webp',
    mobileImage: 'box-6-mobile.webp',
    width: 3240,
    height: 1500,
    wide: true,
    effect: 'rise',
  },
  {
    id: 'launch',
    title: ['Launch anything', 'to the App Store'],
    description:
      'Follow a guided release process that helps turn your project into an app people can download.',
    href: 'https://expo.dev/services/launch',
    image: 'box-4.webp',
    width: 1308,
    height: 1014,
    effect: 'rise',
  },
  {
    id: 'observe',
    title: ['Understand your app', 'in production.'],
    description:
      'Explore performance and reliability signals to see what users experience and where your app needs attention.',
    href: 'https://expo.dev/services/eas-observe',
    image: 'box-5.webp',
    width: 1326,
    height: 786,
    imageFirst: true,
    effect: 'scale',
  },
  {
    id: 'workflows',
    title: ['Build, test and ship', 'with less manual work.'],
    description:
      'Connect your build, testing and release steps into repeatable workflows that run automatically.',
    href: 'https://expo.dev/services/workflows',
    image: 'box-3.webp',
    mobileImage: 'box-3-mobile.webp',
    width: 3270,
    height: 1641,
    wide: true,
    effect: 'rise',
  },
]

function Chevron() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="m9 6 6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function FeatureIllustration({ feature }: { feature: Feature }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    )

    if (
      reducedMotion.matches ||
      !('IntersectionObserver' in window)
    ) {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return

        setVisible(true)
        observer.disconnect()
      },
      { threshold: 0.12 },
    )

    observer.observe(root)

    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={rootRef}
      className={`infra-art infra-art--${feature.effect}`}
      data-visible={visible && loaded}
      aria-hidden="true"
    >
      <picture>
        {feature.mobileImage && (
          <source
            media="(max-width: 767px)"
            srcSet={`${ASSETS}/${feature.mobileImage}`}
          />
        )}

        <img
          src={`${ASSETS}/${feature.image}`}
          alt=""
          width={feature.width}
          height={feature.height}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(true)}
        />
      </picture>
    </div>
  )
}

function FeatureCard({ feature }: { feature: Feature }) {
  const className = [
    'infra-card',
    `infra-card--${feature.id}`,
    feature.wide ? 'infra-card--wide' : '',
    feature.imageFirst ? 'infra-card--image-first' : 'infra-card--image-last',
  ]
    .filter(Boolean)
    .join(' ')

  const illustration = <FeatureIllustration feature={feature} />

  return (
    <article className={className}>
      {feature.imageFirst && illustration}

      <div className="infra-card__copy">
        <h3>
          <span>{feature.title[0]}</span>
          <span>{feature.title[1]}</span>
        </h3>

        <p>{feature.description}</p>

        <a
          className="infra-card__link"
          href={feature.href}
          target="_blank"
          rel="noreferrer"
          aria-label={`Learn more: ${feature.title.join(' ')}`}
        >
          Learn more
          <Chevron />
        </a>
      </div>

      {!feature.imageFirst && illustration}
    </article>
  )
}

export default function Infrastructure() {
  return (
    <section
      className="infrastructure"
      aria-labelledby="infrastructure-title"
    >
      <div className="page-container">
        <header className="infrastructure__header">
          <h2 id="infrastructure-title">
            Infrastructure for your apps
          </h2>

          <ul className="infrastructure__technologies">
            <li>
              <svg
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M9.477 7.638c.164-.24.343-.27.488-.27.145 0 .387.03.551.27 2.13 2.901 6.55 10.56 6.959 10.976.605.618 1.436.233 1.918-.468.475-.69.607-1.174.607-1.69 0-.352-6.883-13.05-7.576-14.106-.667-1.017-.884-1.274-2.025-1.274h-.854c-1.138 0-1.302.257-1.969 1.274C6.883 3.406 0 16.104 0 16.456c0 .517.132 1 .607 1.69.482.7 1.313 1.086 1.918.468.41-.417 4.822-8.075 6.952-10.977z" />
              </svg>
              Expo
            </li>

            {technologies.map((technology) => (
              <li key={technology.name}>
                <img
                  src={`${ASSETS}/${technology.image}`}
                  alt=""
                  width="20"
                  height="20"
                  loading="lazy"
                />
                {technology.name}
              </li>
            ))}
          </ul>

          <a
            className="infrastructure__button"
            href="https://expo.dev/services"
            target="_blank"
            rel="noreferrer"
          >
            Learn more
          </a>
        </header>

        <div className="infrastructure__grid">
          {features.map((feature) => (
            <FeatureCard key={feature.id} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  )
}
import { useEffect, useRef, useState } from 'react'
import './Navbar.css'

const productLinks = [
  { label: 'Expo SDK', href: 'https://docs.expo.dev/versions/latest/' },
  { label: 'Expo CLI', href: 'https://expo.dev/tools' },
  { label: 'Expo Go', href: 'https://expo.dev/go' },
  { label: 'Build', href: 'https://expo.dev/services#build' },
  { label: 'Update', href: 'https://expo.dev/services#update' },
  { label: 'Workflows', href: 'https://expo.dev/services/workflows' },
]

const solutionLinks = [
  { label: 'Enterprise', href: 'https://expo.dev/solutions/enterprise' },
  { label: 'Startups', href: 'https://expo.dev/solutions/startups' },
  { label: 'Solo developers', href: 'https://expo.dev/solutions/solo-devs' },
]

type DropdownName = 'product' | 'solutions'

function ChevronIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="m6 9 6 6 6-6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] =
    useState<DropdownName | null>(null)

  const headerRef = useRef<HTMLElement>(null)
  const mobileButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    function handleOutsideClick(event: PointerEvent) {
      if (!headerRef.current?.contains(event.target as Node)) {
        setActiveDropdown(null)
        setMobileOpen(false)
      }
    }

    document.addEventListener('pointerdown', handleOutsideClick)

    return () => {
      document.removeEventListener('pointerdown', handleOutsideClick)
    }
  }, [])

  function toggleDropdown(name: DropdownName) {
    setActiveDropdown((current) => (current === name ? null : name))
  }

  function closeMenus() {
    setActiveDropdown(null)
    setMobileOpen(false)
  }

  return (
    <header
      className="navbar"
      ref={headerRef}
      onKeyDown={(event) => {
        if (event.key !== 'Escape') return

        if (activeDropdown) {
          const trigger =
            headerRef.current?.querySelector<HTMLButtonElement>(
              `[aria-controls="${activeDropdown}-links"]`,
            )

          setActiveDropdown(null)
          trigger?.focus()
        } else if (mobileOpen) {
          setMobileOpen(false)
          mobileButtonRef.current?.focus()
        }
      }}
    >
      <div className="navbar-inner">
        <a
          href="#"
          className="navbar-brand"
          aria-label="Expo homepage"
          onClick={closeMenus}
        >
          <svg
            width="27"
            height="27"
            viewBox="0 0 32 32"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M14.3 5.2c.8-1.4 2.6-1.4 3.4 0l12 20.6c.9 1.7-.8 3.1-2.1 1.8L16 13.1 4.4 27.6c-1.3 1.3-3-.1-2.1-1.8l12-20.6Z"
              fill="currentColor"
            />
          </svg>

          <span>Expo</span>
        </a>

        <nav
          id="main-navigation"
          aria-label="Main navigation"
          className={`navbar-menu ${mobileOpen ? 'is-open' : ''}`}
        >
          <div className="navbar-links">
            <a href="https://docs.expo.dev" onClick={closeMenus}>
              Docs <span aria-hidden="true">↗</span>
            </a>

            <div
              className="navbar-dropdown"
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) {
                  setActiveDropdown(null)
                }
              }}
            >
              <button
                type="button"
                className="navbar-dropdown-trigger"
                aria-expanded={activeDropdown === 'product'}
                aria-controls="product-links"
                onClick={() => toggleDropdown('product')}
              >
                Product
                <ChevronIcon />
              </button>

              <div
                id="product-links"
                className="navbar-dropdown-panel"
                hidden={activeDropdown !== 'product'}
              >
                {productLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={closeMenus}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            <div
              className="navbar-dropdown"
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) {
                  setActiveDropdown(null)
                }
              }}
            >
              <button
                type="button"
                className="navbar-dropdown-trigger"
                aria-expanded={activeDropdown === 'solutions'}
                aria-controls="solutions-links"
                onClick={() => toggleDropdown('solutions')}
              >
                Solutions
                <ChevronIcon />
              </button>

              <div
                id="solutions-links"
                className="navbar-dropdown-panel"
                hidden={activeDropdown !== 'solutions'}
              >
                {solutionLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={closeMenus}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            <a
              href="https://expo.dev/solutions/enterprise"
              onClick={closeMenus}
            >
              Enterprise
            </a>

            <a href="https://expo.dev/pricing" onClick={closeMenus}>
              Pricing
            </a>

            <a href="https://expo.dev/blog" onClick={closeMenus}>
              Blog
            </a>
          </div>

          <div className="navbar-actions">
            <a
              className="navbar-github"
              href="https://github.com/expo/expo"
              onClick={closeMenus}
            >
              GitHub ↗
            </a>

            <a
              className="navbar-button navbar-login"
              href="https://expo.dev/login"
              onClick={closeMenus}
            >
              Log in
            </a>

            <a
              className="navbar-button navbar-signup"
              href="https://expo.dev/signup"
              onClick={closeMenus}
            >
              Sign up
            </a>
          </div>
        </nav>

        <button
          ref={mobileButtonRef}
          type="button"
          className="navbar-mobile-toggle"
          aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={mobileOpen}
          aria-controls="main-navigation"
          onClick={() => {
            setMobileOpen((current) => !current)
            setActiveDropdown(null)
          }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d={
                mobileOpen
                  ? 'M6 6l12 12M18 6 6 18'
                  : 'M4 6h16M4 12h16M4 18h16'
              }
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </header>
  )
}

export default Navbar
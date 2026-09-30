import githubIcon from '../assets/footer/github.svg'
import xIcon from '../assets/footer/x.svg'
import discordIcon from '../assets/footer/discord.svg'
import blueskyIcon from '../assets/footer/bluesky.svg'
import ThemeSelector from './ThemeSelector'
import FooterLogo from './FooterLogo'
import MonoIcon from './MonoIcon'
import '../styles/expo-bottom.css'
import './Footer.css'

const groups = [
  { title: 'Product', links: [
    ['Star us on GitHub', 'https://github.com/expo/expo'],
    ['Expo CLI on GitHub', 'https://github.com/expo/expo/tree/main/packages/%40expo/cli'],
    ['Expo Services (EAS)', 'https://expo.dev/services'],
    ['EAS CLI on GitHub', 'https://github.com/expo/eas-cli'],
    ['Expo Go on GitHub', 'https://github.com/expo/expo/tree/main/packages/%40expo/go'],
    ['Expo Orbit', 'https://expo.dev/orbit'],
    ['Snack', 'https://snack.expo.dev'],
  ] },
  { title: 'Resources', links: [
    ['Documentation', 'https://docs.expo.dev/'],
    ['Blog', 'https://expo.dev/blog'],
    ['Changelog', 'https://expo.dev/changelog'],
    ['Support', 'https://expo.dev/support'],
    ['Trust Center', 'https://expo.dev/trust'],
    ['Discord', 'https://chat.expo.dev'],
  ] },
  { title: 'Solutions', links: [
    ['Enterprise', 'https://expo.dev/solutions/enterprise'],
    ['Startups', 'https://expo.dev/solutions/startups'],
    ['Solo developers', 'https://expo.dev/solutions/solo-devs'],
    ['React developers', 'https://expo.dev/solutions/expo-for-react-web-devs'],
    ['Commerce', 'https://expo.dev/solutions/ecom'],
    ['Crypto', 'https://expo.dev/solutions/crypto'],
    ['Finance', 'https://expo.dev/solutions/financial-services'],
    ['Restaurants', 'https://expo.dev/solutions/qsr'],
  ] },
  { title: 'Company', links: [
    ['Home', 'https://expo.dev/home'],
    ['Pricing', 'https://expo.dev/pricing'],
    ['Customers', 'https://expo.dev/customers'],
    ['Consultants', 'https://expo.dev/consultants'],
    ['About', 'https://expo.dev/about'],
    ['Brand', 'https://expo.dev/brand'],
    ['Careers', 'https://expo.dev/careers'],
  ] },
  { title: 'Legal', links: [
    ['Terms of service', 'https://expo.dev/terms'],
    ['Acceptable use policy', 'https://expo.dev/acceptable-use'],
    ['Privacy policy', 'https://expo.dev/privacy'],
    ['Privacy explained', 'https://expo.dev/privacy-explained'],
    ['Cookie policy', 'https://expo.dev/privacy/cookies'],
    ['Security & compliance', 'https://expo.dev/security'],
    ['Enterprise trust', 'https://expo.dev/trust'],
    ['Community guidelines', 'https://expo.dev/community-guidelines'],
  ] },
]
const socials = [
  { name: 'GitHub', href: 'https://www.github.com/expo/expo', icon: githubIcon },
  { name: 'X', href: 'https://www.twitter.com/expo', icon: xIcon },
  { name: 'Discord', href: 'https://chat.expo.dev', icon: discordIcon },
  { name: 'Bluesky', href: 'https://bsky.app/profile/expo.dev', icon: blueskyIcon },
]

export default function Footer() {
  return (
    <footer className="site-footer expo-bottom">
      <div className="expo-bottom__container">
        <nav className="site-footer__main" aria-label="Expo resources">
          <div className="site-footer__brand">
            <FooterLogo />
            <div className="site-footer__newsletter">
              <div>
                <p className="site-footer__eyebrow"><span aria-hidden="true" />Newsletter</p>
                <p className="site-footer__newsletter-copy">Stay in touch with all things Expo</p>
              </div>
              <a className="site-footer__updates" href="https://expo.dev/blog" target="_blank" rel="noopener noreferrer">Subscribe</a>
            </div>
          </div>
          <div className="site-footer__groups">
            {groups.map(group => (
              <div key={group.title}>
                <h3>{group.title}</h3>
                <ul>{group.links.map(([label, href]) => (
                  <li key={href}><a href={href} target="_blank" rel="noopener noreferrer">{label}<span className="expo-bottom__sr"> (opens in a new tab)</span></a></li>
                ))}</ul>
              </div>
            ))}
          </div>
        </nav>
        <div className="site-footer__bottom">
  <div className="site-footer__legal">
    <p className="site-footer__copyright">
      © {new Date().getFullYear()} 650 Industries, Inc.
    </p>

    <a
      className="site-footer__status"
      href="https://status.expo.dev"
      target="_blank"
      rel="noopener noreferrer"
    >
      <span className="site-footer__status-dot" aria-hidden="true" />
      <span>All Systems Operational</span>
      <span className="site-footer__external" aria-hidden="true">
        ↗
      </span>
    </a>

    <a
      className="site-footer__privacy"
      href="https://expo.dev/privacy"
      target="_blank"
      rel="noopener noreferrer"
    >
      <span className="site-footer__privacy-icon" aria-hidden="true">
        <span>✓</span>
        <span>×</span>
      </span>

      <span>Your Privacy Choices</span>
    </a>
  </div>

  <div className="site-footer__socials">
    {socials.map((social) => (
      <a
        key={social.name}
        href={social.href}
        aria-label={`${social.name} (opens in a new tab)`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <MonoIcon src={social.icon} />
      </a>
    ))}
  </div>

  <ThemeSelector />
</div>
      </div>
    </footer>
  )
}

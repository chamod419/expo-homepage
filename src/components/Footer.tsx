import githubIcon from '../assets/footer/github.svg'
import xIcon from '../assets/footer/x.svg'
import discordIcon from '../assets/footer/discord.svg'
import blueskyIcon from '../assets/footer/bluesky.svg'
import '../styles/expo-bottom.css'
import './Footer.css'

const groups = [
  { title: 'Product', links: [
    ['GitHub', 'https://github.com/expo/expo'],
    ['Expo CLI', 'https://github.com/expo/expo/tree/main/packages/%40expo/cli'],
    ['Expo Services', 'https://expo.dev/services'],
    ['EAS CLI', 'https://github.com/expo/eas-cli'],
    ['Expo Go', 'https://expo.dev/go'],
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
    ['Terms', 'https://expo.dev/terms'],
    ['Acceptable use', 'https://expo.dev/acceptable-use'],
    ['Privacy', 'https://expo.dev/privacy'],
    ['Privacy explained', 'https://expo.dev/privacy-explained'],
    ['Cookies', 'https://expo.dev/privacy/cookies'],
    ['Security', 'https://expo.dev/security'],
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
            <a className="site-footer__logo" href="#main-content" aria-label="Back to main content">
              <img src="https://static.expo.dev/static/images/exponential.svg" alt="" width="28" height="28" />
            </a>
            <div className="site-footer__newsletter">
              <div>
                <p className="site-footer__eyebrow"><span aria-hidden="true" />Newsletter</p>
                <p className="site-footer__newsletter-copy">News from Expo</p>
              </div>
              <a className="site-footer__updates" href="https://expo.dev/blog" target="_blank" rel="noopener noreferrer">Read updates</a>
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
          <p>Independent homepage recreation · Expo branding belongs to its owners.</p>
          <a className="site-footer__status" href="https://status.expo.dev" target="_blank" rel="noopener noreferrer">Service status <span aria-hidden="true">↗</span></a>
          <div className="site-footer__socials">
            {socials.map(social => <a key={social.name} href={social.href} aria-label={`${social.name} (opens in a new tab)`} target="_blank" rel="noopener noreferrer"><img src={social.icon} alt="" width="20" height="20" /></a>)}
          </div>
        </div>
      </div>
    </footer>
  )
}

import type { CSSProperties } from 'react'
import { useSectionReveal } from '../hooks/useSectionReveal'
import { communityPosts } from '../data/communityPosts'
import MonoIcon from '../components/MonoIcon'
import npmIcon from '../assets/community/npm.svg'
import projectsIcon from '../assets/community/projects.svg'
import buildsIcon from '../assets/community/builds.svg'
import discordIcon from '../assets/community/discord.svg'
import '../styles/expo-bottom.css'
import './Community.css'

type DelayStyle = CSSProperties & { '--enter-delay': string }
const at = (milliseconds: number): DelayStyle => ({ '--enter-delay': `${milliseconds}ms` })

// Preserve the varied masonry silhouette while displaying concise post summaries.
const cardHeights = [160, 362, 160, 183, 183, 272, 340, 160, 317, 362, 160, 160, 205, 160, 340, 183, 160]

export default function Community() {
  const rootRef = useSectionReveal<HTMLDivElement>()
  return (
    <div className="community expo-bottom" ref={rootRef}>
      <section className="community-stats" aria-label="Expo usage statistics">
        <div className="expo-bottom__container">
          <ul className="community-stats__list">
            <li className="community-stat" data-reveal-group style={{ '--row-delay': '0ms' } as CSSProperties}>
              <span data-enter="text" style={at(0)}>7M+ weekly</span>
              <span className="community-stat__art community-stat__art--npm" data-enter="icon" style={at(130)} aria-hidden="true"><img src={npmIcon} alt="" /></span>
              <span data-enter="text" style={at(250)}>downloads</span>
            </li>
            <li className="community-stat" data-reveal-group style={{ '--row-delay': '140ms' } as CSSProperties}>
              <span data-enter="text" style={at(0)}>100K+</span>
              <span className="community-stat__people" aria-hidden="true">
                {[1, 2, 3].map((person, index) => (
                  <span className="community-stat__person" key={person} data-enter="icon" style={at(130 + index * 70)}>
                    <img src={`https://static.expo.dev/static/home/2026/stats/headshot-${person}.webp`} width="48" height="48" alt="" loading="lazy" />
                  </span>
                ))}
              </span>
              <span data-enter="text" style={at(320)}>active devs</span>
            </li>
            <li className="community-stat" data-reveal-group style={{ '--row-delay': '280ms' } as CSSProperties}>
              <span data-enter="text" style={at(0)}>500K+</span>
              <span className="community-stat__art community-stat__art--projects" data-enter="icon" style={at(130)} aria-hidden="true"><img src={projectsIcon} alt="" /></span>
              <span data-enter="text" style={at(250)}>projects</span>
            </li>
            <li className="community-stat" data-reveal-group style={{ '--row-delay': '420ms' } as CSSProperties}>
              <span data-enter="text" style={at(0)}>100K+ daily</span>
              <span className="community-stat__art community-stat__art--builds" data-enter="icon" style={at(130)} aria-hidden="true"><img src={buildsIcon} alt="" /></span>
              <span data-enter="text" style={at(250)}>builds</span>
            </li>
          </ul>
        </div>
      </section>
      <section className="community-social" aria-labelledby="community-heading">
        <div className="expo-bottom__container">
          <div className="community-heading" data-reveal-group>
            <div className="community-heading__copy" data-enter="blur">
              <h2 id="community-heading">Expo is a community</h2>
              <p>Developers around the world build with Expo.<br />Explore their experiences and meet the community.</p>
            </div>
            <div className="community-heading__cta" data-enter="blur" style={at(180)}>
              <a className="community-discord" href="https://chat.expo.dev/" target="_blank" rel="noopener noreferrer">
                <MonoIcon src={discordIcon} size={24} className="community-discord__icon" />
                Join the Discord
                <span className="expo-bottom__sr"> (opens in a new tab)</span>
              </a>
              <p className="community-heading__members">70K+ Discord members</p>
            </div>
          </div>
          <div className="community-wall" aria-label="Summaries of community posts" data-reveal-group>
            <ul className="community-wall__columns">
              {communityPosts.map((post, index) => (
                <li className="community-post-wrap" key={post.href} data-enter="card" style={{ ...at((index % 4) * 60), '--post-height': `${cardHeights[index] ?? 160}px` } as CSSProperties}>
                  <a className="community-post" href={post.href} target="_blank" rel="noopener noreferrer">
                    <div className="community-post__author">
                      <img className="community-post__avatar" src={post.avatar} alt="" width="48" height="48" loading="lazy" decoding="async" />
                      <div className="community-post__identity">
                        <span className="community-post__name">{post.name}</span>
                        <span className="community-post__handle">{post.handle}</span>
                      </div>
                    </div>
                    <div className="community-post__body"><span className="expo-bottom__sr">Post summary: </span><p>{post.summary}</p></div>
                    <span className="expo-bottom__sr">Read original post (opens in a new tab).</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <p className="community-source-note">Post summaries · Select a card to read the original.</p>
        </div>
      </section>
    </div>
  )
}

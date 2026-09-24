import type { CSSProperties } from 'react'
import { useSectionReveal } from '../hooks/useSectionReveal'
import { communityPosts } from '../data/communityPosts'
import npmIcon from '../assets/community/npm.svg'
import projectsIcon from '../assets/community/projects.svg'
import buildsIcon from '../assets/community/builds.svg'
import discordIcon from '../assets/community/discord.svg'
import '../styles/expo-bottom.css'
import './Community.css'

type DelayStyle = CSSProperties & { '--enter-delay': string }
const at = (milliseconds: number): DelayStyle => ({ '--enter-delay': `${milliseconds}ms` })

export default function Community() {
  const rootRef = useSectionReveal<HTMLDivElement>()
  return (
    <div className="community expo-bottom" ref={rootRef}>
      <section className="community-stats" aria-label="Expo usage statistics">
        <div className="expo-bottom__container">
          <ul className="community-stats__list" data-reveal-group>
            <li className="community-stat">
              <span data-enter="text" style={at(0)}>7M+ weekly</span>
              <span className="community-stat__art community-stat__art--npm" data-enter="icon" style={at(130)} aria-hidden="true"><img src={npmIcon} alt="" /></span>
              <span data-enter="text" style={at(250)}>downloads</span>
            </li>
            <li className="community-stat">
              <span data-enter="text" style={at(320)}>100K+</span>
              <span className="community-stat__people" aria-hidden="true">
                {[1, 2, 3].map((person, index) => (
                  <span className="community-stat__person" key={person} data-enter="icon" style={at(440 + index * 90)}>
                    <img src={`https://static.expo.dev/static/home/2026/stats/headshot-${person}.webp`} width="48" height="48" alt="" loading="lazy" />
                  </span>
                ))}
              </span>
              <span data-enter="text" style={at(710)}>active devs</span>
            </li>
            <li className="community-stat">
              <span data-enter="text" style={at(790)}>500K+</span>
              <span className="community-stat__art community-stat__art--projects" data-enter="icon" style={at(920)} aria-hidden="true"><img src={projectsIcon} alt="" /></span>
              <span data-enter="text" style={at(1040)}>projects</span>
            </li>
            <li className="community-stat">
              <span data-enter="text" style={at(1120)}>100K+ daily</span>
              <span className="community-stat__art community-stat__art--builds" data-enter="icon" style={at(1250)} aria-hidden="true"><img src={buildsIcon} alt="" /></span>
              <span data-enter="text" style={at(1370)}>builds</span>
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
                <img src={discordIcon} alt="" width="24" height="24" />
                Join the Discord
                <span className="expo-bottom__sr"> (opens in a new tab)</span>
              </a>
              <p className="community-heading__members">70K+ Discord members</p>
            </div>
          </div>
          <div className="community-wall" aria-label="Summaries of community posts">
            <ul className="community-wall__columns">
              {communityPosts.map((post, index) => (
                <li className="community-post-wrap" key={post.href} data-reveal-group data-enter="card" style={at((index % 4) * 65)}>
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

import { useLayoutEffect, useRef } from 'react'

/** Reveal each group once; CSS supplies the children's stagger delays. */
export function useSectionReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  useLayoutEffect(() => {
    const root = ref.current
    if (!root || !('IntersectionObserver' in window)) return
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const groups = [...root.querySelectorAll<HTMLElement>('[data-reveal-group]')]
    let observer: IntersectionObserver | undefined
    const frames = new Set<number>()
    const reveal = (element: HTMLElement) => {
      const first = requestAnimationFrame(() => {
        frames.delete(first)
        const second = requestAnimationFrame(() => {
          frames.delete(second)
          element.classList.add('is-revealed')
        })
        frames.add(second)
      })
      frames.add(first)
    }
    const configure = () => {
      observer?.disconnect()
      frames.forEach(cancelAnimationFrame)
      frames.clear()
      if (preference.matches) {
        delete root.dataset.revealReady
        groups.forEach(group => group.classList.add('is-revealed'))
        return
      }
      root.dataset.revealReady = 'true'
      observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return
          reveal(entry.target as HTMLElement)
          observer?.unobserve(entry.target)
        })
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' })
      groups.forEach(group => {
        if (!group.classList.contains('is-revealed')) observer?.observe(group)
      })
    }
    configure()
    preference.addEventListener('change', configure)
    return () => {
      observer?.disconnect()
      frames.forEach(cancelAnimationFrame)
      preference.removeEventListener('change', configure)
      delete root.dataset.revealReady
    }
  }, [])
  return ref
}

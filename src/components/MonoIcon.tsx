import type { CSSProperties } from 'react'

/** Color only a monochrome icon; photographs and brand artwork stay untouched. */
export default function MonoIcon({ src, size = 20, className = '' }: { src: string; size?: number; className?: string }) {
  return <span aria-hidden="true" className={`mono-icon ${className}`} style={{
    width: size, height: size, '--icon-url': `url("${src}")`,
  } as CSSProperties} />
}

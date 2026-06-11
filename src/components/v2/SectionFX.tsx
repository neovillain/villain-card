import { useReducedMotion } from 'framer-motion'
import './SectionFX.css'

/** Искры-угольки, поднимающиеся вверх — злые схемы тлеют */
export function SectionFX() {
  const reduce = useReducedMotion()
  if (reduce) return null

  return (
    <div className="fx fx--embers" aria-hidden="true">
      {Array.from({ length: 14 }).map((_, i) => (
        <span
          key={i}
          style={
            {
              '--x': `${(i * 13.7 + 4) % 100}%`,
              '--d': `${5 + (i % 5) * 1.9}s`,
              '--delay': `${(i * 1.37) % 8}s`,
              '--s': `${2 + (i % 3)}px`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  )
}

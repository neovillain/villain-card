import { useReducedMotion } from 'framer-motion'
import './SectionFX.css'

/**
 * Тематический фон секции:
 *  - embers — искры-угольки, поднимающиеся вверх (злые схемы тлеют)
 *  - rain   — тонкие струи «цифрового дождя» (досье, данные)
 *  - rings  — расходящиеся сигнальные кольца (контакты, выход на связь)
 */
type Variant = 'embers' | 'rain' | 'rings'

const COUNT: Record<Variant, number> = { embers: 14, rain: 9, rings: 3 }

export function SectionFX({ variant }: { variant: Variant }) {
  const reduce = useReducedMotion()
  if (reduce) return null

  const items = Array.from({ length: COUNT[variant] })
  return (
    <div className={`fx fx--${variant}`} aria-hidden="true">
      {items.map((_, i) => (
        <span
          key={i}
          style={
            {
              '--i': i,
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

import { motion, useReducedMotion } from 'framer-motion'
import './SectionTransitions.css'

/**
 * Тематические переходы секций.
 * RedactedBars — досье «рассекречивается»: цензурные плашки уезжают.
 * ScanSweep — контакты «сканируются»: красный луч проходит сверху вниз.
 * Оба — оверлеи поверх секции (родителю нужен position: relative).
 */

const EASE = [0.77, 0, 0.18, 1] as const

const BARS = [
  { top: '9%', left: '8%', width: '46%' },
  { top: '21%', left: '32%', width: '54%' },
  { top: '34%', left: '5%', width: '38%' },
  { top: '47%', left: '42%', width: '50%' },
  { top: '60%', left: '12%', width: '58%' },
  { top: '73%', left: '28%', width: '44%' },
  { top: '86%', left: '7%', width: '52%' },
]

export function RedactedBars() {
  const reduce = useReducedMotion()
  if (reduce) return null
  return (
    <div className="redacted" aria-hidden="true">
      {BARS.map((bar, i) => (
        <motion.span
          key={i}
          className="redacted__bar"
          style={{
            top: bar.top,
            left: bar.left,
            width: bar.width,
            transformOrigin: i % 2 ? 'left center' : 'right center',
          }}
          initial={{ scaleX: 1 }}
          whileInView={{ scaleX: 0 }}
          viewport={{ once: true, margin: '-15%' }}
          transition={{ duration: 0.55, delay: 0.2 + i * 0.09, ease: EASE }}
        />
      ))}
    </div>
  )
}

export function ScanSweep() {
  const reduce = useReducedMotion()
  if (reduce) return null
  return (
    <div className="scan" aria-hidden="true">
      <motion.div
        className="scan__beam"
        initial={{ top: '-8%', opacity: 0 }}
        whileInView={{ top: '104%', opacity: [0, 1, 1, 1, 0] }}
        viewport={{ once: true, margin: '-15%' }}
        transition={{ duration: 1.5, ease: 'linear' }}
      >
        <span className="scan__trail" />
        <span className="scan__line" />
      </motion.div>
    </div>
  )
}

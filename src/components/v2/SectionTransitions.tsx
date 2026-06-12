import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import './SectionTransitions.css'

/**
 * Тематические переходы и эффекты секций.
 * RedactedText — многострочный текст «под грифом»: чёрная заливка по
 *   строкам (box-decoration-break) растворяется, текст проявляется.
 * RedactedLine — цензурная плашка ровно по однострочному тексту,
 *   уезжает в сторону при появлении секции.
 * ScanSweep — контакты «сканируются»: красный луч проходит сверху вниз.
 * CrimeTape — лента ограждения на стыке hero и schemes.
 */

const EASE = [0.77, 0, 0.18, 1] as const

export function RedactedText({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion()
  const [open, setOpen] = useState(false)
  if (reduce) return <>{children}</>
  return (
    <motion.span
      className={`redact-text${open ? ' redact-text--open' : ''}`}
      onViewportEnter={() => setOpen(true)}
      viewport={{ once: true, margin: '-12%' }}
    >
      {children}
    </motion.span>
  )
}

export function RedactedLine({
  children,
  delay = 0,
}: {
  children: React.ReactNode
  delay?: number
}) {
  const reduce = useReducedMotion()
  return (
    <span className="redact-line">
      {children}
      {!reduce && (
        <motion.span
          className="redact-line__bar"
          aria-hidden="true"
          initial={{ scaleX: 1 }}
          whileInView={{ scaleX: 0 }}
          viewport={{ once: true, margin: '-12%' }}
          transition={{ duration: 0.55, delay, ease: EASE }}
          style={{ transformOrigin: 'right center' }}
        />
      )}
    </span>
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

const TAPE_TEXT = 'do not cross · villain residence · '

export function CrimeTape() {
  const phrase = TAPE_TEXT.repeat(6)
  return (
    <div className="tape" aria-hidden="true">
      <div className="tape__band">
        <div className="tape__track">
          <span>{phrase}</span>
          <span>{phrase}</span>
        </div>
      </div>
    </div>
  )
}

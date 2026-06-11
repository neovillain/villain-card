import { motion, useReducedMotion } from 'framer-motion'
import { schemes, type Scheme } from '../config'
import { SectionFX } from './v2/SectionFX'
import './Schemes.css'

const EASE = [0.16, 1, 0.3, 1] as const

function SchemeCard({ scheme, index }: { scheme: Scheme; index: number }) {
  const reduce = useReducedMotion()
  const active = scheme.status === 'in progress'

  return (
    <motion.article
      className="scheme-card"
      initial={{ opacity: 0, y: reduce ? 0 : 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, ease: EASE, delay: index * 0.1 }}
      whileHover={reduce ? undefined : { y: -5 }}
    >
      <div className="scheme-card__head">
        <span className="scheme-card__num">{scheme.num}</span>
        <span className="scheme-card__codename">{scheme.codename}</span>
      </div>
      <h3 className="scheme-card__title">{scheme.title}</h3>
      <ul className="scheme-card__points">
        {scheme.points.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>
      <span
        className={`scheme-card__status${
          active ? ' scheme-card__status--active' : ''
        }`}
      >
        {active && <span className="scheme-card__pulse" aria-hidden="true" />}
        {scheme.status}
      </span>
    </motion.article>
  )
}

export function Schemes() {
  return (
    <section className="schemes container" id="schemes">
      <SectionFX variant="embers" />
      <h2 className="section-label">
        <span className="num">01</span> evil schemes
      </h2>
      <div className="schemes__grid">
        {schemes.map((scheme, i) => (
          <SchemeCard key={scheme.num} scheme={scheme} index={i} />
        ))}
      </div>
    </section>
  )
}

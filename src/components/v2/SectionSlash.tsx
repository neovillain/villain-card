import { motion, useReducedMotion } from 'framer-motion'
import './SectionSlash.css'

/**
 * Переход между разделами: скошенный багровый «росчерк лезвия»
 * проносится по секции, когда посетитель доскролливает до неё.
 */
export function SectionSlash() {
  const reduce = useReducedMotion()
  if (reduce) return null

  return (
    <motion.div
      className="slash"
      initial={{ x: '-130%' }}
      whileInView={{ x: '130%' }}
      viewport={{ once: true, margin: '-18%' }}
      transition={{ duration: 1.05, ease: [0.77, 0, 0.18, 1] }}
      aria-hidden="true"
    >
      <span className="slash__bar" />
      <span className="slash__edge" />
    </motion.div>
  )
}

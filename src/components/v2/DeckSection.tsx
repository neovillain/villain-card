import { useRef } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from 'framer-motion'

/**
 * «Колода злодея»: уходя вверх за край экрана, секция сжимается
 * и гаснет — следующая будто наезжает поверх неё.
 * Только transform/opacity — без перерисовок на скролле.
 */
export function DeckSection({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.93])
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.3])

  if (reduce) return <div ref={ref}>{children}</div>

  return (
    <motion.div
      ref={ref}
      style={{ scale, opacity, transformOrigin: 'center top' }}
    >
      {children}
    </motion.div>
  )
}

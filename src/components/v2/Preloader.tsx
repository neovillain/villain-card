import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import './Preloader.css'

const EASE = [0.16, 1, 0.3, 1] as const

export function Preloader() {
  const reduce = useReducedMotion()
  const [done, setDone] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setDone(true), reduce ? 300 : 1900)
    return () => clearTimeout(t)
  }, [reduce])

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="preloader"
          exit={{ y: '-100%' }}
          transition={{ duration: 0.8, ease: EASE }}
          aria-hidden="true"
        >
          <div className="preloader__word">
            {'VILLAIN'.split('').map((letter, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0.4, 1] }}
                transition={{ duration: 0.5, delay: 0.15 + i * 0.12 }}
              >
                {letter}
              </motion.span>
            ))}
          </div>
          <motion.div
            className="preloader__bar"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.4, ease: 'easeInOut', delay: 0.2 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { profile } from '../config'
import './Hero.css'

const EASE = [0.16, 1, 0.3, 1] as const

export function Hero() {
  const reduce = useReducedMotion()
  // Пока буквы «выезжают», маски обрезают свечение — включаем его после реveal
  const [revealed, setRevealed] = useState(false)
  const letters = profile.name.split('')

  return (
    <header className="hero container">
      <motion.div
        className="hero__meta"
        initial={{ opacity: 0, y: reduce ? 0 : -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
      >
        <span className="hero__est">{profile.est}</span>
        <span className="hero__alias">{profile.alias}</span>
      </motion.div>

      <h1
        className={`hero__title${revealed ? ' hero__title--revealed' : ''}`}
        aria-label={profile.name}
      >
        {letters.map((letter, i) => (
          <span className="hero__letter-mask" key={i} aria-hidden="true">
            <motion.span
              className="hero__letter"
              initial={
                reduce ? { opacity: 0 } : { y: '108%', rotate: 4, opacity: 0 }
              }
              animate={{ y: 0, rotate: 0, opacity: 1 }}
              transition={{
                duration: 1,
                ease: EASE,
                delay: 0.35 + i * 0.07,
              }}
              onAnimationComplete={
                i === letters.length - 1 ? () => setRevealed(true) : undefined
              }
            >
              {letter}
            </motion.span>
          </span>
        ))}
      </h1>

      <motion.div
        className="hero__sub"
        initial={{ opacity: 0, y: reduce ? 0 : 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: EASE, delay: 1.0 }}
      >
        <span className="hero__line" />
        <p className="hero__tagline">{profile.tagline}</p>
        <span className="hero__line" />
      </motion.div>

      <motion.a
        className="hero__scroll"
        href="#contacts"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.6 }}
      >
        <motion.span
          className="hero__scroll-arrow"
          animate={reduce ? undefined : { y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          aria-hidden="true"
        >
          ↓
        </motion.span>
        find me
      </motion.a>
    </header>
  )
}

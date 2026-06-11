import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { profile } from '../../config'
import { Lightning } from './Lightning'
import './HeroV2.css'

const EASE = [0.16, 1, 0.3, 1] as const

export function HeroV2() {
  const reduce = useReducedMotion()
  const [revealed, setRevealed] = useState(false)
  const letters = profile.name.split('')

  return (
    <header className="hero2" id="hero">
      {!reduce && (
        <div className="hero2__lightning" aria-hidden="true">
          <Lightning hue={352} speed={1.1} intensity={0.42} size={1.9} />
        </div>
      )}
      <div className="hero2__inner container">
        <motion.div
          className="hero2__meta"
          initial={{ opacity: 0, y: reduce ? 0 : -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 2.1 }}
        >
          <span>{profile.est}</span>
          <span className="hero2__alias">{profile.alias}</span>
        </motion.div>

        <h1
          className={`hero2__title${revealed ? ' hero2__title--revealed' : ''}`}
          aria-label={profile.name}
        >
          {letters.map((letter, i) => (
            <span className="hero2__letter-mask" key={i} aria-hidden="true">
              <motion.span
                className="hero2__letter"
                initial={
                  reduce ? { opacity: 0 } : { y: '108%', rotate: 4, opacity: 0 }
                }
                animate={{ y: 0, rotate: 0, opacity: 1 }}
                transition={{ duration: 1, ease: EASE, delay: 2.2 + i * 0.07 }}
                onAnimationComplete={
                  i === letters.length - 1 ? () => setRevealed(true) : undefined
                }
              >
                {letter}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          className="hero2__tagline"
          initial={{ opacity: 0, y: reduce ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 2.9 }}
        >
          {profile.tagline}
        </motion.p>

        <motion.a
          className="hero2__scroll"
          href="#schemes"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 3.4 }}
        >
          <motion.span
            animate={reduce ? undefined : { y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            aria-hidden="true"
          >
            ↓
          </motion.span>
          enter at your own risk
        </motion.a>
      </div>
    </header>
  )
}

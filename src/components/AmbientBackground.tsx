import { useEffect } from 'react'
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from 'framer-motion'
import './AmbientBackground.css'

const NOISE_URI =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E"

/** Атмосфера: дрейфующие багровые пятна света, шум и виньетка + прожектор за курсором */
export function AmbientBackground() {
  const reduce = useReducedMotion()
  const mx = useMotionValue(-600)
  const my = useMotionValue(-600)
  const sx = useSpring(mx, { damping: 30, stiffness: 120 })
  const sy = useSpring(my, { damping: 30, stiffness: 120 })

  useEffect(() => {
    if (reduce) return
    const onMove = (e: PointerEvent) => {
      mx.set(e.clientX - 300)
      my.set(e.clientY - 300)
    }
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [mx, my, reduce])

  return (
    <div className="ambient" aria-hidden="true">
      <motion.div
        className="ambient__photo"
        initial={{ opacity: 0 }}
        animate={
          reduce
            ? { opacity: 0.5 }
            : { opacity: 0.5, scale: [1.08, 1.18, 1.08] }
        }
        transition={{
          opacity: { duration: 2.4, ease: 'easeOut' },
          scale: { duration: 40, repeat: Infinity, ease: 'easeInOut' },
        }}
      />
      <motion.div
        className="ambient__blob ambient__blob--crimson"
        animate={
          reduce
            ? undefined
            : { x: [0, 120, -60, 0], y: [0, -80, 60, 0], scale: [1, 1.15, 0.95, 1] }
        }
        transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="ambient__blob ambient__blob--burgundy"
        animate={
          reduce
            ? undefined
            : { x: [0, -140, 80, 0], y: [0, 100, -70, 0], scale: [1, 0.9, 1.2, 1] }
        }
        transition={{ duration: 32, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="ambient__blob ambient__blob--ember"
        animate={
          reduce
            ? undefined
            : { x: [0, 90, -90, 0], y: [0, 60, -40, 0] }
        }
        transition={{ duration: 38, repeat: Infinity, ease: 'easeInOut' }}
      />
      {!reduce && (
        <motion.div className="ambient__spotlight" style={{ x: sx, y: sy }} />
      )}
      <div
        className="ambient__noise"
        style={{ backgroundImage: `url("${NOISE_URI}")` }}
      />
      <div className="ambient__vignette" />
    </div>
  )
}

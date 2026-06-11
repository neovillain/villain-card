import { useRef, useState } from 'react'
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from 'framer-motion'
import { links, type SocialLink } from '../../config'
import { SectionFX } from './SectionFX'
import './SocialLinksV2.css'

const EASE = [0.16, 1, 0.3, 1] as const

const ICON_SRC: Record<string, string> = {
  telegram: '/icons/telegram.svg',
  instagram: '/icons/instagram.svg',
  github: '/icons/github.svg',
  x: '/icons/x.svg',
  discord: '/icons/discord.svg',
  email: '/icons/gmail.svg',
}

function TiltCard({ link, index }: { link: SocialLink; index: number }) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const [copied, setCopied] = useState(false)

  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const srx = useSpring(rx, { damping: 18, stiffness: 200 })
  const sry = useSpring(ry, { damping: 18, stiffness: 200 })

  const isCopy = !link.url

  const onMove = (e: React.PointerEvent) => {
    if (reduce || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width
    const py = (e.clientY - rect.top) / rect.height
    rx.set((py - 0.5) * -12)
    ry.set((px - 0.5) * 12)
    ref.current.style.setProperty('--mx', `${px * 100}%`)
    ref.current.style.setProperty('--my', `${py * 100}%`)
  }
  const onLeave = () => {
    rx.set(0)
    ry.set(0)
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link.handle)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      /* clipboard недоступен — игнорируем */
    }
  }

  const inner = (
    <>
      <span className="tilt-card__icon">
        <img src={ICON_SRC[link.icon]} alt="" width={30} height={30} loading="lazy" />
      </span>
      <span className="tilt-card__text">
        <span className="tilt-card__label">{link.label}</span>
        <span className="tilt-card__handle">
          {copied ? 'copied ✓' : link.handle}
        </span>
      </span>
      <span className="tilt-card__action" aria-hidden="true">
        {isCopy ? (copied ? '✓' : '⧉') : '↗'}
      </span>
      <span className="tilt-card__glare" aria-hidden="true" />
    </>
  )

  return (
    <motion.div
      className="tilt-card__wrap"
      initial={{ opacity: 0, y: reduce ? 0 : 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, ease: EASE, delay: index * 0.08 }}
    >
      <motion.div
        ref={ref}
        className="tilt-card"
        style={{
          rotateX: srx,
          rotateY: sry,
          '--glow': link.glow,
        } as React.CSSProperties}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        whileTap={{ scale: 0.97 }}
      >
        {isCopy ? (
          <button
            type="button"
            className="tilt-card__hit"
            onClick={handleCopy}
            aria-label={`${link.label}: скопировать ник ${link.handle}`}
          >
            {inner}
          </button>
        ) : (
          <a
            className="tilt-card__hit"
            href={link.url}
            target={link.url!.startsWith('mailto:') ? undefined : '_blank'}
            rel="noopener noreferrer"
            aria-label={`${link.label}: ${link.handle}`}
          >
            {inner}
          </a>
        )}
      </motion.div>
    </motion.div>
  )
}

export function SocialLinksV2() {
  return (
    <section className="contacts2 container" id="contacts">
      <SectionFX variant="rings" />
      <h2 className="section-label">
        <span className="num">03</span> choose your poison
      </h2>
      <div className="contacts2__grid">
        {links.map((link, i) => (
          <TiltCard key={link.id} link={link} index={i} />
        ))}
      </div>
    </section>
  )
}

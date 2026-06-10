import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { links, type SocialLink } from '../config'
import { Icon } from './Icon'
import './SocialLinks.css'

const EASE = [0.16, 1, 0.3, 1] as const

function LinkCard({ link, index }: { link: SocialLink; index: number }) {
  const reduce = useReducedMotion()
  const [copied, setCopied] = useState(false)

  const isCopy = !link.url

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link.handle)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      /* clipboard может быть недоступен — молча игнорируем */
    }
  }

  const inner = (
    <>
      <span className="link-card__icon" style={{ color: link.glow }}>
        <Icon name={link.icon} />
      </span>
      <span className="link-card__text">
        <span className="link-card__label">{link.label}</span>
        <span className="link-card__handle">
          {copied ? 'copied to clipboard ✓' : link.handle}
        </span>
      </span>
      <span className="link-card__action" aria-hidden="true">
        {isCopy ? (copied ? '✓' : '⧉') : '↗'}
      </span>
    </>
  )

  const motionProps = {
    initial: { opacity: 0, y: reduce ? 0 : 28 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-60px' },
    transition: { duration: 0.7, ease: EASE, delay: index * 0.08 },
    whileHover: reduce ? undefined : { y: -4 },
    whileTap: { scale: 0.97 },
    style: { '--glow': link.glow } as React.CSSProperties,
  }

  if (isCopy) {
    return (
      <motion.button
        type="button"
        className="link-card"
        onClick={handleCopy}
        aria-label={`${link.label}: скопировать ник ${link.handle}`}
        {...motionProps}
      >
        {inner}
      </motion.button>
    )
  }

  return (
    <motion.a
      className="link-card"
      href={link.url}
      target={link.url!.startsWith('mailto:') ? undefined : '_blank'}
      rel="noopener noreferrer"
      aria-label={`${link.label}: ${link.handle}`}
      {...motionProps}
    >
      {inner}
    </motion.a>
  )
}

export function SocialLinks() {
  return (
    <section className="contacts container" id="contacts">
      <h2 className="section-label">
        <span className="num">01</span> choose your poison
      </h2>
      <div className="contacts__grid">
        {links.map((link, i) => (
          <LinkCard key={link.id} link={link} index={i} />
        ))}
      </div>
    </section>
  )
}

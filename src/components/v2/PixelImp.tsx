import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'
import './PixelImp.css'

/**
 * Пиксельный чертёнок — молчаливый житель «логова злодея».
 * Сидит на краю блока, свесив ножки, курит и перепрыгивает
 * на следующий блок, когда посетитель скроллит.
 */

const COLS = 18
const PX = 4 // размер «пикселя» в px
const SIT_ROW = 13 // строка спрайта, которой он касается поверхности

// Палитра спрайта
const PALETTE: Record<string, string> = {
  K: '#13070b', // контур
  R: '#e11d48', // тело
  D: '#b11237', // тень тела
  W: '#f3ecee', // рога / белки глаз
  P: '#16060a', // зрачки / рот
}

// Карта тела 18×17 ('.' — пусто)
const BODY = [
  '....W.......W.....',
  '....WW.....WW.....',
  '.....KKKKKKK......',
  '....KRRRRRRRK.....',
  '...KRRRRRRRRRK....',
  '...KRWWRRRWWRK....',
  '...KRWPRRRWPRK....',
  '...KRRRRRRRRRK....',
  '...KRRPPPPPRRK....',
  '...KRRRRRRRRRK....',
  '..KKRRRRRRRRRKK...',
  '..KRRRRRRRRRRRK...',
  'R..KRRRRRRRRRRK...',
  'RR.KKDDDDDDDKK....',
  '....KDK...KDK.....',
  '....KDK...KDK.....',
  '....KK....KK......',
]

// Веки для моргания (рисуются поверх глаз)
const BLINK_PIXELS: Array<[number, number]> = [
  [5, 5], [6, 5], [10, 5], [11, 5],
  [5, 6], [6, 6], [10, 6], [11, 6],
]

const SECTIONS = ['schemes', 'dossier', 'contacts']
const SIT_SELECTORS: Record<string, string> = {
  schemes: '#schemes .scheme-card',
  dossier: '#dossier .dossier-card',
  contacts: '#contacts .tilt-card',
}

function spritePixels(map: string[]) {
  const rects: Array<{ x: number; y: number; c: string }> = []
  map.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      const ch = row[x]
      if (ch !== '.') rects.push({ x, y, c: PALETTE[ch] })
    }
  })
  return rects
}

const BODY_PIXELS = spritePixels(BODY)

export function PixelImp() {
  const reduce = useReducedMotion()
  const [tick, setTick] = useState(0)
  const [flip, setFlip] = useState(false)
  const idxRef = useRef(-1)

  const x = useMotionValue(-200)
  const y = useMotionValue(-200)
  const sx = useSpring(x, { stiffness: 110, damping: 12 })
  const sy = useSpring(y, { stiffness: 110, damping: 11 })

  // Покадровая «пиксельная» жизнь: 2 кадра в секунду
  useEffect(() => {
    if (reduce) return
    const t = setInterval(() => setTick((v) => v + 1), 500)
    return () => clearInterval(t)
  }, [reduce])

  // Позиция точки сидения в координатах документа
  const computePos = (idx: number) => {
    if (idx < 0) {
      const hero = document.getElementById('hero')
      if (!hero) return null
      const r = hero.getBoundingClientRect()
      return {
        x: r.left + window.scrollX + r.width * 0.72,
        y: r.bottom + window.scrollY - SIT_ROW * PX,
      }
    }
    const el = document.querySelector(SIT_SELECTORS[SECTIONS[idx]])
    if (!el) return null
    const r = el.getBoundingClientRect()
    return {
      x: r.right + window.scrollX - 96,
      y: r.top + window.scrollY - SIT_ROW * PX,
    }
  }

  const moveTo = (idx: number) => {
    const pos = computePos(idx)
    if (!pos) return
    setFlip(pos.x < x.get()) // смотрит в сторону прыжка
    x.set(pos.x)
    y.set(pos.y)
  }

  useEffect(() => {
    // Первая посадка — после прелоадера и загрузки шрифтов
    const initial = setTimeout(() => moveTo(idxRef.current), 600)
    const settle = setTimeout(() => moveTo(idxRef.current), 2800)

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const id = entry.target.id
          const idx = id === 'hero' ? -1 : SECTIONS.indexOf(id)
          if (idx !== idxRef.current) {
            idxRef.current = idx
            moveTo(idx)
          }
        }
      },
      { threshold: 0.35 }
    )
    const heroEl = document.getElementById('hero')
    if (heroEl) observer.observe(heroEl)
    SECTIONS.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    const onResize = () => moveTo(idxRef.current)
    window.addEventListener('resize', onResize)
    return () => {
      clearTimeout(initial)
      clearTimeout(settle)
      observer.disconnect()
      window.removeEventListener('resize', onResize)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Кадровая логика
  const cycle = tick % 14
  const legSwing = tick % 2 === 1
  const dragging = cycle === 6 || cycle === 7 // затяжка
  const puff = cycle >= 8 && cycle <= 11 // выдох дыма
  const blink = cycle === 13
  const smokeStep = puff ? cycle - 8 : 0

  return (
    <motion.div
      className="pixel-imp"
      style={{ left: sx, top: sy }}
      aria-hidden="true"
    >
      <svg
        viewBox={`0 0 ${COLS} 17`}
        width={COLS * PX}
        height={17 * PX}
        shapeRendering="crispEdges"
        style={{ transform: flip ? 'scaleX(-1)' : undefined }}
      >
        {/* тело */}
        {BODY_PIXELS.map((p, i) => (
          <rect key={i} x={p.x} y={p.y} width="1" height="1" fill={p.c} />
        ))}

        {/* качающиеся ступни (поверх статичных ног) */}
        <rect x="4" y={legSwing ? 16 : 15} width="2" height="1" fill={PALETTE.K} />
        <rect x="10" y={legSwing ? 15 : 16} width="2" height="1" fill={PALETTE.K} />

        {/* моргание */}
        {blink &&
          BLINK_PIXELS.map(([bx, by], i) => (
            <rect key={`b${i}`} x={bx} y={by} width="1" height="1" fill={PALETTE.R} />
          ))}

        {/* рука с сигаретой: опущена или у рта */}
        {dragging ? (
          <g>
            <rect x="13" y="9" width="1" height="1" fill={PALETTE.K} />
            <rect x="12" y="8" width="1" height="1" fill="#d9d4d6" />
            <rect x="12" y="7" width="1" height="1" fill="#ff9f1c" />
          </g>
        ) : (
          <g>
            <rect x="14" y="11" width="1" height="1" fill={PALETTE.K} />
            <rect x="15" y="11" width="1" height="1" fill="#d9d4d6" />
            <rect x="16" y="11" width="1" height="1" fill="#d9d4d6" />
            <rect x="17" y="11" width="1" height="1" fill="#ff9f1c" opacity={legSwing ? 1 : 0.55} />
          </g>
        )}

        {/* пиксельный дым после затяжки */}
        {puff && (
          <g fill="#9a8f94">
            <rect x="13" y={6 - smokeStep} width="1" height="1" opacity={0.8 - smokeStep * 0.18} />
            {smokeStep > 1 && (
              <rect x="14" y={5 - smokeStep} width="1" height="1" opacity={0.5 - smokeStep * 0.1} />
            )}
          </g>
        )}
      </svg>
    </motion.div>
  )
}

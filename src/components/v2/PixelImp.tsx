import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'
import './PixelImp.css'

/**
 * Пиксельный чертёнок — молчаливый житель «логова злодея».
 * В каждой секции занят своим делом: у схем работает на ноутбуке,
 * в досье читает своё дело, у контактов листает телефон.
 * Между делами — выразительный перекур.
 */

const COLS = 18
const PX = 4
const SIT_ROW = 13

const C = {
  K: '#13070b', // контур
  R: '#e11d48', // тело
  D: '#b11237', // тень тела
  W: '#f3ecee', // рога / белки
  P: '#16060a', // зрачки / рот / руки
  CIG: '#d9d4d6',
  EMBER: '#ff9f1c',
  EMBER_HOT: '#ffd166',
  SMOKE: '#9a8f94',
  ASH: '#6f6468',
  SCREEN: '#2a1d22',
  GLOW: '#ff3d63',
  PAPER: '#e9e2e4',
  FACE_LIT: '#f0466f',
}

// Тело 18×17 ('.' — пусто)
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

const BLINK: Array<[number, number]> = [
  [5, 5], [6, 5], [10, 5], [11, 5],
  [5, 6], [6, 6], [10, 6], [11, 6],
]

type Px = { x: number; y: number; c: string; o?: number }

const BODY_PIXELS: Px[] = []
BODY.forEach((row, y) => {
  for (let x = 0; x < row.length; x++) {
    const ch = row[x]
    if (ch !== '.') BODY_PIXELS.push({ x, y, c: C[ch as keyof typeof C] ?? ch })
  }
})

const SECTIONS = ['schemes', 'dossier', 'contacts']
const SIT_SELECTORS: Record<string, string> = {
  schemes: '#schemes .scheme-card',
  dossier: '#dossier .dossier-card',
  contacts: '#contacts .tilt-card',
}
type Activity = 'smoke' | 'laptop' | 'read' | 'phone'
const ACTIVITY_BY_IDX: Activity[] = ['laptop', 'read', 'phone']

/* ─── покадровые слои ─── */

// Перекур: поднял руку → затяжка → большой выдох → стряхнул пепел
function smokeFrame(c: number): Px[] {
  const px: Px[] = []
  const atMouth = c === 5 || c === 6
  const mid = c === 3 || c === 4

  if (atMouth) {
    px.push({ x: 13, y: 9, c: C.P })
    px.push({ x: 12, y: 8, c: C.CIG })
    px.push({ x: 12, y: 7, c: C.EMBER_HOT })
  } else if (mid) {
    px.push({ x: 14, y: 10, c: C.P })
    px.push({ x: 14, y: 9, c: C.CIG })
    px.push({ x: 14, y: 8, c: C.EMBER })
  } else {
    px.push({ x: 14, y: 11, c: C.P })
    px.push({ x: 15, y: 11, c: C.CIG })
    px.push({ x: 16, y: 11, c: C.CIG })
    px.push({ x: 17, y: 11, c: C.EMBER, o: c % 2 ? 1 : 0.5 })
  }

  // выдох — облако растёт и уплывает вверх-вправо
  const s = c - 7
  if (s >= 0 && s <= 4) {
    const cloud: Px[][] = [
      [{ x: 13, y: 6, c: C.SMOKE, o: 0.9 }],
      [
        { x: 13, y: 5, c: C.SMOKE, o: 0.85 },
        { x: 14, y: 6, c: C.SMOKE, o: 0.55 },
      ],
      [
        { x: 14, y: 4, c: C.SMOKE, o: 0.75 },
        { x: 13, y: 5, c: C.SMOKE, o: 0.4 },
        { x: 15, y: 5, c: C.SMOKE, o: 0.55 },
        { x: 14, y: 5, c: C.SMOKE, o: 0.3 },
      ],
      [
        { x: 15, y: 3, c: C.SMOKE, o: 0.55 },
        { x: 16, y: 4, c: C.SMOKE, o: 0.45 },
        { x: 14, y: 3, c: C.SMOKE, o: 0.35 },
      ],
      [
        { x: 16, y: 2, c: C.SMOKE, o: 0.35 },
        { x: 17, y: 3, c: C.SMOKE, o: 0.25 },
      ],
    ]
    px.push(...cloud[s])
  }

  // стряхивает пепел
  if (c === 11) px.push({ x: 16, y: 12, c: C.ASH, o: 0.8 })

  return px
}

// Работает над планом: пиксельный ноутбук, печатает, экран мигает
function laptopFrame(c: number): Px[] {
  const px: Px[] = []
  // основание на коленях
  for (let x = 5; x <= 10; x++) px.push({ x, y: 12, c: C.SCREEN })
  // экран
  for (let y = 9; y <= 11; y++)
    for (let x = 5; x <= 9; x++) px.push({ x, y, c: C.SCREEN })
  // верхняя кромка экрана ловит свет
  for (let x = 5; x <= 9; x++) px.push({ x, y: 9, c: '#3a282e' })
  // свечение экрана — «код» бежит
  const glowRow = 10 + (c % 2)
  px.push({ x: 6, y: glowRow, c: C.GLOW })
  px.push({ x: 7, y: glowRow === 11 ? 10 : 11, c: C.GLOW, o: 0.7 })
  px.push({ x: 8, y: 10, c: C.GLOW, o: c % 2 ? 0.9 : 0.4 })
  px.push({ x: 5, y: 11, c: C.GLOW, o: 0.5 })
  // руки печатают
  const tap = c % 2
  px.push({ x: 5, y: tap ? 11 : 12, c: C.P })
  px.push({ x: 9, y: tap ? 12 : 11, c: C.P })
  // победный жест в конце цикла
  if (c === 11) {
    px.push({ x: 14, y: 7, c: C.P })
    px.push({ x: 14, y: 6, c: C.P })
  }
  return px
}

// Читает своё дело: лист с текстом, перелистывает, глаза вниз
function readFrame(c: number): Px[] {
  const px: Px[] = []
  const flip = c % 4 === 3
  const ox = flip ? 1 : 0
  // лист
  for (let y = 8; y <= 11; y++)
    for (let x = 5 + ox; x <= 8 + ox; x++) px.push({ x, y, c: C.PAPER })
  // строки «текста»
  if (!flip) {
    px.push({ x: 6, y: 9, c: C.P, o: 0.8 })
    px.push({ x: 7, y: 9, c: C.P, o: 0.8 })
    px.push({ x: 6, y: 10, c: C.P, o: 0.6 })
  }
  // руки держат лист
  px.push({ x: 4 + ox, y: 10, c: C.P })
  px.push({ x: 9 + ox, y: 10, c: C.P })
  // взгляд вниз: прикрываем зрачки и рисуем ниже
  px.push({ x: 6, y: 6, c: C.W })
  px.push({ x: 11, y: 6, c: C.W })
  px.push({ x: 6, y: 7, c: C.P })
  px.push({ x: 11, y: 7, c: C.P })
  return px
}

// Залипает в телефон: экран подсвечивает лицо, большой палец листает
function phoneFrame(c: number): Px[] {
  const px: Px[] = []
  // корпус телефона
  for (let y = 9; y <= 11; y++)
    for (let x = 7; x <= 8; x++) px.push({ x, y, c: C.K })
  // экран мигает (листает ленту)
  px.push({ x: 7, y: 9, c: C.GLOW, o: c % 3 === 0 ? 0.9 : 0.45 })
  px.push({ x: 8, y: 10, c: C.GLOW, o: c % 3 === 1 ? 0.9 : 0.45 })
  px.push({ x: 7, y: 10, c: C.GLOW, o: 0.3 })
  // руки
  px.push({ x: 6, y: 10, c: C.P })
  const thumb = c % 2
  px.push({ x: 9, y: thumb ? 10 : 9, c: C.P })
  // подсветка лица снизу
  px.push({ x: 7, y: 7, c: C.FACE_LIT, o: 0.8 })
  px.push({ x: 8, y: 7, c: C.FACE_LIT, o: 0.6 })
  // взгляд вниз
  px.push({ x: 6, y: 6, c: C.W })
  px.push({ x: 11, y: 6, c: C.W })
  px.push({ x: 6, y: 7, c: C.P })
  px.push({ x: 11, y: 7, c: C.P })
  return px
}

export function PixelImp() {
  const reduce = useReducedMotion()
  const [tick, setTick] = useState(0)
  const [flip, setFlip] = useState(false)
  const [idx, setIdx] = useState(-1)
  const idxRef = useRef(-1)

  const x = useMotionValue(-200)
  const y = useMotionValue(-200)
  const sx = useSpring(x, { stiffness: 110, damping: 12 })
  const sy = useSpring(y, { stiffness: 110, damping: 11 })

  useEffect(() => {
    if (reduce) return
    const t = setInterval(() => setTick((v) => v + 1), 480)
    return () => clearInterval(t)
  }, [reduce])

  const computePos = (i: number) => {
    if (i < 0) {
      const hero = document.getElementById('hero')
      if (!hero) return null
      const r = hero.getBoundingClientRect()
      return {
        x: r.left + window.scrollX + r.width * 0.72,
        y: r.bottom + window.scrollY - SIT_ROW * PX,
      }
    }
    const el = document.querySelector(SIT_SELECTORS[SECTIONS[i]])
    if (!el) return null
    const r = el.getBoundingClientRect()
    return {
      x: r.right + window.scrollX - 96,
      y: r.top + window.scrollY - SIT_ROW * PX,
    }
  }

  const moveTo = (i: number) => {
    const pos = computePos(i)
    if (!pos) return
    setFlip(pos.x < x.get())
    x.set(pos.x)
    y.set(pos.y)
  }

  useEffect(() => {
    const initial = setTimeout(() => moveTo(idxRef.current), 600)
    const settle = setTimeout(() => moveTo(idxRef.current), 2800)

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const id = entry.target.id
          const next = id === 'hero' ? -1 : SECTIONS.indexOf(id)
          if (next !== idxRef.current) {
            idxRef.current = next
            setIdx(next)
            moveTo(next)
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

  // В hero — всегда перекур; в секциях чередует дело и перекур
  const activity: Activity =
    idx < 0 ? 'smoke' : Math.floor(tick / 12) % 2 ? 'smoke' : ACTIVITY_BY_IDX[idx]
  const c = tick % 12
  const legSwing = tick % 2 === 1
  const blink = c === 10 && activity !== 'read' && activity !== 'phone'

  const layer: Px[] =
    activity === 'smoke'
      ? smokeFrame(c)
      : activity === 'laptop'
        ? laptopFrame(c)
        : activity === 'read'
          ? readFrame(c)
          : phoneFrame(c)

  return (
    <motion.div className="pixel-imp" style={{ left: sx, top: sy }} aria-hidden="true">
      <div className="pixel-imp__shadow" />
      <svg
        viewBox={`0 0 ${COLS} 17`}
        width={COLS * PX}
        height={17 * PX}
        shapeRendering="crispEdges"
        style={{ transform: flip ? 'scaleX(-1)' : undefined }}
      >
        {BODY_PIXELS.map((p, i) => (
          <rect key={i} x={p.x} y={p.y} width="1" height="1" fill={p.c} />
        ))}

        {/* качающиеся ступни */}
        <rect x="4" y={legSwing ? 16 : 15} width="2" height="1" fill={C.K} />
        <rect x="10" y={legSwing ? 15 : 16} width="2" height="1" fill={C.K} />

        {blink &&
          BLINK.map(([bx, by], i) => (
            <rect key={`b${i}`} x={bx} y={by} width="1" height="1" fill={C.R} />
          ))}

        {layer.map((p, i) => (
          <rect
            key={`l${i}`}
            x={p.x}
            y={p.y}
            width="1"
            height="1"
            fill={p.c}
            opacity={p.o ?? 1}
          />
        ))}
      </svg>
    </motion.div>
  )
}

import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'
import './PixelImp.css'

/**
 * Пиксельный чертёнок — молчаливый житель «логова злодея».
 * В каждой секции занят своим делом, между секциями телепортируется
 * с дымовым «пуфом» — без визуализации пути.
 */

const COLS = 18
const ROWS = 17
const PX = 4
const SIT_ROW = 13

const C = {
  K: '#13070b',
  R: '#e11d48',
  D: '#b11237',
  W: '#f3ecee',
  P: '#16060a',
  CIG: '#d9d4d6',
  EMBER: '#ff9f1c',
  EMBER_HOT: '#ffd166',
  SMOKE: '#9a8f94',
  ASH: '#6f6468',
  SCREEN: '#1d1216',
  SCREEN_EDGE: '#3a282e',
  GLOW: '#ff3d63',
  GLOW_SOFT: '#ff7d98',
  PAPER: '#e9e2e4',
  STAMP: '#c81e44',
  FACE_LIT: '#f0466f',
}

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

/* ─── телепорт-«пуф»: облако дыма на месте чертёнка ─── */

const POOF_DENSE: Px[] = [
  { x: 6, y: 4, c: C.SMOKE, o: 0.9 }, { x: 9, y: 3, c: C.SMOKE, o: 0.8 },
  { x: 12, y: 5, c: C.SMOKE, o: 0.9 }, { x: 4, y: 7, c: C.SMOKE, o: 0.85 },
  { x: 8, y: 6, c: C.SMOKE }, { x: 11, y: 8, c: C.SMOKE, o: 0.9 },
  { x: 5, y: 10, c: C.SMOKE, o: 0.85 }, { x: 9, y: 10, c: C.SMOKE },
  { x: 13, y: 11, c: C.SMOKE, o: 0.8 }, { x: 7, y: 12, c: C.SMOKE, o: 0.9 },
  { x: 10, y: 13, c: C.SMOKE, o: 0.85 }, { x: 6, y: 8, c: C.SMOKE, o: 0.7 },
  { x: 14, y: 7, c: C.SMOKE, o: 0.6 }, { x: 3, y: 12, c: C.SMOKE, o: 0.6 },
]

const POOF_SPARSE: Px[] = [
  { x: 5, y: 5, c: C.SMOKE, o: 0.5 }, { x: 11, y: 4, c: C.SMOKE, o: 0.4 },
  { x: 13, y: 9, c: C.SMOKE, o: 0.45 }, { x: 4, y: 11, c: C.SMOKE, o: 0.4 },
  { x: 8, y: 14, c: C.SMOKE, o: 0.35 }, { x: 9, y: 7, c: C.SMOKE, o: 0.3 },
]

/* ─── занятия ─── */

// Перекур: тлеет → подносит ко рту → яркая затяжка → большой выдох → пепел
function smokeFrame(c: number): Px[] {
  const px: Px[] = []
  const atMouth = c === 7 || c === 8
  const mid = c === 5 || c === 6

  if (atMouth) {
    px.push({ x: 13, y: 9, c: C.P })
    px.push({ x: 12, y: 8, c: C.CIG })
    px.push({ x: 12, y: 7, c: C.EMBER_HOT })
    px.push({ x: 11, y: 7, c: C.EMBER, o: 0.5 })
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

  const s = c - 9
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

  if (c === 14) px.push({ x: 16, y: 12, c: C.ASH, o: 0.8 })

  return px
}

// Работает над планом: большой ноутбук, экран с «бегущим кодом», печатает
function laptopFrame(c: number): Px[] {
  const px: Px[] = []
  // экран (стоит раскрытый, лицом к зрителю)
  for (let y = 7; y <= 11; y++)
    for (let x = 4; x <= 11; x++) px.push({ x, y, c: C.SCREEN })
  // рамка экрана
  for (let x = 4; x <= 11; x++) {
    px.push({ x, y: 7, c: C.SCREEN_EDGE })
    px.push({ x, y: 11, c: C.SCREEN_EDGE })
  }
  // «код»: три строки разной длины, обновляются каждый кадр
  const lines = [
    { y: 8, len: 3 + (c % 4), color: C.GLOW },
    { y: 9, len: 2 + ((c + 2) % 5), color: C.GLOW_SOFT },
    { y: 10, len: 4 + ((c + 1) % 3), color: C.GLOW },
  ]
  for (const line of lines)
    for (let i = 0; i < line.len; i++)
      px.push({ x: 5 + i, y: line.y, c: line.color, o: 0.95 })
  // мигающий курсор в конце последней строки
  if (c % 2) px.push({ x: 5 + lines[2].len, y: 10, c: C.W })
  // основание-клавиатура
  for (let x = 4; x <= 11; x++) px.push({ x, y: 12, c: C.K })
  // руки печатают
  const tap = c % 2
  px.push({ x: 4, y: tap ? 11 : 12, c: C.P })
  px.push({ x: 11, y: tap ? 12 : 11, c: C.P })
  return px
}

// Читает своё дело: папка с красной плашкой «секретно», листает страницы
function readFrame(c: number): Px[] {
  const px: Px[] = []
  const flip = c % 5 === 4
  const ox = flip ? 1 : 0
  // лист — крупный, в обеих руках
  for (let y = 7; y <= 12; y++)
    for (let x = 4 + ox; x <= 9 + ox; x++) px.push({ x, y, c: C.PAPER })
  // красная плашка-гриф сверху
  for (let x = 5 + ox; x <= 8 + ox; x++) px.push({ x, y: 8, c: C.STAMP })
  // строки «текста»
  if (!flip) {
    px.push({ x: 5, y: 10, c: C.P, o: 0.85 })
    px.push({ x: 6, y: 10, c: C.P, o: 0.85 })
    px.push({ x: 7, y: 10, c: C.P, o: 0.85 })
    px.push({ x: 5, y: 11, c: C.P, o: 0.6 })
    px.push({ x: 6, y: 11, c: C.P, o: 0.6 })
    px.push({ x: 8, y: 11, c: C.P, o: 0.6 })
  } else {
    // согнутый уголок при перелистывании
    px.push({ x: 10, y: 7, c: C.SMOKE, o: 0.7 })
  }
  // руки держат лист
  px.push({ x: 3 + ox, y: 9, c: C.P })
  px.push({ x: 10 + ox, y: 9, c: C.P })
  // взгляд вниз
  px.push({ x: 6, y: 6, c: C.W })
  px.push({ x: 11, y: 6, c: C.W })
  px.push({ x: 6, y: 7, c: C.P })
  px.push({ x: 11, y: 7, c: C.P })
  return px
}

// Залипает в телефон — вполоборота: телефон вытянут перед мордой,
// взгляд вбок-вниз на экран, свет экрана бьёт в лицо
function phoneFrame(c: number): Px[] {
  const px: Px[] = []
  // вполоборота: прячем дальний (левый) глаз и фронтальный рот
  px.push({ x: 5, y: 5, c: C.R }, { x: 6, y: 5, c: C.R })
  px.push({ x: 5, y: 6, c: C.R }, { x: 6, y: 6, c: C.R })
  for (let x = 6; x <= 10; x++) px.push({ x, y: 8, c: C.R })
  // приоткрытый рот сбоку (залип)
  px.push({ x: 11, y: 8, c: C.P })
  px.push({ x: 12, y: 8, c: C.P, o: 0.85 })
  // ближний глаз смотрит вперёд-вниз
  px.push({ x: 11, y: 6, c: C.W })
  px.push({ x: 11, y: 7, c: C.P })
  // рука вытянута вперёд к телефону
  px.push({ x: 13, y: 9, c: C.P })
  px.push({ x: 14, y: 10, c: C.P })
  // телефон перед лицом
  for (let y = 6; y <= 10; y++) {
    px.push({ x: 14, y, c: C.K })
    px.push({ x: 15, y, c: C.K })
  }
  // яркий экран, «лента» скроллится
  const shift = c % 3
  for (let row = 0; row < 3; row++) {
    const y = 7 + row
    const bright = (row + shift) % 3 === 0
    px.push({ x: 14, y, c: bright ? C.GLOW : '#ffe9ee', o: bright ? 1 : 0.92 })
    px.push({ x: 15, y, c: bright ? C.GLOW : '#ffe9ee', o: bright ? 1 : 0.92 })
  }
  // свет экрана на морде
  px.push({ x: 12, y: 6, c: C.FACE_LIT, o: 0.85 })
  px.push({ x: 12, y: 7, c: C.FACE_LIT, o: 0.5 })
  // ореол свечения
  px.push({ x: 16, y: 7, c: C.GLOW, o: 0.25 })
  px.push({ x: 13, y: 6, c: C.GLOW, o: 0.2 })
  px.push({ x: 16, y: 10, c: C.GLOW, o: 0.2 })
  return px
}

export function PixelImp() {
  const reduce = useReducedMotion()
  const [tick, setTick] = useState(0)
  const [flip, setFlip] = useState(false)
  const [idx, setIdx] = useState(-1)
  // 'idle' → 'out' (густой пуф на старом месте) → прыжок координат → 'in' (рассеивающийся пуф)
  const [tp, setTp] = useState<'idle' | 'out' | 'in'>('idle')
  // В hero чертёнка нет — живёт только в секциях
  const [hidden, setHiddenState] = useState(true)
  const hiddenRef = useRef(true)
  const setHidden = (v: boolean) => {
    hiddenRef.current = v
    setHiddenState(v)
  }
  const idxRef = useRef(-1)
  const tpBusy = useRef(false)

  const x = useMotionValue(-200)
  const y = useMotionValue(-200)
  const sx = useSpring(x, { stiffness: 160, damping: 18 })
  const sy = useSpring(y, { stiffness: 160, damping: 18 })

  // 4 кадра в секунду — живее и не спорит с плавным фоном
  useEffect(() => {
    if (reduce) return
    const t = setInterval(() => setTick((v) => v + 1), 250)
    return () => clearInterval(t)
  }, [reduce])

  const computePos = (i: number) => {
    if (i < 0) return null
    const el = document.querySelector(SIT_SELECTORS[SECTIONS[i]])
    if (!el) return null
    const r = el.getBoundingClientRect()
    return {
      x: r.right + window.scrollX - 96,
      y: r.top + window.scrollY - SIT_ROW * PX,
    }
  }

  // Мгновенная коррекция позиции (resize, первичная посадка) — без пуфа
  const reposition = (i: number) => {
    if (i < 0) {
      setHidden(true)
      return
    }
    const pos = computePos(i)
    if (!pos) return
    x.jump(pos.x)
    y.jump(pos.y)
    setFlip(pos.x > window.innerWidth / 2 + window.scrollX - 200)
    setHidden(false)
  }

  // Телепорт с пуфом: исчез здесь — появился там.
  // В hero (i < 0) чертёнок не живёт: пуф — и пропал до следующей секции.
  const teleportTo = (i: number) => {
    if (reduce || tpBusy.current) {
      reposition(i)
      return
    }
    if (i < 0) {
      if (hiddenRef.current) return
      tpBusy.current = true
      setTp('out')
      window.setTimeout(() => {
        setHidden(true)
        setTp('idle')
        tpBusy.current = false
        if (idxRef.current !== i) teleportTo(idxRef.current)
      }, 300)
      return
    }
    const pos = computePos(i)
    if (!pos) return
    tpBusy.current = true
    if (hiddenRef.current) {
      // появляется из ниоткуда: сразу на месте, только «in»-пуф
      x.jump(pos.x)
      y.jump(pos.y)
      setFlip(true)
      setHidden(false)
      setTp('in')
      window.setTimeout(() => {
        setTp('idle')
        tpBusy.current = false
        if (idxRef.current !== i) teleportTo(idxRef.current)
      }, 320)
      return
    }
    setTp('out')
    window.setTimeout(() => {
      x.jump(pos.x)
      y.jump(pos.y)
      setFlip(true) // лицом внутрь страницы (сидит у правого края)
      setTp('in')
    }, 280)
    window.setTimeout(() => {
      setTp('idle')
      tpBusy.current = false
      // секция могла смениться, пока шёл пуф — догоняем
      if (idxRef.current !== i) teleportTo(idxRef.current)
    }, 600)
  }

  useEffect(() => {
    const initial = setTimeout(() => reposition(idxRef.current), 600)
    const settle = setTimeout(() => reposition(idxRef.current), 2800)

    // Доля ВЬЮПОРТА (не секции!), занятая каждой секцией — высокие секции
    // иначе почти никогда не добирают порог и чертёнок опаздывает.
    const visible: Record<string, number> = {}
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visible[entry.target.id] = entry.isIntersecting
            ? entry.intersectionRect.height / window.innerHeight
            : 0
        }
        let best = ''
        let bestShare = 0.12 // минимум, чтобы не дёргался на краях
        for (const [id, share] of Object.entries(visible)) {
          if (share > bestShare) {
            best = id
            bestShare = share
          }
        }
        if (!best) return
        const next = best === 'hero' ? -1 : SECTIONS.indexOf(best)
        if (next !== idxRef.current) {
          idxRef.current = next
          setIdx(next)
          teleportTo(next)
        }
      },
      { threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] }
    )
    const heroEl = document.getElementById('hero')
    if (heroEl) observer.observe(heroEl)
    SECTIONS.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    const onResize = () => reposition(idxRef.current)
    window.addEventListener('resize', onResize)
    return () => {
      clearTimeout(initial)
      clearTimeout(settle)
      observer.disconnect()
      window.removeEventListener('resize', onResize)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // В hero — перекур; в секциях чередуем дело (6с) и перекур (4с)
  const phaseLen = 24 + 16
  const inSmokeBreak = idx < 0 || tick % phaseLen >= 24
  const activity: Activity = inSmokeBreak ? 'smoke' : ACTIVITY_BY_IDX[idx]
  const c = activity === 'smoke' ? tick % 16 : tick % 12
  const legSwing = Math.floor(tick / 2) % 2 === 1
  const blink =
    tick % 13 === 12 && activity !== 'read' && activity !== 'phone'

  const hideBody = tp === 'out'
  const layer: Px[] =
    tp !== 'idle'
      ? tp === 'out'
        ? POOF_DENSE
        : POOF_SPARSE
      : activity === 'smoke'
        ? smokeFrame(c)
        : activity === 'laptop'
          ? laptopFrame(c)
          : activity === 'read'
            ? readFrame(c)
            : phoneFrame(c)

  // в hero не показываемся вовсе (кроме момента «out»-пуфа при уходе)
  if (hidden && tp === 'idle') return null

  return (
    <motion.div className="pixel-imp" style={{ left: sx, top: sy }} aria-hidden="true">
      {!hideBody && <div className="pixel-imp__shadow" />}
      <svg
        viewBox={`0 0 ${COLS} ${ROWS}`}
        width={COLS * PX}
        height={ROWS * PX}
        shapeRendering="crispEdges"
        style={{ transform: flip ? 'scaleX(-1)' : undefined }}
      >
        {!hideBody &&
          BODY_PIXELS.map((p, i) => (
            <rect key={i} x={p.x} y={p.y} width="1" height="1" fill={p.c} />
          ))}

        {!hideBody && (
          <>
            <rect x="4" y={legSwing ? 16 : 15} width="2" height="1" fill={C.K} />
            <rect x="10" y={legSwing ? 15 : 16} width="2" height="1" fill={C.K} />
          </>
        )}

        {!hideBody &&
          blink &&
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

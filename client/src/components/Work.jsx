import { useCallback, useEffect, useRef, useState } from 'react'
import { useScramble } from '../hooks/useScramble'
import GlitchText from './GlitchText'

/* ─── Gallery constants ─── */
const VIEWS = ['FLAT', 'TILT', 'RING', 'GALLERY']
const N     = 8
const CW    = 160
const CH    = Math.round(CW * (4 / 3))

/* ─── Project data — expanded with modal detail fields ─── */
const PROJECTS = [
  {
    num: 1,
    title: '포스터 디자인 01',
    category: 'POSTER DESIGN',
    tag: 'POSTER',
    year: '2026',
    description:
      '디지털인문예술 전공 프로젝트로 제작한 포스터입니다. 타이포그래피와 이미지의 균형을 실험한 작업으로, 모노크롬 팔레트를 중심으로 텍스트의 리듬감을 탐구했습니다. 인쇄 매체와 화면 매체 모두에 최적화된 해상도로 제작되었습니다.',
    tools: ['Illustrator', 'Photoshop'],
    images: ['ph1'],
  },
  {
    num: 2,
    title: '장서표 01',
    category: 'EX LIBRIS',
    tag: 'EX LIBRIS',
    year: '2026',
    description:
      '개인 소장 도서를 위한 장서표 시리즈의 첫 번째 작품입니다. 전통적인 장서표 형식에 현대적인 타이포그래피를 접목하여, 소유자의 정체성을 상징하는 요소들로 구성했습니다. 한글 서체와 기하학적 문양을 결합한 독창적인 시각 언어를 개발했습니다.',
    tools: ['Illustrator', 'Claude'],
    images: ['ph1', 'ph2'],
  },
  {
    num: 3,
    title: '포스터 디자인 02',
    category: 'POSTER DESIGN',
    tag: 'POSTER',
    year: '2026',
    description:
      '전시 홍보를 위한 실험적 포스터 작업입니다. 레이어드 텍스트와 기하학적 형태를 조합하여 시각적 긴장감을 만들었으며, AI 도구를 활용한 생성 이미지가 포함되어 있습니다. 디지털 인문학적 관점에서 인간과 기계의 협업을 시각화했습니다.',
    tools: ['Illustrator', 'Claude Code', 'Photoshop'],
    images: ['ph1', 'ph2'],
  },
  {
    num: 4,
    title: '장서표 02',
    category: 'EX LIBRIS',
    tag: 'EX LIBRIS',
    year: '2026',
    description:
      '가족을 위한 맞춤 장서표 제작 프로젝트입니다. 한글 캘리그래피와 현대적 레이아웃의 조화를 탐구했으며, Blender로 제작한 3D 요소가 포함되어 있습니다. 아날로그 질감과 디지털 정밀함을 결합한 하이브리드 접근법을 시도했습니다.',
    tools: ['Illustrator', 'Blender', 'Figma'],
    images: ['ph1', 'ph2', 'ph3'],
  },
  {
    num: 5,
    title: '포스터 디자인 03',
    category: 'POSTER DESIGN',
    tag: 'POSTER',
    year: '2026',
    description:
      '디지털 매체에 특화된 포스터 시리즈입니다. 동적 요소와 정적 그래픽 사이의 경계를 시각화하였으며, 화면 해상도와 인쇄 품질을 동시에 고려한 설계입니다. 미래융합스쿨의 학제간 특성을 반영한 비주얼 언어를 실험했습니다.',
    tools: ['Illustrator', 'Figma', 'Photoshop'],
    images: ['ph1'],
  },
  {
    num: 6,
    title: '장서표 03',
    category: 'EX LIBRIS',
    tag: 'EX LIBRIS',
    year: '2026',
    description:
      '소규모 출판 프로젝트를 위한 장서표 디자인입니다. 식물 모티프를 재해석하여 현대적인 미감으로 표현했으며, 레이저 커팅 프린트 제작을 위한 정밀 벡터 작업입니다. 전통 공예와 디지털 제작 방식의 교차점을 탐색했습니다.',
    tools: ['Illustrator', 'Figma'],
    images: ['ph1', 'ph2'],
  },
  {
    num: 7,
    title: '포스터 디자인 04',
    category: 'POSTER DESIGN',
    tag: 'POSTER',
    year: '2026',
    description:
      '교내 학술지 커버 디자인 제안 프로젝트입니다. 디지털 인문학을 주제로 인간과 기계의 관계를 시각화했으며, 미래융합스쿨의 정체성을 반영한 비주얼 언어를 개발했습니다. 학제간 융합의 가능성을 그래픽 언어로 번역하는 작업입니다.',
    tools: ['Illustrator', 'Blender', 'Claude'],
    images: ['ph1', 'ph2'],
  },
  {
    num: 8,
    title: '장서표 04',
    category: 'EX LIBRIS',
    tag: 'EX LIBRIS',
    year: '2026',
    description:
      '장서표 시리즈의 마지막 작품으로, 4년간의 학습과 성장을 상징하는 요소들로 구성했습니다. 한림대학교 미래융합스쿨의 정체성을 담아내며, 디지털과 아날로그, 전통과 혁신의 균형을 시각적으로 표현했습니다. 개인적 서사와 학문적 탐구를 장서표라는 형식 안에 압축했습니다.',
    tools: ['Illustrator', 'Figma', 'Photoshop'],
    images: ['ph1', 'ph2', 'ph3'],
  },
]

const TILT_ROT_Z  = [-8,  4, -5,  7, -3,  6, -7,  3]
const TILT_OFFS_Y = [20, -10, 30, -20, 15, -30, 10, -15]
const DEG         = Math.PI / 180

/* ─── Pure target calculator — lives outside component so rAF closure is stable ─── */
function getTarget(i, view, rot, stageW, curRotY) {
  const mob   = stageW < 600
  const faceY = Math.round(curRotY / 360) * 360

  if (view === 'RING') {
    const ang  = (360 / N) * i + rot
    const rad  = ang * DEG
    const cosA = Math.cos(rad)
    const sinA = Math.sin(rad)
    const rx   = mob ? 160 : 280
    const rz   = mob ? 80  : 140
    const dep  = (cosA + 1) / 2
    return {
      x: sinA * rx, y: sinA * rx * 0.12, z: cosA * rz,
      rotY: -ang, rotZ: 0, rotX: 0,
      scale: dep * 0.30 + 0.75, opacity: dep * 0.50 + 0.50,
      zIdx: Math.round(dep * 8), depth: dep,
    }
  }

  if (view === 'FLAT') {
    const ang  = (360 / N) * i + rot
    const rad  = ang * DEG
    const cosA = Math.cos(rad)
    const sinA = Math.sin(rad)
    const r    = mob ? 180 : 320
    const dep  = (cosA + 1) / 2
    return {
      x: sinA * r, y: -Math.abs(sinA) * 22, z: 0,
      rotY: faceY, rotZ: 0, rotX: 0,
      scale: 1, opacity: dep * 0.30 + 0.70,
      zIdx: Math.round(dep * 8), depth: dep,
    }
  }

  if (view === 'TILT') {
    const sp    = (mob ? 110 : CW) + (mob ? 14 : 24)
    const tot   = N * sp
    const x     = -(tot / 2) + sp / 2 + i * sp
    const normX = Math.abs(x) / ((stageW || 800) / 2)
    return {
      x, y: TILT_OFFS_Y[i], z: 0,
      rotY: faceY, rotZ: TILT_ROT_Z[i], rotX: 10,
      scale: 1, opacity: Math.max(0.35, 1 - normX * 0.35),
      zIdx: i, depth: 1 - normX,
    }
  }

  /* GALLERY */
  const arcDeg = (i / (N - 1) - 0.5) * 120
  const arcRad = arcDeg * DEG
  const arcR   = mob ? 300 : 520
  return {
    x: Math.sin(arcRad) * arcR,
    y: (-Math.cos(arcRad) + 1) * arcR * 0.12,
    z: 0,
    rotY: faceY, rotZ: arcDeg * 0.25, rotX: 0,
    scale: 1.05, opacity: 1,
    zIdx: i, depth: i / (N - 1),
  }
}

/* ─── ViewButton ─── */
function ViewButton({ label, active, onClick }) {
  const { display, start, stop } = useScramble(label)
  return (
    <button
      onClick={onClick}
      onMouseEnter={start}
      onMouseLeave={stop}
      style={{
        padding: '6px 16px',
        border: active ? '1px solid #AAFF00' : '1px solid #8C8C8C',
        borderRadius: '9999px',
        backgroundColor: active ? '#AAFF00' : 'transparent',
        color: '#1A1A1A',
        fontWeight: 600,
        fontSize: '0.7rem',
        letterSpacing: '0.06em',
        cursor: 'pointer',
        transition: 'background-color 200ms ease, border-color 200ms ease',
        whiteSpace: 'nowrap',
        fontFamily: 'inherit',
        lineHeight: 1,
        userSelect: 'none',
      }}
    >
      {display}
    </button>
  )
}

/* ─── WorkCard ─── */
function WorkCard({ project, setRef, onEnter, onLeave, onClick }) {
  const { display, start, stop } = useScramble(project.title)
  return (
    <div
      ref={setRef}
      onMouseEnter={() => { start(); onEnter() }}
      onMouseLeave={() => { stop();  onLeave() }}
      onClick={onClick}
      style={{
        position:        'absolute',
        left:            '50%',
        top:             '50%',
        width:           `${CW}px`,
        height:          `${CH}px`,
        marginLeft:      `${-CW / 2}px`,
        marginTop:       `${-CH / 2}px`,
        willChange:      'transform, opacity',
        backgroundColor: '#F7F7F7',
        border:          '1px solid #D4D4D4',
        overflow:        'hidden',
        cursor:          'pointer',
        display:         'flex',
        flexDirection:   'column',
        userSelect:      'none',
      }}
    >
      <div
        style={{
          flex:            1,
          backgroundColor: '#EBEBEB',
          display:         'flex',
          alignItems:      'center',
          justifyContent:  'center',
          pointerEvents:   'none',
        }}
      >
        <span
          style={{
            fontWeight:    700,
            fontSize:      '0.78rem',
            color:         '#1A1A1A',
            opacity:       0.28,
            letterSpacing: '-0.01em',
          }}
        >
          {project.tag}
        </span>
      </div>
      <div
        style={{
          padding:         '10px 12px',
          backgroundColor: '#F7F7F7',
          flexShrink:      0,
          pointerEvents:   'none',
        }}
      >
        <p
          style={{
            fontWeight:    600,
            fontSize:      '0.52rem',
            color:         '#AAFF00',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom:  '4px',
          }}
        >
          {project.category}
        </p>
        <p style={{ fontWeight: 700, fontSize: '0.68rem', color: '#1A1A1A', lineHeight: 1.25 }}>
          {display}
        </p>
      </div>
    </div>
  )
}

/* ─── ProjectModal ─── */
function ProjectModal({ project, isClosing, onClose, onPrev, onNext }) {
  const [selectedThumb, setSelectedThumb] = useState(0)
  const isMobile = window.innerWidth < 768
  const currentIdx = PROJECTS.findIndex(p => p.num === project.num)

  /* Reset thumbnail when navigating between projects */
  useEffect(() => { setSelectedThumb(0) }, [project.num])

  const panelAnim = {
    opacity:    isClosing ? 0 : 1,
    transform:  isClosing ? 'scale(0.94)' : 'scale(1)',
    transition: 'opacity 250ms ease, transform 250ms ease',
  }

  return (
    /* Backdrop — click to close */
    <div
      onClick={onClose}
      style={{
        position:        'fixed',
        inset:           0,
        backgroundColor: 'rgba(28,28,28,0.85)',
        zIndex:          9000,
        display:         'flex',
        alignItems:      'center',
        justifyContent:  'center',
        padding:         isMobile ? '12px' : '32px',
        opacity:         isClosing ? 0 : 1,
        transition:      'opacity 300ms ease',
      }}
    >
      {/* Panel — stop backdrop click propagating */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          ...panelAnim,
          position:        'relative',
          backgroundColor: '#F7F7F7',
          border:          '1px solid #AAFF00',
          borderRadius:    '12px',
          width:           isMobile ? '92vw' : 'min(1000px, 90vw)',
          maxHeight:       isMobile ? '90vh' : '85vh',
          display:         'flex',
          flexDirection:   isMobile ? 'column' : 'row',
          overflowY:       'auto',
        }}
      >
        {/* ── Close button ── */}
        <button
          onClick={onClose}
          onMouseEnter={e => { e.currentTarget.style.color = '#AAFF00' }}
          onMouseLeave={e => { e.currentTarget.style.color = '#1A1A1A' }}
          aria-label="닫기"
          style={{
            position:   'absolute',
            top:        '14px',
            right:      '14px',
            zIndex:     10,
            background: 'none',
            border:     'none',
            fontSize:   '1.75rem',
            fontWeight: 800,
            color:      '#1A1A1A',
            cursor:     'pointer',
            lineHeight: 1,
            padding:    '4px 8px',
            transition: 'color 150ms ease',
            fontFamily: 'inherit',
          }}
        >
          ×
        </button>

        {/* ── LEFT — image area (~60% desktop) ── */}
        <div
          style={{
            flex:            isMobile ? 'none' : '3',
            display:         'flex',
            flexDirection:   'column',
            backgroundColor: '#EBEBEB',
            minHeight:       isMobile ? '220px' : '0',
            borderRadius:    isMobile ? '12px 12px 0 0' : '12px 0 0 12px',
            overflow:        'hidden',
          }}
        >
          {/* Main image placeholder */}
          <div
            style={{
              flex:            1,
              display:         'flex',
              alignItems:      'center',
              justifyContent:  'center',
              position:        'relative',
              minHeight:       isMobile ? '200px' : '360px',
            }}
          >
            <span
              style={{
                fontWeight:    700,
                fontSize:      isMobile ? '2rem' : '3rem',
                color:         '#1A1A1A',
                opacity:       0.18,
                letterSpacing: '-0.02em',
                userSelect:    'none',
                pointerEvents: 'none',
              }}
            >
              {project.tag}
            </span>
            {/* Image counter badge */}
            <span
              style={{
                position:      'absolute',
                bottom:        '12px',
                right:         '12px',
                fontSize:      '0.6rem',
                fontWeight:    600,
                color:         'rgba(26,26,26,0.45)',
                letterSpacing: '0.06em',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {String(selectedThumb + 1).padStart(2, '0')} / {String(project.images.length).padStart(2, '0')}
            </span>
          </div>

          {/* Thumbnail strip — shown only when project has multiple images */}
          {project.images.length > 1 && (
            <div
              style={{
                display:         'flex',
                gap:             '8px',
                padding:         '12px 16px',
                flexWrap:        'wrap',
                borderTop:       '1px solid #D4D4D4',
                backgroundColor: '#EBEBEB',
              }}
            >
              {project.images.map((_, ti) => (
                <div
                  key={ti}
                  onClick={() => setSelectedThumb(ti)}
                  style={{
                    width:       '52px',
                    height:      '68px',
                    backgroundColor: '#D4D4D4',
                    border:      ti === selectedThumb
                      ? '2px solid #AAFF00'
                      : '1px solid rgba(26,26,26,0.15)',
                    cursor:      'pointer',
                    display:     'flex',
                    alignItems:  'center',
                    justifyContent: 'center',
                    fontSize:    '0.6rem',
                    fontWeight:  600,
                    color:       '#1A1A1A',
                    opacity:     ti === selectedThumb ? 1 : 0.45,
                    transition:  'border-color 150ms ease, opacity 150ms ease',
                    flexShrink:  0,
                    letterSpacing: '0.04em',
                    userSelect:  'none',
                  }}
                >
                  {String(ti + 1).padStart(2, '0')}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── RIGHT — info area (~40% desktop) ── */}
        <div
          style={{
            flex:          isMobile ? 'none' : '2',
            padding:       isMobile ? '24px 20px 28px' : '40px 36px 36px',
            display:       'flex',
            flexDirection: 'column',
            gap:           '16px',
            minWidth:      0,
          }}
        >
          {/* Category tag */}
          <p
            style={{
              fontWeight:    600,
              fontSize:      '0.62rem',
              color:         '#AAFF00',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              marginBottom:  '-4px',
            }}
          >
            {project.category}
          </p>

          {/* Title — GlitchText triggers on mount and on hover */}
          <GlitchText
            tag="h2"
            style={{
              fontWeight:    800,
              fontSize:      isMobile ? '1.5rem' : '2rem',
              color:         '#1A1A1A',
              lineHeight:    1.1,
              letterSpacing: '-0.03em',
              margin:        0,
            }}
          >
            {project.title}
          </GlitchText>

          {/* Year */}
          <p
            style={{
              fontWeight: 400,
              fontSize:   '0.78rem',
              color:      '#8C8C8C',
              marginTop:  '-8px',
            }}
          >
            {project.year}
          </p>

          {/* Divider */}
          <div style={{ height: '1px', backgroundColor: '#D4D4D4', flexShrink: 0 }} />

          {/* Description */}
          <p
            style={{
              fontWeight:  400,
              fontSize:    '0.875rem',
              color:       '#1A1A1A',
              lineHeight:  1.85,
              flex:        1,
              minHeight:   0,
            }}
          >
            {project.description}
          </p>

          {/* Tools */}
          <div>
            <p
              style={{
                fontWeight:    600,
                fontSize:      '0.62rem',
                color:         '#8C8C8C',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                marginBottom:  '8px',
              }}
            >
              TOOLS
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {project.tools.map(tool => (
                <span
                  key={tool}
                  style={{
                    border:        '1px solid #1A1A1A',
                    padding:       '3px 10px',
                    fontSize:      '0.65rem',
                    fontWeight:    400,
                    color:         '#1A1A1A',
                    letterSpacing: '0.02em',
                    whiteSpace:    'nowrap',
                  }}
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>

          {/* Navigation row */}
          <div
            style={{
              display:        'flex',
              justifyContent: 'space-between',
              alignItems:     'center',
              paddingTop:     '16px',
              borderTop:      '1px solid #D4D4D4',
              marginTop:      '4px',
              flexShrink:     0,
            }}
          >
            <button
              onClick={onPrev}
              onMouseEnter={e => { e.currentTarget.style.color = '#AAFF00' }}
              onMouseLeave={e => { e.currentTarget.style.color = '#1A1A1A' }}
              style={{
                background:    'none',
                border:        'none',
                fontSize:      '0.7rem',
                fontWeight:    600,
                color:         '#1A1A1A',
                cursor:        'pointer',
                letterSpacing: '0.1em',
                transition:    'color 150ms ease',
                fontFamily:    'inherit',
                padding:       '4px 0',
                userSelect:    'none',
              }}
            >
              ← PREV
            </button>
            <span
              style={{
                fontSize:           '0.68rem',
                fontWeight:         400,
                color:              '#8C8C8C',
                fontVariantNumeric: 'tabular-nums',
                letterSpacing:      '0.04em',
              }}
            >
              {String(currentIdx + 1).padStart(2, '0')} / {String(N).padStart(2, '0')}
            </span>
            <button
              onClick={onNext}
              onMouseEnter={e => { e.currentTarget.style.color = '#AAFF00' }}
              onMouseLeave={e => { e.currentTarget.style.color = '#1A1A1A' }}
              style={{
                background:    'none',
                border:        'none',
                fontSize:      '0.7rem',
                fontWeight:    600,
                color:         '#1A1A1A',
                cursor:        'pointer',
                letterSpacing: '0.1em',
                transition:    'color 150ms ease',
                fontFamily:    'inherit',
                padding:       '4px 0',
                userSelect:    'none',
              }}
            >
              NEXT →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Work — main section ─── */
export default function Work() {
  const [activeView, setActiveView]   = useState('RING')
  const [currentCard, setCurrentCard] = useState(1)

  /* ── Modal state ── */
  const [selectedProject, setSelectedProject] = useState(null)
  const [isModalClosing,  setIsModalClosing]  = useState(false)

  /* ── Stable refs for rAF loop ── */
  const stageRef       = useRef(null)
  const cardEls        = useRef(new Array(N).fill(null))
  const rafRef         = useRef(null)
  const rotRef         = useRef(0)
  const activeViewRef  = useRef('RING')
  const mouseRef       = useRef({ x: 0, y: 0, inside: false })
  const hovRef         = useRef(-1)
  const frontRef       = useRef(1)
  const isPausedRef    = useRef(false)   /* pauses rotation + push while modal is open */
  const selProjRef     = useRef(null)    /* mirror of selectedProject for keyboard handler */
  const pushOff        = useRef(Array.from({ length: N }, () => ({ x: 0, y: 0 })))
  const curPos         = useRef(
    Array.from({ length: N }, () => ({
      x: 0, y: 0, z: 0, rotY: 0, rotZ: 0, rotX: 0, scale: 0.9, opacity: 0,
    }))
  )

  useEffect(() => { activeViewRef.current = activeView }, [activeView])
  useEffect(() => { selProjRef.current    = selectedProject }, [selectedProject])

  /* ── Modal open / close / navigate — all stable via refs or useCallback ── */
  const openModal = (project) => {
    isPausedRef.current  = true
    hovRef.current       = -1
    mouseRef.current     = { ...mouseRef.current, inside: false }
    setSelectedProject(project)
  }

  const closeModal = useCallback(() => {
    setIsModalClosing(true)
    setTimeout(() => {
      setIsModalClosing(false)
      setSelectedProject(null)
      isPausedRef.current = false
    }, 260)
  }, [])

  const goNext = useCallback(() => {
    const proj = selProjRef.current
    if (!proj) return
    const idx = PROJECTS.findIndex(p => p.num === proj.num)
    setSelectedProject(PROJECTS[(idx + 1) % N])
  }, [])

  const goPrev = useCallback(() => {
    const proj = selProjRef.current
    if (!proj) return
    const idx = PROJECTS.findIndex(p => p.num === proj.num)
    setSelectedProject(PROJECTS[(idx - 1 + N) % N])
  }, [])

  /* ── Keyboard: Escape closes, arrows navigate ── */
  useEffect(() => {
    const onKey = (e) => {
      if (!selProjRef.current) return
      if (e.key === 'Escape')     closeModal()
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft')  goPrev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [closeModal, goNext, goPrev])   /* all stable → runs once */

  /* ── Single rAF loop — gallery untouched except isPausedRef guard ── */
  useEffect(() => {
    const PUSH_R  = 220
    const PUSH_S  = 70
    const PL      = 0.12
    const LP      = 0.10
    const ROT_SPD = 0.15

    const tick = () => {
      /* Rotation pauses while modal is open */
      if (!isPausedRef.current) {
        rotRef.current += ROT_SPD
      }

      const stage = stageRef.current
      if (!stage) { rafRef.current = requestAnimationFrame(tick); return }

      const sw    = stage.clientWidth
      const sh    = stage.clientHeight
      const view  = activeViewRef.current
      const rot   = rotRef.current
      const mouse = mouseRef.current

      /* Push disabled while modal is open */
      const mX = (!isPausedRef.current && mouse.inside) ? mouse.x - sw / 2 : -99999
      const mY = (!isPausedRef.current && mouse.inside) ? mouse.y - sh / 2 : -99999

      let frontIdx = 0
      let maxDep   = -Infinity

      for (let i = 0; i < N; i++) {
        const el = cardEls.current[i]
        if (!el) continue

        const c  = curPos.current[i]
        const t  = getTarget(i, view, rot, sw, c.rotY)
        const po = pushOff.current[i]

        const approxX = t.x + po.x
        const approxY = t.y + po.y
        const dx      = approxX - mX
        const dy      = approxY - mY
        const dist    = Math.sqrt(dx * dx + dy * dy)
        let tpx = 0, tpy = 0
        if (mouse.inside && !isPausedRef.current && dist < PUSH_R && dist > 1) {
          const str = PUSH_S * (1 - dist / PUSH_R)
          tpx = (dx / dist) * str
          tpy = (dy / dist) * str
        }
        po.x += (tpx - po.x) * PL
        po.y += (tpy - po.y) * PL

        const fx = t.x + po.x
        const fy = t.y + po.y

        c.x       += (fx          - c.x)       * LP
        c.y       += (fy          - c.y)       * LP
        c.z       += (t.z         - c.z)       * LP
        c.scale   += (t.scale     - c.scale)   * LP
        c.opacity += (t.opacity   - c.opacity) * LP
        c.rotZ    += (t.rotZ      - c.rotZ)    * LP
        c.rotX    += (t.rotX      - c.rotX)    * LP

        let rd = t.rotY - c.rotY
        while (rd >  180) rd -= 360
        while (rd < -180) rd += 360
        c.rotY += rd * LP

        const hov  = hovRef.current === i
        const finZ = hov ? c.z + 60                 : c.z
        const finS = hov ? Math.max(c.scale, 1.08)  : c.scale
        const finO = hov ? 1                         : c.opacity

        el.style.transform = (
          `translateX(${c.x.toFixed(1)}px) ` +
          `translateY(${c.y.toFixed(1)}px) ` +
          `translateZ(${finZ.toFixed(1)}px) ` +
          `rotateY(${c.rotY.toFixed(2)}deg) ` +
          `rotateZ(${c.rotZ.toFixed(2)}deg) ` +
          `rotateX(${c.rotX.toFixed(2)}deg) ` +
          `scale(${finS.toFixed(3)})`
        )
        el.style.opacity       = finO.toFixed(3)
        el.style.zIndex        = hov ? '20' : String(t.zIdx)
        el.style.outline       = hov ? '2px solid #AAFF00' : 'none'
        el.style.outlineOffset = '-2px'
        el.style.boxShadow     = hov ? '0 8px 40px rgba(0,0,0,0.14)' : 'none'

        if (t.depth > maxDep) { maxDep = t.depth; frontIdx = i }
      }

      const next = frontIdx + 1
      if (next !== frontRef.current) {
        frontRef.current = next
        setCurrentCard(next)
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [])

  /* ── Stage event handlers — unchanged ── */
  const handleMouseMove = (e) => {
    const rect = stageRef.current?.getBoundingClientRect()
    if (!rect) return
    mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top, inside: true }
  }
  const handleMouseLeave = () => {
    mouseRef.current = { ...mouseRef.current, inside: false }
  }

  const touchStartRef = useRef(null)
  const handleTouchStart = (e) => {
    touchStartRef.current = { x: e.touches[0].clientX, rot: rotRef.current }
  }
  const handleTouchMove = (e) => {
    if (!touchStartRef.current) return
    const dx = e.touches[0].clientX - touchStartRef.current.x
    rotRef.current = touchStartRef.current.rot + dx * 0.35
  }
  const handleTouchEnd = () => { touchStartRef.current = null }

  return (
    <section
      id="work"
      style={{
        position:        'relative',
        backgroundColor: '#1C1C1C',
        scrollSnapAlign: 'start',
        scrollSnapStop:  'normal',
        minHeight:       '100vh',
        display:         'flex',
        flexDirection:   'column',
        justifyContent:  'center',
        padding:         '32px',
        boxSizing:       'border-box',
      }}
    >
      {/* ── Stage panel ── */}
      <div
        ref={stageRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          position:          'relative',
          backgroundColor:   '#EBEBEB',
          borderRadius:      '16px',
          height:            '80vh',
          overflow:          'hidden',
          perspective:       '1500px',
          perspectiveOrigin: '50% 50%',
        }}
      >
        {/* Top bar */}
        <div
          style={{
            position:       'absolute',
            top: 0, left: 0, right: 0,
            zIndex:         30,
            display:        'flex',
            justifyContent: 'space-between',
            alignItems:     'center',
            padding:        '24px 28px',
            flexWrap:       'wrap',
            gap:            '12px',
          }}
        >
          <p
            style={{
              fontWeight:    600,
              fontSize:      '0.875rem',
              color:         '#1A1A1A',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
            }}
          >
            SELECTED WORKS
          </p>
          <div
            style={{
              display:       'flex',
              gap:           '8px',
              flexWrap:      'nowrap',
              overflowX:     'auto',
              scrollbarWidth: 'none',
            }}
          >
            {VIEWS.map(v => (
              <ViewButton
                key={v}
                label={v}
                active={activeView === v}
                onClick={() => setActiveView(v)}
              />
            ))}
          </div>
        </div>

        {/* Cards — onClick triggers modal open */}
        {PROJECTS.map((project, i) => (
          <WorkCard
            key={project.num}
            project={project}
            setRef={el => { cardEls.current[i] = el }}
            onEnter={() => { hovRef.current = i }}
            onLeave={() => { hovRef.current = -1 }}
            onClick={() => openModal(project)}
          />
        ))}

        {/* Bottom bar */}
        <div
          style={{
            position:       'absolute',
            bottom: 0, left: 0, right: 0,
            zIndex:         30,
            display:        'flex',
            justifyContent: 'space-between',
            alignItems:     'center',
            padding:        '24px 28px',
            flexWrap:       'wrap',
            gap:            '8px',
          }}
        >
          <p
            style={{
              fontWeight:    400,
              fontSize:      '0.75rem',
              color:         'rgba(26,26,26,0.6)',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
            }}
          >
            SCROLL TO EXPLORE →
          </p>
          <p
            style={{
              fontWeight:         600,
              fontSize:           '0.875rem',
              color:              '#1A1A1A',
              letterSpacing:      '0.04em',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {String(currentCard).padStart(2, '0')} — {String(N).padStart(2, '0')}
          </p>
        </div>
      </div>

      {/* ── Project detail modal — rendered as fixed overlay outside stage ── */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          isClosing={isModalClosing}
          onClose={closeModal}
          onPrev={goPrev}
          onNext={goNext}
        />
      )}
    </section>
  )
}

import { useEffect, useLayoutEffect, useRef, useState } from 'react'

const TYPING_SPEED = 40

const TERMINAL_LINES = [
  { text: '> INITIALIZING...', pause: 800 },
  { text: '> SCANNING SUBJECT...', pause: 600 },
  { text: '> NAME: 박채빈', pause: 400 },
  { text: '> SCHOOL: 한림대 미래융합스쿨', pause: 400 },
  { text: '> MAJOR: 미래융합스쿨', pause: 400 },
  { text: '> WORKS: 포스터 디자인 · 장서표', pause: 400 },
  { text: '> TOOLS: Blender · Figma · Claude · Claude Code', pause: 400 },
  { text: '> SKILLS: [██████████] 100%', pause: 800 },
  { text: '> ACCESS GRANTED ✦', pause: 1000, isLast: true },
]

/* Keywords surrounding the profile photo.
   Photo bounding box on desktop (1440×900, 360×480):
     horizontal 37.5 % – 62.5 %, vertical 23.3 % – 76.7 %.
   All positions below are verified to be outside that box.

   finalOpacity: optional cap for elements that must appear faint
                 even after the burst (only "2026" uses this). */
const KEYWORDS = [
  /* Primary name — above photo, top-center */
  {
    text: '박채빈', weight: 800,
    size: '4.5rem', mobileSize: '2.5rem',
    color: '#AAFF00', left: '45%', top: '4%',
    delay: 200,
  },
  /* Top-right — clear of photo */
  {
    text: 'AI', weight: 800,
    size: '3.75rem', mobileSize: '2rem',
    color: '#AAFF00', left: '78%', top: '12%',
    delay: 600,
  },
  /* Top-left */
  {
    text: '26학번', weight: 800,
    size: '2.25rem', mobileSize: '1.375rem',
    color: '#AAFF00', left: '10%', top: '14%',
    delay: 1000,
  },
  /* Left-center — well outside 37.5 % left edge of photo */
  {
    text: 'DESIGN', weight: 800,
    size: '3rem', mobileSize: '1.75rem',
    color: '#F7F7F7', left: '5%', top: '42%',
    delay: 1400,
  },
  /* Right-center — well outside 62.5 % right edge */
  {
    text: 'Claude', weight: 800,
    size: '3rem', mobileSize: '1.625rem',
    color: '#F7F7F7', left: '76%', top: '40%',
    delay: 1800,
  },
  /* Bottom-right — below photo bottom (76.7 %) and past 62.5 % right edge */
  {
    text: '디지털인문예술', weight: 700,
    size: '1.875rem', mobileSize: '0.875rem',
    color: '#F7F7F7', left: '68%', top: '74%',
    delay: 2200,
  },
  /* Bottom-left */
  {
    text: '한림대학교 재학중', weight: 700,
    size: '1.5rem', mobileSize: '0.7rem',
    color: '#F7F7F7', left: '8%', top: '76%',
    delay: 2600,
  },
  /* Bottom-center — below photo and below tagline (~86 % on desktop) */
  {
    text: '미래융합스쿨', weight: 700,
    size: '1.875rem', mobileSize: '1rem',
    color: '#F7F7F7', left: '40%', top: '88%',
    delay: 3000,
  },
  /* Decorative year — bottom-right corner, clear of everything.
     finalOpacity: 0.3 keeps it faint even after the burst. */
  {
    text: '2026', weight: 400,
    size: '1.5rem', mobileSize: '1rem',
    color: '#F7F7F7', left: '88%', top: '90%',
    delay: 3400, finalOpacity: 0.3,
  },
]

function TypewriterText({ text, delay = 0, style }) {
  const [displayed, setDisplayed] = useState('')
  const [started, setStarted]     = useState(false)
  const [done, setDone]           = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), delay)
    return () => clearTimeout(t)
  }, [delay])

  useEffect(() => {
    if (!started) return
    let i = 0
    setDisplayed('')
    setDone(false)
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i + 1))
      i++
      if (i >= text.length) {
        clearInterval(interval)
        setDone(true)
      }
    }, 80)
    return () => clearInterval(interval)
  }, [started, text])

  return (
    <span style={style}>
      {displayed}
      {!done && <span className="blink">|</span>}
    </span>
  )
}

export default function AboutMe() {
  const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0

  const sw          = window.innerWidth
  const photoWidth  = sw < 768 ? '240px' : sw < 1024 ? '300px' : '360px'
  const photoHeight = sw < 768 ? '320px' : sw < 1024 ? '400px' : '480px'

  const [revealed, setRevealed]             = useState(false)
  const [terminalLines, setTerminalLines]   = useState([])
  const [currentTyping, setCurrentTyping]   = useState('')
  const [photoRevealStage, setPhotoRevealStage] = useState(0)

  const flashlightRef    = useRef(null)
  const keywordRefs      = useRef([])
  const photoRef         = useRef(null)
  const mousePosRef      = useRef({ x: -9999, y: -9999 })
  const rafScheduledRef  = useRef(false)
  const revealedRef      = useRef(false)

  /* Set initial keyword/photo styles synchronously before first paint.
     Opacity and transform are managed DOM-direct to avoid React overwriting
     them during animation frames. */
  useLayoutEffect(() => {
    keywordRefs.current.forEach(el => {
      if (!el) return
      el.style.transition = 'none'
      el.style.opacity    = isMobile ? '0.15' : '0'
      el.style.transform  = 'translate(0, 0) scale(1)'
    })
    if (photoRef.current) {
      photoRef.current.style.transition = 'none'
      photoRef.current.style.opacity    = isMobile ? '0.15' : '0'
      photoRef.current.style.border     = '1px solid #AAFF00'
      photoRef.current.style.transform  = 'scale(1)'
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  /* Terminal — sequential character-by-character with pauses */
  useEffect(() => {
    const timeouts       = []
    let totalDelay       = 0
    const completedLines = []

    TERMINAL_LINES.forEach((line) => {
      for (let i = 0; i <= line.text.length; i++) {
        const t = totalDelay + i * TYPING_SPEED
        timeouts.push(setTimeout(() => setCurrentTyping(line.text.slice(0, i)), t))
      }
      totalDelay += line.text.length * TYPING_SPEED + 1

      timeouts.push(
        setTimeout(() => {
          const snapshot = [...completedLines, line.text]
          setTerminalLines(snapshot)
          completedLines.push(line.text)
          setCurrentTyping('')
        }, totalDelay)
      )

      totalDelay += line.pause

      if (line.isLast) {
        timeouts.push(
          setTimeout(() => {
            setRevealed(true)
            revealedRef.current = true
            if (photoRef.current) {
              photoRef.current.style.transition = 'none'
              photoRef.current.style.opacity    = '0'
            }
          }, totalDelay)
        )
      }
    })

    return () => timeouts.forEach(clearTimeout)
  }, [])

  /* Phase 2 — radial burst: photo scales in, keywords fly to resting positions */
  useEffect(() => {
    if (!revealed) return
    const timeouts = []

    /* Reset photo to burst-start state */
    if (photoRef.current) {
      photoRef.current.style.transition  = 'none'
      photoRef.current.style.opacity     = '0'
      photoRef.current.style.transform   = 'scale(0.8)'
      photoRef.current.style.borderWidth = '0px'
      photoRef.current.style.boxShadow   = 'none'
    }

    /* Snap keywords toward section center so they can burst outward */
    keywordRefs.current.forEach(el => {
      if (!el) return
      const rect = el.getBoundingClientRect()
      const cx   = window.innerWidth  / 2
      const cy   = window.innerHeight / 2
      const dx   = cx - (rect.left + rect.width  / 2)
      const dy   = cy - (rect.top  + rect.height / 2)
      el.style.transition = 'none'
      el.style.opacity    = '0'
      el.style.transform  = `translate(${dx}px, ${dy}px) scale(0.3)`
    })

    const rafId = requestAnimationFrame(() => {
      /* Photo bursts in */
      if (photoRef.current) {
        photoRef.current.style.transition =
          'opacity 400ms ease-out, transform 400ms ease-out, border-width 300ms ease, box-shadow 300ms ease'
        photoRef.current.style.opacity     = '1'
        photoRef.current.style.transform   = 'scale(1)'
        photoRef.current.style.borderWidth = '1px'
        photoRef.current.style.boxShadow   = '0 0 20px rgba(170,255,0,0.3)'
      }

      /* Keywords fly to resting positions with staggered delay.
         Each keyword's final opacity is capped by finalOpacity (default 1). */
      keywordRefs.current.forEach((el, i) => {
        if (!el) return
        const kw      = KEYWORDS[i]
        const finOpa  = String(kw?.finalOpacity ?? 1)
        const d       = `${i * 80}ms`
        el.style.transition =
          `transform 700ms cubic-bezier(0.16, 1, 0.3, 1) ${d}, ` +
          `opacity   700ms cubic-bezier(0.16, 1, 0.3, 1) ${d}`
        el.style.transform = 'translate(0, 0) scale(1)'
        el.style.opacity   = finOpa
      })
    })

    /* Scanline pass */
    timeouts.push(setTimeout(() => setPhotoRevealStage(2), 1000))
    /* Photo content fades in */
    timeouts.push(setTimeout(() => setPhotoRevealStage(3), 1400))
    /* "> SUBJECT IDENTIFIED" types out */
    timeouts.push(setTimeout(() => setPhotoRevealStage(4), 1600))
    /* Tagline fades in */
    timeouts.push(setTimeout(() => setPhotoRevealStage(5), 1800))

    return () => {
      timeouts.forEach(clearTimeout)
      cancelAnimationFrame(rafId)
    }
  }, [revealed])

  /* Flashlight gradient + distance-based opacity — desktop only, Phase 1.
     finalOpacity caps the maximum brightness a keyword can reach under the beam. */
  useEffect(() => {
    if (isMobile) return

    const updateVisuals = () => {
      rafScheduledRef.current = false
      const { x, y } = mousePosRef.current

      if (flashlightRef.current) {
        const radius = revealedRef.current ? 300 : 180
        const peak   = revealedRef.current ? 0.09 : 0.13
        const mid    = revealedRef.current ? 0.04 : 0.06
        flashlightRef.current.style.background =
          `radial-gradient(circle ${radius}px at ${x}px ${y}px, ` +
          `rgba(255,255,255,${peak}) 0%, ` +
          `rgba(255,255,255,${mid}) 40%, ` +
          `transparent 70%)`
      }

      if (!revealedRef.current) {
        keywordRefs.current.forEach((el, i) => {
          if (!el) return
          const r      = el.getBoundingClientRect()
          const cx     = r.left + r.width  / 2
          const cy     = r.top  + r.height / 2
          const d      = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2)
          const maxOpa = KEYWORDS[i]?.finalOpacity ?? 1
          el.style.opacity = d < 200
            ? String(((1 - d / 200) * maxOpa).toFixed(3))
            : '0'
        })
        if (photoRef.current) {
          const r  = photoRef.current.getBoundingClientRect()
          const cx = r.left + r.width  / 2
          const cy = r.top  + r.height / 2
          const d  = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2)
          photoRef.current.style.opacity = d < 200
            ? String((1 - d / 200).toFixed(3))
            : '0'
        }
      }
    }

    const onMouseMove = (e) => {
      mousePosRef.current = { x: e.clientX, y: e.clientY }
      if (!rafScheduledRef.current) {
        rafScheduledRef.current = true
        requestAnimationFrame(updateVisuals)
      }
    }

    window.addEventListener('mousemove', onMouseMove)
    return () => window.removeEventListener('mousemove', onMouseMove)
  }, [isMobile])

  return (
    <div
      id="about-me"
      style={{
        scrollSnapAlign:  'start',
        scrollSnapStop:   'normal',
        minHeight:        '100vh',
        position:         'relative',
        overflow:         'hidden',
        backgroundColor:  '#1C1C1C',
      }}
    >
      {/* Local noise grain */}
      <svg
        style={{
          position:      'absolute',
          top: 0, left: 0,
          width: '100%', height: '100%',
          zIndex:        25,
          pointerEvents: 'none',
          opacity:       0.1,
        }}
      >
        <filter id="grain-aboutme">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain-aboutme)" />
      </svg>

      {/* Flashlight overlay — desktop only */}
      {!isMobile && (
        <div
          ref={flashlightRef}
          style={{
            position:      'absolute',
            top: 0, left: 0,
            width: '100%', height: '100%',
            zIndex:        20,
            pointerEvents: 'none',
            background:    'transparent',
          }}
        />
      )}

      {/* Scattered keyword elements.
          Font sizes respond to screen width via sw check.
          Opacity and transform are driven DOM-direct by the effects above. */}
      {KEYWORDS.map((kw, i) => (
        <div
          key={kw.text}
          ref={el => { keywordRefs.current[i] = el }}
          style={{
            position:      'absolute',
            left:          kw.left,
            top:           kw.top,
            fontSize:      sw < 768 ? kw.mobileSize : kw.size,
            fontWeight:    kw.weight,
            color:         kw.color,
            lineHeight:    1,
            letterSpacing: '-0.02em',
            pointerEvents: 'none',
            userSelect:    'none',
            zIndex:        10,
            willChange:    'transform, opacity',
            whiteSpace:    'nowrap',
          }}
        >
          <TypewriterText text={kw.text} delay={kw.delay} />
        </div>
      ))}

      {/* Profile photo — centering wrapper (React) + inner div (DOM-direct) */}
      <div
        style={{
          position:  'absolute',
          left:      '50%',
          top:       '50%',
          transform: 'translate(-50%, -50%)',
          width:     photoWidth,
          height:    photoHeight,
          zIndex:    15,
          pointerEvents: 'none',
        }}
      >
        <div
          ref={photoRef}
          style={{
            width:          '100%',
            height:         '100%',
            overflow:       'hidden',
            display:        'flex',
            flexDirection:  'column',
            alignItems:     'center',
            justifyContent: 'center',
          }}
        >
          {/* Scanline pass — stage 2 only */}
          {photoRevealStage === 2 && (
            <div
              className="scanline-pass"
              style={{
                position:      'absolute',
                top: 0, left: 0,
                width:         '100%',
                height:        '100%',
                background:    'linear-gradient(to bottom, transparent 0%, rgba(170,255,0,0.18) 50%, transparent 100%)',
                zIndex:        2,
                pointerEvents: 'none',
              }}
            />
          )}

          <span
            style={{
              fontWeight:    800,
              fontSize:      '2rem',
              color:         '#F7F7F7',
              letterSpacing: '-0.04em',
              position:      'relative',
              zIndex:        1,
            }}
          >
            CB
          </span>
          <p
            style={{
              fontSize:  '0.65rem',
              fontWeight: 400,
              color:     'rgba(255,255,255,0.25)',
              marginTop: '8px',
              position:  'relative',
              zIndex:    1,
            }}
          >
            프로필 사진
          </p>
        </div>

        {/* Labels and tagline — below photo, inside wrapper */}
        {photoRevealStage >= 4 && (
          <div
            style={{
              position:      'absolute',
              top:           '100%',
              left:          '50%',
              transform:     'translateX(-50%)',
              marginTop:     '12px',
              pointerEvents: 'none',
              textAlign:     'center',
            }}
          >
            <div style={{ whiteSpace: 'nowrap' }}>
              <TypewriterText
                text="> SUBJECT IDENTIFIED"
                delay={0}
                style={{
                  color:         '#AAFF00',
                  fontSize:      '0.7rem',
                  fontWeight:    400,
                  letterSpacing: '0.05em',
                }}
              />
            </div>

            <div
              style={{
                marginTop:  '12px',
                opacity:    photoRevealStage >= 5 ? 1 : 0,
                transition: 'opacity 400ms ease',
              }}
            >
              <p
                style={{
                  color:     '#F7F7F7',
                  opacity:   0.6,
                  fontSize:  sw < 768 ? '0.7rem' : '0.8rem',
                  fontWeight: 400,
                  whiteSpace: sw < 768 ? 'normal' : 'nowrap',
                  maxWidth:  sw < 768 ? '260px' : 'none',
                }}
              >
                디지털과 인문, 인간과 AI의 교차점에서
              </p>
              <p
                style={{
                  color:      '#AAFF00',
                  fontSize:   sw < 768 ? '0.875rem' : '1rem',
                  fontWeight: 600,
                  marginTop:  '4px',
                  whiteSpace: sw < 768 ? 'normal' : 'nowrap',
                }}
              >
                이제 막 첫 페이지를 씁니다
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Terminal block */}
      <div
        style={{
          position:        'absolute',
          bottom:          '48px',
          left:            '48px',
          zIndex:          30,
          backgroundColor: 'rgba(0,0,0,0.6)',
          padding:         '16px 20px',
          border:          '1px solid rgba(170,255,0,0.4)',
          maxWidth:        'calc(100% - 96px)',
        }}
      >
        {terminalLines.map((line, i) => (
          <div
            key={i}
            className="text-xs md:text-sm"
            style={{
              color:         '#AAFF00',
              letterSpacing: '0.02em',
              lineHeight:    '1.7',
              whiteSpace:    'pre',
            }}
          >
            {line}
          </div>
        ))}
        {!revealed && (
          <div
            className="text-xs md:text-sm"
            style={{
              color:         '#AAFF00',
              letterSpacing: '0.02em',
              lineHeight:    '1.7',
              whiteSpace:    'pre',
            }}
          >
            {currentTyping}
            <span className="blink" style={{ marginLeft: '1px' }}>|</span>
          </div>
        )}
      </div>

      {/* SCROLL TO EXPLORE label — Phase 2 only */}
      {revealed && (
        <div
          className="pulse-label"
          style={{
            position:      'absolute',
            top:           '72px',
            right:         '32px',
            zIndex:        30,
            color:         '#AAFF00',
            fontSize:      '0.75rem',
            fontWeight:    400,
            letterSpacing: '0.1em',
          }}
        >
          SCROLL TO EXPLORE ↓
        </div>
      )}
    </div>
  )
}

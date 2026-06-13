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

/*
  Zone map (desktop, ~1440×900):

  CENTER: photo (360×480) + "> SUBJECT IDENTIFIED" + taglines
          Centered at 50%/50%.  Horizontal ~37.5%–62.5%, vertical ~23%–77%
          No keyword may enter this bounding box.

  A  top-left      26학번            left:4%   top:8%
  B  top-center    박채빈            left:40%  top:4%
  C  top-right     AI                left:80%  top:8%
  D  mid-left      design            left:4%   top:44%   (< 37.5% horiz, clear of photo)
  E  mid-right     Claude            left:72%  top:44%   (> 62.5% horiz)
  F  bottom-left   한림대학교 재학중   left:4%   top:58%   (above terminal ~64.7%, left of photo)
  H  bottom-right  디지털인문예술     left:68%  top:78%   (right of center labels)
  G  far-right     2026              left:85%  top:92%   (past H's right edge, below labels)

  "미래융합스쿨" removed — redundant with 한림대학교 재학중.
  finalOpacity: optional opacity cap applied in both burst and flashlight phases.
  hideOnMobile: element is hidden on screens narrower than 768px.
*/
const KEYWORDS = [
  { text: '박채빈',           weight: 800, size: '3.75rem', mobileSize: '1.875rem',
    color: '#AAFF00', left: '40%', top: '4%', mobileLeft: '32%', mobileTop: '3%',
    delay: 200 },
  { text: 'AI',              weight: 800, size: '3.75rem', mobileSize: '2rem',
    color: '#AAFF00', left: '80%', top: '8%', mobileLeft: '72%', mobileTop: '12%',
    delay: 600 },
  { text: '26학번',           weight: 800, size: '2.25rem', mobileSize: '1.375rem',
    color: '#AAFF00', left: '4%',  top: '8%', mobileLeft: '3%',  mobileTop: '12%',
    delay: 1000 },
  { text: 'design',          weight: 800, size: '3rem',    mobileSize: '1.75rem',
    color: '#F7F7F7', left: '4%',  top: '44%', mobileLeft: '3%', mobileTop: '83%',
    delay: 1400 },
  { text: 'Claude',          weight: 800, size: '3rem',    mobileSize: '1.625rem',
    color: '#F7F7F7', left: '72%', top: '44%', mobileLeft: '55%', mobileTop: '83%',
    delay: 1800 },
  { text: '디지털인문예술',    weight: 700, size: '1.5rem',  mobileSize: '0.875rem',
    color: '#F7F7F7', left: '68%', top: '78%', mobileLeft: '52%', mobileTop: '90%',
    delay: 2200 },
  { text: '한림대학교 재학중', weight: 700, size: '1.25rem', mobileSize: '0.7rem',
    color: '#F7F7F7', left: '4%',  top: '58%', mobileLeft: '3%', mobileTop: '90%',
    delay: 2600 },
  { text: '2026',            weight: 400, size: '1.25rem', mobileSize: '1rem',
    color: '#F7F7F7', left: '85%', top: '92%', mobileLeft: '85%', mobileTop: '92%',
    delay: 3000, finalOpacity: 0.3, hideOnMobile: true },
]

/* Typewriter that respects an `active` gate.
   When active becomes false: timers clear, displayed resets to ''.
   When active becomes true:  delay fires, then character-by-character typing starts.
   Default active=true keeps existing callers that don't pass the prop working. */
function TypewriterText({ text, delay = 0, style, active = true }) {
  const [displayed, setDisplayed] = useState('')
  const [started, setStarted]     = useState(false)
  const [done, setDone]           = useState(false)

  useEffect(() => {
    if (!active) {
      setStarted(false)
      setDisplayed('')
      setDone(false)
      return
    }
    const t = setTimeout(() => setStarted(true), delay)
    return () => clearTimeout(t)
  }, [active, delay])

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
      {!done && active && <span className="blink">|</span>}
    </span>
  )
}

export default function AboutMe() {
  const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0

  const sw          = window.innerWidth
  const photoWidth  = sw < 768 ? '240px' : '360px'
  const photoHeight = sw < 768 ? '320px' : '480px'

  const [revealed, setRevealed]                 = useState(false)
  const [terminalLines, setTerminalLines]       = useState([])
  const [currentTyping, setCurrentTyping]       = useState('')
  const [photoRevealStage, setPhotoRevealStage] = useState(0)

  /* Section-level visibility: drives terminal start/reset and flashlight gate */
  const [sectionInView, setSectionInView]       = useState(false)
  const sectionInViewRef                        = useRef(false)

  const sectionRef      = useRef(null)
  const flashlightRef   = useRef(null)
  const keywordRefs     = useRef([])
  const photoRef        = useRef(null)
  const mousePosRef     = useRef({ x: -9999, y: -9999 })
  const rafScheduledRef = useRef(false)
  const revealedRef     = useRef(false)

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

  /* Watch the section element — fires on every entry/exit so animations replay */
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        sectionInViewRef.current = entry.isIntersecting
        setSectionInView(entry.isIntersecting)
      },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  /* Terminal sequence + full reset on scroll-out.
     When sectionInView goes false: clear all timers, reset every piece of state
     and every DOM style back to the initial hidden state.
     When sectionInView goes true: start the terminal sequence from scratch. */
  useEffect(() => {
    if (!sectionInView) {
      /* Reset React state */
      setRevealed(false)
      revealedRef.current = false
      setTerminalLines([])
      setCurrentTyping('')
      setPhotoRevealStage(0)

      /* Reset keyword DOM styles to initial hidden state */
      keywordRefs.current.forEach(el => {
        if (!el) return
        el.style.transition = 'none'
        el.style.opacity    = isMobile ? '0.15' : '0'
        el.style.transform  = 'translate(0, 0) scale(1)'
      })

      /* Reset photo DOM styles */
      if (photoRef.current) {
        photoRef.current.style.transition  = 'none'
        photoRef.current.style.opacity     = isMobile ? '0.15' : '0'
        photoRef.current.style.border      = '1px solid #AAFF00'
        photoRef.current.style.transform   = 'scale(1)'
        photoRef.current.style.boxShadow   = 'none'
      }

      return
    }

    /* Section entered viewport — start terminal typing from the beginning */
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
  }, [sectionInView]) // eslint-disable-line react-hooks/exhaustive-deps

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

    /* Snap keywords toward section center so they burst outward */
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
      /* Photo animates in: scale 0.8→1, opacity 0→1, border + glow */
      if (photoRef.current) {
        photoRef.current.style.transition =
          'opacity 400ms ease-out, transform 400ms ease-out, border-width 300ms ease, box-shadow 300ms ease'
        photoRef.current.style.opacity     = '1'
        photoRef.current.style.transform   = 'scale(1)'
        photoRef.current.style.borderWidth = '1px'
        photoRef.current.style.boxShadow   = '0 0 20px rgba(170,255,0,0.3)'
      }

      /* Keywords fly to resting positions.
         finalOpacity caps the target opacity (only "2026" uses 0.3). */
      keywordRefs.current.forEach((el, i) => {
        if (!el) return
        const kw     = KEYWORDS[i]
        const finOpa = String(kw?.finalOpacity ?? 1)
        const d      = `${i * 80}ms`
        el.style.transition =
          `transform 700ms cubic-bezier(0.16, 1, 0.3, 1) ${d}, ` +
          `opacity   700ms cubic-bezier(0.16, 1, 0.3, 1) ${d}`
        el.style.transform = 'translate(0, 0) scale(1)'
        el.style.opacity   = finOpa
      })
    })

    /* Stage 2 — scanline pass over photo (~600ms after burst starts) */
    timeouts.push(setTimeout(() => setPhotoRevealStage(2), 1000))
    /* Stage 3 — scanline clears (~400ms of animation) */
    timeouts.push(setTimeout(() => setPhotoRevealStage(3), 1400))
    /* Stage 4 — "> SUBJECT IDENTIFIED" types out (~900ms) */
    timeouts.push(setTimeout(() => setPhotoRevealStage(4), 1600))
    /* Stage 5 — taglines fade in */
    timeouts.push(setTimeout(() => setPhotoRevealStage(5), 1800))

    return () => {
      timeouts.forEach(clearTimeout)
      cancelAnimationFrame(rafId)
    }
  }, [revealed])

  /* Flashlight gradient + distance-based opacity — desktop only, Phase 1.
     Gated on sectionInViewRef so it does nothing while the section is off-screen.
     finalOpacity caps the maximum brightness a keyword can reach under the beam. */
  useEffect(() => {
    if (isMobile) return

    const updateVisuals = () => {
      rafScheduledRef.current = false
      if (!sectionInViewRef.current) return
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
      ref={sectionRef}
      style={{
        scrollSnapAlign: 'start',
        scrollSnapStop:  'normal',
        minHeight:       '100vh',
        position:        'relative',
        overflow:        'hidden',
        backgroundColor: '#1C1C1C',
      }}
    >
      {/* Local noise grain */}
      <svg
        style={{
          position:      'absolute',
          top: 0, left: 0,
          width:         '100%',
          height:        '100%',
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
            width:         '100%',
            height:        '100%',
            zIndex:        20,
            pointerEvents: 'none',
            background:    'transparent',
          }}
        />
      )}

      {/* Scattered keywords — one per zone.
          hideOnMobile items are hidden on screens narrower than 768px.
          active={sectionInView} so TypewriterText resets and replays on re-entry. */}
      {KEYWORDS.map((kw, i) => (
        <div
          key={kw.text}
          ref={el => { keywordRefs.current[i] = el }}
          style={{
            position:      'absolute',
            display:       kw.hideOnMobile && sw < 768 ? 'none' : undefined,
            left:          sw < 768 ? kw.mobileLeft : kw.left,
            top:           sw < 768 ? kw.mobileTop  : kw.top,
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
          <TypewriterText text={kw.text} delay={kw.delay} active={sectionInView} />
        </div>
      ))}

      {/* CENTER zone: photo (360×480 / 240×320) + labels stacked below with gap-3 */}
      <div
        style={{
          position:      'absolute',
          left:          '50%',
          top:           '50%',
          transform:     'translate(-50%, -50%)',
          width:         photoWidth,
          height:        photoHeight,
          zIndex:        15,
          pointerEvents: 'none',
        }}
      >
        {/* Profile photo placeholder — backgroundColor makes it visible as a bordered card */}
        <div
          ref={photoRef}
          style={{
            width:           '100%',
            height:          '100%',
            overflow:        'hidden',
            position:        'relative',
            backgroundColor: '#1C1C1C',
            display:         'flex',
            flexDirection:   'column',
            alignItems:      'center',
            justifyContent:  'center',
          }}
        >
          {/* Scanline pass — animates across the photo face at stage 2 */}
          {photoRevealStage === 2 && (
            <div
              className="scanline-pass"
              style={{
                position:      'absolute',
                top: 0, left: 0,
                width:         '100%',
                height:        '100%',
                background:    'linear-gradient(to bottom, transparent 0%, rgba(170,255,0,0.15) 50%, transparent 100%)',
                zIndex:        2,
                pointerEvents: 'none',
              }}
            />
          )}

          {/* Profile photo */}
          <img
            src="/profile.jpg"
            alt="박채빈"
            style={{
              width:          '100%',
              height:         '100%',
              objectFit:      'cover',
              objectPosition: 'top center',
              display:        'block',
              position:       'relative',
              zIndex:         1,
            }}
          />
        </div>

        {/* Labels — gap-3 (12px) between each: SUBJECT IDENTIFIED, tagline 1, tagline 2 */}
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
              display:       'flex',
              flexDirection: 'column',
              alignItems:    'center',
              gap:           '12px',
            }}
          >
            <div style={{ whiteSpace: 'nowrap' }}>
              <TypewriterText
                text="> SUBJECT IDENTIFIED"
                delay={0}
                active={sectionInView}
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
                opacity:       photoRevealStage >= 5 ? 1 : 0,
                transition:    'opacity 400ms ease',
                display:       'flex',
                flexDirection: 'column',
                alignItems:    'center',
                gap:           '12px',
              }}
            >
              <p
                style={{
                  color:      '#F7F7F7',
                  opacity:    0.6,
                  fontSize:   sw < 768 ? '0.7rem' : '0.8rem',
                  fontWeight: 400,
                  whiteSpace: sw < 768 ? 'normal' : 'nowrap',
                  maxWidth:   sw < 768 ? '260px' : 'none',
                }}
              >
                디지털과 인문, 인간과 AI의 교차점에서
              </p>
              <p
                style={{
                  color:      '#AAFF00',
                  fontSize:   sw < 768 ? '0.875rem' : '1rem',
                  fontWeight: 600,
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

      {/* SCROLL TO EXPLORE — Phase 2 only */}
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

import { useEffect, useRef, useState } from 'react'

const BOOT_LINES = [
  '> SYSTEM BOOT',
  '> LOADING PORTFOLIO...',
  '> RENDERING INTERFACE...',
  '> READY ✦',
]

export default function TVIntro({ onComplete }) {
  const [phase, setPhase]                     = useState(0)
  const [done, setDone]                       = useState(false)
  const [currentBootLine, setCurrentBootLine] = useState(-1)
  const [bootFadeOut, setBootFadeOut]         = useState(false)

  const bootJitterRef = useRef(null)
  const bootTextRef   = useRef(null)

  useEffect(() => {
    const timeouts = []

    // Phase 1 (100ms): power-on dot
    timeouts.push(setTimeout(() => setPhase(1), 100))

    // Phase 2 (250ms): dot → horizontal line
    timeouts.push(setTimeout(() => setPhase(2), 250))

    // Phase 3 (400ms): line → fullscreen expand, background fades from white to dark
    timeouts.push(setTimeout(() => setPhase(3), 400))

    // Phase 4 (750ms): noise fills screen, boot text sequence begins
    timeouts.push(
      setTimeout(() => {
        setPhase(4)
        setCurrentBootLine(0)
        bootJitterRef.current = setInterval(() => {
          if (bootTextRef.current) {
            const x = ((Math.random() - 0.5) * 2).toFixed(1)
            bootTextRef.current.style.transform =
              `translate(-50%, -50%) translateX(${x}px)`
          }
        }, 100)
      }, 750)
    )

    // Boot text advances every 250ms
    timeouts.push(setTimeout(() => setCurrentBootLine(1), 1000))
    timeouts.push(setTimeout(() => setCurrentBootLine(2), 1250))
    timeouts.push(setTimeout(() => setCurrentBootLine(3), 1500))

    // Phase 5 (1850ms): noise clears, boot text fades out
    timeouts.push(
      setTimeout(() => {
        setPhase(5)
        setBootFadeOut(true)
        clearInterval(bootJitterRef.current)
        if (bootTextRef.current) {
          bootTextRef.current.style.transform = 'translate(-50%, -50%)'
        }
      }, 1850)
    )

    // Phase 6 (2500ms): TVIntro fades out AND site content begins fading in simultaneously.
    // Both transitions run concurrently for 300ms so there is never a dark gap.
    timeouts.push(
      setTimeout(() => {
        setPhase(6)
        if (onComplete) onComplete()
      }, 2500)
    )

    // Done (2800ms): unmount after fade-out transition finishes (300ms after phase 6).
    timeouts.push(setTimeout(() => setDone(true), 2800))

    return () => {
      timeouts.forEach(clearTimeout)
      clearInterval(bootJitterRef.current)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (done) return null

  const containerStyle = {
    position:        'fixed',
    top:             0,
    left:            0,
    width:           '100vw',
    height:          '100vh',
    zIndex:          9999,
    overflow:        'hidden',
    backgroundColor: '#1C1C1C',
    pointerEvents:   phase >= 5 ? 'none' : 'auto',
    // Pre-declare opacity transition at phase 5 so when phase 6 sets opacity:0
    // the browser animates cleanly rather than snapping.
    opacity:         phase >= 6 ? 0 : 1,
    transition:      phase >= 5 ? 'opacity 300ms ease' : undefined,
  }

  return (
    <div style={containerStyle}>

      {/* Phase 1: power-on dot — 6px circle, centered, glowing */}
      {phase === 1 && (
        <div
          style={{
            position:        'absolute',
            top:             '50%',
            left:            '50%',
            marginTop:       '-3px',
            marginLeft:      '-3px',
            width:           '6px',
            height:          '6px',
            borderRadius:    '50%',
            backgroundColor: '#F7F7F7',
            boxShadow:       '0 0 20px #F7F7F7, 0 0 40px #AAFF00',
            transform:       'scale(0.2)',
            opacity:         0,
            animation:       'crt-dot 150ms ease-out forwards',
          }}
        />
      )}

      {/* Phase 2: horizontal line — spans full width, stays 3px tall, scaleX 0.01→1 */}
      {phase === 2 && (
        <div
          style={{
            position:        'absolute',
            top:             '50%',
            left:            0,
            right:           0,
            height:          '3px',
            marginTop:       '-1.5px',
            backgroundColor: '#F7F7F7',
            boxShadow:       '0 0 20px #F7F7F7, 0 0 40px #AAFF00',
            transformOrigin: 'center',
            transform:       'scaleX(0.01)',
            animation:       'crt-line-h 150ms cubic-bezier(0.25,0.46,0.45,0.94) forwards',
          }}
        />
      )}

      {/* Phase 3: fullscreen expand — scaleY 0.004→1, background #F7F7F7→#1C1C1C,
          lime edge glow fades as screen fills */}
      {phase === 3 && (
        <div
          style={{
            position:        'absolute',
            top:             0,
            left:            0,
            width:           '100%',
            height:          '100%',
            backgroundColor: '#F7F7F7',
            transformOrigin: 'center',
            transform:       'scaleY(0.004)',
            animation:       'crt-line-v 350ms cubic-bezier(0.25,0.46,0.45,0.94) forwards',
          }}
        />
      )}

      {/* Phase 4–5: noise + scan interference layer */}
      {phase >= 4 && (
        <div
          className={phase >= 5 ? 'noise-clear' : ''}
          style={{
            position: 'absolute',
            top:      0,
            left:     0,
            width:    '100%',
            height:   '100%',
            ...(phase < 5 ? { opacity: 0.9 } : {}),
          }}
        >
          <svg
            style={{
              position: 'absolute',
              top:      0,
              left:     0,
              width:    '100%',
              height:   '100%',
              opacity:  0.9,
            }}
          >
            <filter id="tv-noise">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.85"
                numOctaves="4"
                seed="2"
                stitchTiles="stitch"
              >
                <animate
                  attributeName="seed"
                  values="1;5;2;8;3;6;1"
                  dur="0.15s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="baseFrequency"
                  values="0.85;0.9;0.8;0.95;0.85"
                  dur="0.2s"
                  repeatCount="indefinite"
                />
              </feTurbulence>
              <feColorMatrix type="saturate" values="0" />
            </filter>
            <rect width="100%" height="100%" filter="url(#tv-noise)" opacity="0.95" />
          </svg>

          <div
            className="scan-flicker"
            style={{
              position:        'absolute',
              top:             0,
              left:            0,
              width:           '100%',
              height:          '100%',
              backgroundImage: 'repeating-linear-gradient(to bottom, transparent 0px, transparent 3px, rgba(255,255,255,0.06) 3px, rgba(255,255,255,0.06) 4px)',
              pointerEvents:   'none',
            }}
          />
        </div>
      )}

      {/* Boot text overlay — Phase 4 only; fades out when noise clears at Phase 5 */}
      {phase >= 4 && (
        <div
          ref={bootTextRef}
          style={{
            position:   'absolute',
            top:        '50%',
            left:       '50%',
            transform:  'translate(-50%, -50%)',
            zIndex:     50,
            textAlign:  'center',
            opacity:    bootFadeOut ? 0 : 1,
            transition: 'opacity 300ms ease',
          }}
        >
          {currentBootLine >= 0 && (
            <p
              className="font-semibold"
              style={{
                color:         '#AAFF00',
                fontSize:      'clamp(0.75rem, 1.5vw, 1rem)',
                letterSpacing: '0.1em',
                whiteSpace:    'nowrap',
              }}
            >
              {BOOT_LINES[Math.min(currentBootLine, BOOT_LINES.length - 1)]}
              <span className="blink-fast">▋</span>
            </p>
          )}
        </div>
      )}

    </div>
  )
}

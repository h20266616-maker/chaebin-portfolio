import { useEffect, useState } from 'react'

export default function TVIntro({ onComplete }) {
  const [phase, setPhase] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const timeouts = []

    // Phase 1 (300ms): horizontal thin line appears
    timeouts.push(setTimeout(() => setPhase(1), 300))

    // Phase 2 (350ms): line expands to fill screen, background shifts
    timeouts.push(setTimeout(() => setPhase(2), 350))

    // Phase 3 (700ms): noise and scan lines fill screen
    timeouts.push(setTimeout(() => setPhase(3), 700))

    // Phase 4 (1800ms): noise begins clearing
    timeouts.push(setTimeout(() => setPhase(4), 1800))

    // Phase 5 (2500ms): TVIntro fades out, notify parent
    timeouts.push(
      setTimeout(() => {
        setPhase(5)
        if (onComplete) onComplete()
      }, 2500)
    )

    // Done (2800ms): unmount
    timeouts.push(setTimeout(() => setDone(true), 2800))

    return () => timeouts.forEach(clearTimeout)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (done) return null

  const containerStyle = (() => {
    const base = {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 9999,
      overflow: 'hidden',
      pointerEvents: phase >= 4 ? 'none' : 'auto',
    }
    if (phase >= 5) {
      return {
        ...base,
        backgroundColor: '#1C1C1C',
        opacity: 0,
        transition: 'opacity 300ms ease',
      }
    }
    if (phase >= 2) {
      return {
        ...base,
        backgroundColor: '#1C1C1C',
        opacity: 1,
        transition: 'background-color 350ms ease',
      }
    }
    return {
      ...base,
      backgroundColor: '#161616',
      opacity: 1,
    }
  })()

  return (
    <div style={containerStyle}>
      {/* White line that expands into full screen fill */}
      {phase >= 1 && (
        <div
          className={phase >= 2 ? 'tv-expand' : ''}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'white',
            transformOrigin: 'center',
            ...(phase === 1 ? { transform: 'scaleY(0.002)' } : {}),
          }}
        />
      )}

      {/* Noise + scan interference layer */}
      {phase >= 3 && (
        <div
          className={phase >= 4 ? 'noise-clear' : ''}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            ...(phase < 4 ? { opacity: 0.9 } : {}),
          }}
        >
          <svg
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              opacity: 0.9,
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
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundImage:
                'repeating-linear-gradient(to bottom, transparent 0px, transparent 3px, rgba(255,255,255,0.06) 3px, rgba(255,255,255,0.06) 4px)',
              pointerEvents: 'none',
            }}
          />
        </div>
      )}
    </div>
  )
}

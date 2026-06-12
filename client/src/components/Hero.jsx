import { useEffect, useRef } from 'react'
import GlitchText from './GlitchText'
import CRTOverlay from './CRTOverlay'

export default function Hero() {
  const contentRef = useRef(null)

  useEffect(() => {
    let timeoutId = null
    let resetId = null

    const scheduleGlitch = () => {
      const delay = 3000 + Math.random() * 4000
      timeoutId = setTimeout(() => {
        if (contentRef.current) {
          contentRef.current.style.transform = 'translateX(3px) skewX(0.4deg)'
          resetId = setTimeout(() => {
            if (contentRef.current) {
              contentRef.current.style.transform = 'none'
            }
          }, 80)
        }
        scheduleGlitch()
      }, delay)
    }

    scheduleGlitch()
    return () => {
      clearTimeout(timeoutId)
      clearTimeout(resetId)
    }
  }, [])

  return (
    <section
      id="hero"
      className="min-h-screen text-white pt-16 flex flex-col relative overflow-hidden pb-16 md:pb-24"
      style={{ scrollSnapAlign: 'start', scrollSnapStop: 'normal', minHeight: '100vh', backgroundColor: '#1C1C1C' }}
    >
      <CRTOverlay />

      <div ref={contentRef} className="flex-1 flex flex-col justify-end">
        {/* Oversized "PORTFOLIO" — bleeds off right edge */}
        <div className="overflow-hidden px-6 md:px-12 mb-12">
          <GlitchText
            className="font-extrabold text-white whitespace-nowrap leading-none tracking-tighter"
            style={{ fontSize: 'clamp(80px, 15vw, 240px)', display: 'block' }}
          >
            PORTFOLIO
          </GlitchText>
        </div>

        {/* Two-column caption row */}
        <div className="px-6 md:px-12 flex flex-col md:flex-row md:justify-between md:items-end gap-6 md:gap-0">

          {/* LEFT COLUMN */}
          <div>
            <div
              style={{
                width: '40px',
                height: '1px',
                backgroundColor: '#AAFF00',
                marginBottom: '12px',
              }}
            />
            <p className="text-sm tracking-widest" style={{ color: '#F7F7F7', opacity: 0.5 }}>
              20266616
            </p>
            <p className="text-sm" style={{ color: '#F7F7F7', opacity: 0.5 }}>
              미래융합스쿨
            </p>
            <p
              className="text-xl font-bold"
              style={{ color: '#F7F7F7', marginTop: '16px' }}
            >
              박채빈 × 2026
            </p>
          </div>

          {/* RIGHT COLUMN */}
          <div className="md:text-right">
            <p
              className="text-lg font-semibold"
              style={{ color: '#F7F7F7', opacity: 0.8 }}
            >
              디지털인문예술
            </p>
            <div style={{ marginTop: '20px' }}>
              <p
                className="text-base font-normal"
                style={{ color: '#F7F7F7', opacity: 0.6 }}
              >
                디지털과 인문, 인간과 AI의 교차점에서
              </p>
              <p
                className="text-2xl md:text-2xl font-bold"
                style={{ color: '#AAFF00', marginTop: '4px' }}
              >
                이제 막 첫 페이지를 씁니다
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom rule */}
      <div
        className="mx-6 md:mx-12 mt-12"
        style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}
      />
    </section>
  )
}

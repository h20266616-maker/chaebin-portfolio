import { useEffect, useRef, useState } from 'react'
import StaggerText from './StaggerText'

const skills = [
  'Blender',
  'Figma',
  'Illustrator',
  'Claude',
  'Claude Code',
  'Antigravity IDE',
  'GitHub',
  'Vercel',
  'Google Gemini',
  'ChatGPT',
  'Flow',
  'Design',
]

const info = [
  { label: '이름', value: '박채빈' },
  { label: '소속', value: '미래융합스쿨 디지털인문예술' },
  { label: '전공', value: '미래융합스쿨' },
  { label: '이메일', value: 'h20266616@glab.hallym.ac.kr' },
]

function FadeInOnScroll({ children, delay = 0 }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 600ms ease-out ${delay}ms, transform 600ms ease-out ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

export default function About() {
  return (
    <section id="about" className="flex flex-col md:flex-row" style={{ scrollSnapAlign: 'start', scrollSnapStop: 'normal', minHeight: '100vh' }}>
      {/* Left panel — black */}
      <div className="text-white md:w-5/12 px-10 md:px-14 py-20 relative overflow-hidden flex flex-col justify-between min-h-80 md:min-h-screen" style={{ backgroundColor: '#1C1C1C' }}>
        {/* Rotated decorative "ABOUT" */}
        <div
          className="absolute font-extrabold pointer-events-none select-none leading-none"
          style={{
            fontSize: 'clamp(80px, 10vw, 160px)',
            color: '#ffffff',
            opacity: 0.18,
            writingMode: 'vertical-rl',
            transform: 'rotate(180deg)',
            right: '-0.05em',
            top: '50%',
            marginTop: '-2em',
            letterSpacing: '-0.05em',
          }}
        >
          ABOUT
        </div>

        <div className="relative z-10">
          <StaggerText
            tag="p"
            className="font-semibold text-xs tracking-widest uppercase mb-8"
            style={{ color: '#AAFF00' }}
          >
            ✦ 소개
          </StaggerText>
          <FadeInOnScroll delay={200}>
            <p className="font-normal text-base leading-8" style={{ color: 'rgba(255,255,255,0.78)' }}>
              디지털인문예술 전공생으로, 포스터 디자인과
              장서표(Ex Libris) 제작을 중심으로 시각 언어를 탐구합니다.
              아날로그의 질감과 디지털의 정밀함을 결합하여
              의미 있는 시각적 경험을 만들어갑니다.
            </p>
          </FadeInOnScroll>
        </div>

        <div className="relative z-10 mt-12">
          <div className="w-10 h-px mb-4" style={{ backgroundColor: 'rgba(255,255,255,0.18)' }} />
          <FadeInOnScroll delay={400}>
            <p className="font-normal text-xs tracking-wider" style={{ color: 'rgba(255,255,255,0.3)' }}>
              현재 미래융합스쿨 재학중
            </p>
          </FadeInOnScroll>
        </div>
      </div>

      {/* Right panel — white */}
      <div className="text-black md:w-7/12 px-10 md:px-14 py-20 flex flex-col gap-12" style={{ backgroundColor: '#F7F7F7' }}>
        <div>
          <StaggerText
            tag="h3"
            className="font-semibold text-xs uppercase tracking-widest mb-5 pb-3"
            style={{ borderBottom: '1px solid #000000' }}
          >
            기본 정보
          </StaggerText>
          <FadeInOnScroll delay={150}>
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              {info.map(({ label, value }) => (
                <div key={label}>
                  <p className="font-semibold text-xs uppercase tracking-wider mb-1.5 text-black">
                    {label}
                  </p>
                  <p className="font-normal text-sm text-black">{value}</p>
                </div>
              ))}
            </div>
          </FadeInOnScroll>
        </div>

        <div>
          <StaggerText
            tag="h3"
            className="font-semibold text-xs uppercase tracking-widest mb-5 pb-3"
            style={{ borderBottom: '1px solid #000000' }}
          >
            스킬
          </StaggerText>
          <FadeInOnScroll delay={150}>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="px-4 py-1.5 text-xs font-normal text-black cursor-default transition-colors duration-200"
                  style={{ border: '1px solid #000000' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#AAFF00'
                    e.currentTarget.style.borderColor = '#AAFF00'
                    e.currentTarget.style.color = '#1A1A1A'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.borderColor = '#000000'
                    e.currentTarget.style.color = '#000000'
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </FadeInOnScroll>
        </div>
      </div>
    </section>
  )
}

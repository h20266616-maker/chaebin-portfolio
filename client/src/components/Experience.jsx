import { useEffect, useRef, useState } from 'react'
import StaggerText from './StaggerText'

const experiences = [
  {
    title:    '한림대학교 입학',
    org:      '',
    year:     '2026',
    featured: true,
  },
  {
    title:    '중앙동아리 하얀도화지 운영진',
    org:      '',
    year:     '2026',
    featured: false,
  },
  {
    title:    'ISO 동아리 활동',
    org:      '',
    year:     '2026',
    featured: false,
  },
]

const awards = [
  {
    title:    '디지털인문예술전공 기말프로젝트 전시회 홍보 포스터 공모전 장려상 수상',
    org:      '',
    year:     '2026',
    featured: true,
  },
  {
    title:    '강원과 함께 하는 도서관 - 장서표 디자인 공모전 최우수상 수상',
    org:      '',
    year:     '2026',
    featured: false,
  },
  {
    title:    '디지털인문예술전공 전시회 우수상 수상',
    org:      '',
    year:     '2026-1학기',
    featured: false,
  },
]

/* Watches a container element and stagger-reveals its `count` items on
   every viewport entry. When the container scrolls out, all items reset
   to hidden so the animation replays on the next re-entry. */
function useRevealList(count) {
  const containerRef  = useRef(null)
  const [revealed, setRevealed] = useState(() => Array(count).fill(false))
  const timeoutsRef   = useRef([])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        timeoutsRef.current.forEach(clearTimeout)
        timeoutsRef.current = []

        if (!entry.isIntersecting) {
          setRevealed(Array(count).fill(false))
          return
        }

        for (let i = 0; i < count; i++) {
          const t = setTimeout(() => {
            setRevealed(prev => {
              const next = [...prev]
              next[i]    = true
              return next
            })
          }, i * 120)
          timeoutsRef.current.push(t)
        }
      },
      { threshold: 0.2 }
    )
    observer.observe(el)
    return () => {
      observer.disconnect()
      timeoutsRef.current.forEach(clearTimeout)
    }
  }, [count])

  return [containerRef, revealed]
}

function Timeline({ items, revealed }) {
  return (
    <div>
      {items.map((item, i) => {
        const delay      = i * 120
        const isRevealed = revealed[i] ?? false

        return (
          <div key={i} className="flex gap-4">
            <div className="flex flex-col items-center flex-shrink-0" style={{ width: '12px' }}>
              <div
                className="rounded-full flex-shrink-0"
                style={{
                  width:           '10px',
                  height:          '10px',
                  marginTop:       '5px',
                  backgroundColor: item.featured ? '#AAFF00' : '#1A1A1A',
                  transform:       isRevealed ? 'scale(1)' : 'scale(0)',
                  transition:      `transform 400ms cubic-bezier(0.175, 0.885, 0.32, 1.275) ${delay + 50}ms`,
                }}
              />
              {i < items.length - 1 && (
                <div
                  style={{
                    width:           '1px',
                    flex:            1,
                    marginTop:       '4px',
                    backgroundColor: 'rgba(0,0,0,0.18)',
                    minHeight:       '2.5rem',
                    transformOrigin: 'top',
                    transform:       isRevealed ? 'scaleY(1)' : 'scaleY(0)',
                    transition:      `transform 400ms cubic-bezier(0.16, 1, 0.3, 1) ${delay + 50}ms`,
                  }}
                />
              )}
            </div>

            <div
              className="pb-9 flex-1"
              style={{
                ...(item.featured
                  ? { borderLeft: '2px solid #AAFF00', paddingLeft: '1rem' }
                  : { paddingLeft: '0.5rem' }),
                opacity:    isRevealed ? 1 : 0,
                transform:  isRevealed ? 'translateY(0)' : 'translateY(24px)',
                transition: `opacity 600ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 600ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
              }}
            >
              <p className="font-bold text-base leading-snug text-black">{item.title}</p>
              {item.org && (
                <p className="font-semibold text-sm mt-1 text-black">{item.org}</p>
              )}
              <p
                className="font-normal text-xs mt-1.5"
                style={{
                  color:      'rgba(0,0,0,0.45)',
                  opacity:    isRevealed ? 1 : 0,
                  transition: `opacity 600ms cubic-bezier(0.16, 1, 0.3, 1) ${delay + 80}ms`,
                }}
              >
                {item.year}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function Experience() {
  const [careerRef, careerRevealed] = useRevealList(experiences.length)
  const [awardsRef, awardsRevealed] = useRevealList(awards.length)

  return (
    <section
      id="experience"
      className="py-24 relative overflow-hidden"
      style={{
        backgroundColor: '#EBEBEB',
        color:           '#1A1A1A',
        scrollSnapAlign: 'start',
        scrollSnapStop:  'normal',
        minHeight:       '100vh',
      }}
    >
      <div className="px-6 md:px-12 mb-16">
        <StaggerText
          tag="h2"
          className="font-extrabold text-black leading-none tracking-tighter"
          style={{ fontSize: 'clamp(8vw, 10vw, 120px)' }}
        >
          EXPERIENCE
        </StaggerText>
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-14">
        <div className="grid md:grid-cols-2 gap-14 md:gap-20">
          <div>
            <StaggerText
              tag="h3"
              className="font-semibold text-xs uppercase tracking-widest mb-10 pb-3"
              style={{ borderBottom: '1px solid #000000' }}
            >
              경력
            </StaggerText>
            <div ref={careerRef}>
              <Timeline items={experiences} revealed={careerRevealed} />
            </div>
          </div>

          <div>
            <StaggerText
              tag="h3"
              className="font-semibold text-xs uppercase tracking-widest mb-10 pb-3"
              style={{ borderBottom: '1px solid #000000' }}
            >
              수상
            </StaggerText>
            <div ref={awardsRef}>
              <Timeline items={awards} revealed={awardsRevealed} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

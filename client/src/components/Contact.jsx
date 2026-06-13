import { useState } from 'react'
import GlitchText from './GlitchText'
import { useScramble } from '../hooks/useScramble'

const contactItems = [
  { label: '전화번호', value: '010-1234-5678' },
  { label: '이메일', value: 'h20266616@glab.hallym.ac.kr' },
  { label: 'GitHub', value: 'github.com/chaebin' },
]

const STACK_PILLS = [
  'Claude Code',
  'Antigravity IDE',
  'React',
  'Vite',
  'Tailwind CSS',
  'GitHub',
  'Vercel',
]

function ScrambleLabel({ text, marginTop }) {
  const { display, start, stop } = useScramble(text)
  return (
    <p
      className="font-semibold text-xs tracking-widest uppercase cursor-default"
      style={{ color: '#AAFF00', marginBottom: '12px', marginTop: marginTop ?? 0 }}
      onMouseEnter={start}
      onMouseLeave={stop}
    >
      {display}
    </p>
  )
}

function StackPill({ label }) {
  const [hovered, setHovered] = useState(false)
  return (
    <span
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        border:          '1px solid rgba(247,247,247,0.3)',
        padding:         '4px 12px',
        fontSize:        '0.7rem',
        fontWeight:      400,
        letterSpacing:   '0.04em',
        color:           hovered ? '#1A1A1A' : '#F7F7F7',
        backgroundColor: hovered ? '#AAFF00' : 'transparent',
        transition:      'background-color 150ms ease, color 150ms ease',
        whiteSpace:      'nowrap',
        cursor:          'default',
        userSelect:      'none',
      }}
    >
      {label}
    </span>
  )
}

export default function Contact() {
  return (
    <footer
      id="contact"
      className="text-white relative overflow-hidden"
      style={{
        backgroundColor: '#1C1C1C',
        borderTop:       '1px solid #ffffff',
        scrollSnapAlign: 'start',
        scrollSnapStop:  'normal',
        minHeight:       '100vh',
      }}
    >
      {/* Decorative large name — bottom right, clipped */}
      <div
        className="absolute bottom-0 right-0 font-extrabold text-white pointer-events-none select-none leading-none whitespace-nowrap"
        style={{
          fontSize:      'clamp(48px, 10vw, 160px)',
          opacity:       0.06,
          transform:     'translateY(20%)',
          letterSpacing: '-0.04em',
        }}
      >
        PARKCHAEBEEN
      </div>

      <div className="section-container section-padding pt-20 relative z-10">

        {/* ── HOW THIS SITE WAS MADE + DESIGN DIRECTION ── */}
        <div
          style={{
            borderTop:    '1px solid rgba(247,247,247,0.1)',
            paddingTop:   '32px',
            marginBottom: '48px',
          }}
        >
          {/* Section 1 */}
          <ScrambleLabel text="HOW THIS SITE WAS MADE" />
          <p
            className="font-normal text-sm leading-relaxed"
            style={{ color: 'rgba(247,247,247,0.8)', maxWidth: '640px', marginBottom: '16px' }}
          >
            이 포트폴리오 웹사이트는 Claude Code와 Antigravity IDE로 직접 코드를 작성하고 수정하며 만들었습니다. React, Vite, Tailwind CSS로 구축한 뒤 GitHub에 커밋·푸시하고, Vercel로 배포까지 마쳤습니다. 빌드 오류, 파일 용량 문제 같은 시행착오를 거치며 완성한 결과물입니다.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {STACK_PILLS.map(label => (
              <StackPill key={label} label={label} />
            ))}
          </div>

          {/* Section 2 */}
          <ScrambleLabel text="DESIGN DIRECTION" marginTop="24px" />
          <p
            className="font-normal text-sm leading-relaxed"
            style={{ color: 'rgba(247,247,247,0.8)', maxWidth: '640px' }}
          >
            디지털인문예술이라는 정체성에 맞춰, 색감부터 인터랙션까지 여러 차례 실험하며 방향을 다듬었습니다. 더 쨍하고 디지털적인 느낌을 위해 네온 라임(#AAFF00)과 차콜 블랙(#1C1C1C)의 2색 대비로 정착했습니다. 첫 화면은 TV가 켜지듯 작은 점에서 화면 전체로 확장되며 노이즈가 걷히는 인트로로 시작하고, 이름과 타이틀에는 글리치 효과와 텍스트 스크램블을 적용해 디지털 신호 같은 질감을 더했습니다. INTRO 페이지는 어두운 화면을 마우스로 비추면 키워드가 하나씩 드러나고, 터미널 로그가 타이핑되며 프로필 사진이 스캔라인과 함께 등장하는 인터랙티브 경험으로 구성했습니다. WORK 페이지는 작품 카드가 3D로 배치되는 갤러리에 FLAT·TILT·RING·GALLERY 네 가지 보기 모드를 두었고, 클릭하면 작품 이미지·영상·소개글·작업 과정을 블러 배경과 함께 보여주는 모달이 열립니다. 전체적으로 큼직한 타이포그래피와 노이즈 그레인, 스크롤 스냅을 더해 매거진처럼 한 장씩 넘기는 에디토리얼 무드를 완성했습니다.
          </p>
        </div>

        {/* ── Let's Contact heading ── */}
        <div className="mb-16">
          <p className="font-semibold text-xs tracking-widest uppercase mb-4" style={{ color: '#AAFF00' }}>
            ✦ 연락하기
          </p>
          <h2
            className="font-extrabold leading-none tracking-tighter"
            style={{ fontSize: 'clamp(40px, 8vw, 120px)' }}
          >
            Let's{' '}
            <GlitchText tag="span" style={{ color: '#AAFF00' }}>
              Contact
            </GlitchText>
          </h2>
        </div>

        {/* ── Contact items ── */}
        <div className="mb-20 max-w-lg">
          {contactItems.map((item, i) => (
            <div
              key={item.label}
              className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0 py-5"
              style={{
                borderBottom:
                  i < contactItems.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none',
              }}
            >
              <span
                className="font-semibold text-xs uppercase tracking-widest sm:w-32 flex-shrink-0"
                style={{ color: '#AAFF00' }}
              >
                {item.label}
              </span>
              <span className="font-normal text-base text-white">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Footer copyright ── */}
      <div
        className="section-container section-padding py-5 relative z-10"
        style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}
      >
        <p className="font-normal text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
          © 2026 박채빈. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

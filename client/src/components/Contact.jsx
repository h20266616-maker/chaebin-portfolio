import GlitchText from './GlitchText'

const contactItems = [
  { label: '전화번호', value: '010-1234-5678' },
  { label: '이메일', value: 'h20266616@glab.hallym.ac.kr' },
  { label: 'GitHub', value: 'github.com/chaebin' },
]

export default function Contact() {
  return (
    <footer
      id="contact"
      className="text-white relative overflow-hidden"
      style={{ backgroundColor: '#1C1C1C', borderTop: '1px solid #ffffff', scrollSnapAlign: 'start', scrollSnapStop: 'normal', minHeight: '100vh' }}
    >
      {/* Decorative large name — bottom right, clipped */}
      <div
        className="absolute bottom-0 right-0 font-extrabold text-white pointer-events-none select-none leading-none whitespace-nowrap"
        style={{
          fontSize: 'clamp(48px, 10vw, 160px)',
          opacity: 0.06,
          transform: 'translateY(20%)',
          letterSpacing: '-0.04em',
        }}
      >
        채빈
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-20 relative z-10">
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
              Connect
            </GlitchText>
          </h2>
        </div>

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

      <div
        className="max-w-7xl mx-auto px-6 md:px-12 py-5 relative z-10"
        style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}
      >
        <p className="font-normal text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
          © 2026 박채빈. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

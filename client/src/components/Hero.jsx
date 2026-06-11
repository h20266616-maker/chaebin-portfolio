export default function Hero() {
  return (
    <section className="min-h-screen bg-black text-white flex items-center pt-16 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 py-20 w-full">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-12 md:gap-20">

          <div className="flex-1 order-1">
            {/* 위에서 */}
            <p
              className="hero-from-top font-semibold text-xs tracking-widest uppercase mb-6"
              style={{ color: '#f3a2e3', animationDelay: '0s' }}
            >
              포트폴리오 · 2024
            </p>

            {/* 왼쪽에서 */}
            <h1
              className="hero-from-left font-bold text-5xl md:text-7xl leading-tight mb-7"
              style={{ animationDelay: '0.2s' }}
            >
              <span style={{ color: '#f3a2e3' }}>박채빈</span>은 디인예에서<br />
              제일 잘나갑니다
            </h1>

            {/* 아래에서 */}
            <p
              className="hero-from-bottom font-normal text-lg md:text-xl leading-relaxed mb-6"
              style={{ color: 'rgba(255,255,255,0.75)', animationDelay: '0.45s' }}
            >
              디자인과 개발의 경계에서<br />
              사람을 위한 경험을 만들어갑니다.
            </p>

            {/* 아래에서 — 한 박자 더 늦게 */}
            <p
              className="hero-from-bottom font-normal text-sm pl-4 leading-relaxed"
              style={{
                color: 'rgba(255,255,255,0.55)',
                borderLeft: '2px solid #f3a2e3',
                animationDelay: '0.65s',
              }}
            >
              UX 디자이너 &amp; 프론트엔드 개발자
            </p>
          </div>

          {/* 오른쪽에서 */}
          <div
            className="hero-from-right order-2 flex-shrink-0"
            style={{ animationDelay: '0.1s' }}
          >
            <div
              className="w-56 h-72 md:w-72 md:h-96 bg-black flex flex-col items-center justify-center relative overflow-hidden"
              style={{ border: '2px solid #ffffff' }}
            >
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
                style={{ border: '2px solid #ffffff' }}
              >
                <span className="font-bold text-3xl text-white">채</span>
              </div>
              <p className="font-normal text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
                프로필 사진
              </p>
              <div
                className="absolute bottom-0 left-0 right-0 h-1"
                style={{ backgroundColor: '#f3a2e3' }}
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

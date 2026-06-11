export default function Hero() {
  return (
    <section className="min-h-screen bg-black text-white flex items-center pt-16">
      <div className="max-w-6xl mx-auto px-6 py-20 w-full">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-12 md:gap-20">

          <div className="flex-1 order-1">
            <p
              className="font-semibold text-xs tracking-widest uppercase mb-6"
              style={{ color: '#f3a2e3' }}
            >
              포트폴리오 · 2024
            </p>
            <h1 className="font-bold text-5xl md:text-7xl leading-tight mb-7">
              안녕하세요,<br />
              저는{' '}
              <span
                className="relative inline-block"
                style={{ color: '#f3a2e3' }}
              >
                박채빈
                <span
                  className="absolute left-0 bottom-0 w-full h-0.5"
                  style={{ backgroundColor: '#f3a2e3' }}
                />
              </span>
              입니다.
            </h1>
            <p className="font-normal text-lg md:text-xl leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.75)' }}>
              디자인과 개발의 경계에서<br />
              사람을 위한 경험을 만들어갑니다.
            </p>
            <p
              className="font-normal text-sm pl-4 leading-relaxed"
              style={{
                color: 'rgba(255,255,255,0.55)',
                borderLeft: '2px solid #f3a2e3',
              }}
            >
              UX 디자이너 &amp; 프론트엔드 개발자
            </p>
          </div>

          <div className="order-2 flex-shrink-0">
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

const projects = [
  {
    title: '여행 플래너 앱',
    description:
      '사용자 맞춤형 여행 일정을 자동으로 생성하는 모바일 앱. React Native와 AI를 활용하여 개인화된 여행 경험을 제공하며, 실시간 날씨 및 혼잡도 정보를 반영합니다.',
    tag: 'UX · 모바일',
  },
  {
    title: '포트폴리오 빌더',
    description:
      '디자이너 및 개발자를 위한 포트폴리오 생성 시스템. 관리자 패널을 통해 콘텐츠를 수정하고, 다양한 레이아웃 템플릿을 선택할 수 있습니다.',
    tag: '웹 개발',
  },
  {
    title: '식단 관리 대시보드',
    description:
      '하루 영양소 섭취를 추적하고 시각화하는 웹 대시보드. Next.js와 Recharts를 사용하여 섭취 패턴을 직관적으로 분석할 수 있습니다.',
    tag: '데이터 시각화',
  },
  {
    title: '소셜 독서 플랫폼',
    description:
      '독서 기록을 공유하고 다른 사람의 서평을 탐색하는 소셜 플랫폼. 직관적인 UI와 부드러운 사용자 경험에 집중하여 설계했습니다.',
    tag: 'UI 디자인 · 풀스택',
  },
]

export default function Work() {
  return (
    <section id="work" className="bg-black text-white py-24">
      <div className="max-w-6xl mx-auto px-6">
        <h2
          className="font-bold text-4xl md:text-5xl mb-16 pb-6"
          style={{ borderBottom: '1px solid #ffffff' }}
        >
          WORK
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {projects.map((project, i) => (
            <div
              key={i}
              className="p-8 cursor-pointer transition-colors duration-200 group"
              style={{ border: '1px solid #ffffff' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#f3a2e3'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#ffffff'
              }}
            >
              <p
                className="font-semibold text-xs tracking-widest uppercase mb-4"
                style={{ color: '#f3a2e3' }}
              >
                {project.tag}
              </p>
              <h3 className="font-bold text-2xl mb-3 text-white">
                {project.title}
              </h3>
              <p
                className="font-normal text-sm leading-7"
                style={{ color: 'rgba(255,255,255,0.65)' }}
              >
                {project.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const skills = [
  'React', 'TypeScript', 'Next.js', 'Vite',
  'Tailwind CSS', 'Figma', 'Adobe XD', 'Framer',
  'Node.js', 'Python', 'UI/UX 디자인', 'Git',
]

const experiences = [
  {
    role: '프론트엔드 개발자',
    org: '(주) 테크스타트업',
    date: '2024.03 — 현재',
  },
  {
    role: 'UX 디자인 인턴',
    org: '크리에이티브 스튜디오',
    date: '2023.07 — 2023.12',
  },
  {
    role: '웹 개발 프리랜서',
    org: '개인 프로젝트 및 외주',
    date: '2022.01 — 2023.06',
  },
]

const awards = [
  {
    name: '대학생 UI/UX 디자인 공모전 최우수상',
    issuer: '한국디자인진흥원',
    year: '2024',
  },
  {
    name: '스타트업 해커톤 우수상',
    issuer: '서울창업허브',
    year: '2023',
  },
  {
    name: '캡스톤 디자인 프로젝트 우수상',
    issuer: '학교 컴퓨터공학부',
    year: '2023',
  },
]

export default function About() {
  return (
    <section id="about" className="bg-white text-black py-24">
      <div className="max-w-6xl mx-auto px-6">
        <h2
          className="font-bold text-4xl md:text-5xl mb-16 pb-6"
          style={{ borderBottom: '1px solid #000000' }}
        >
          ABOUT
        </h2>

        <div className="grid md:grid-cols-2 gap-16">

          <div className="space-y-14">
            <div>
              <h3 className="font-semibold text-xs uppercase tracking-widest mb-5">
                소개
              </h3>
              <p className="font-normal text-base leading-8">
                안녕하세요, 저는 박채빈입니다. 사용자 중심의 인터페이스를 설계하고
                개발하는 것을 좋아합니다. 디자인의 감각과 개발의 논리를 함께 갖추어
                더 나은 디지털 경험을 만들어가고 있습니다. 현재는 프론트엔드 개발과
                UX 디자인을 병행하며 다양한 프로젝트에 참여하고 있습니다.
                사람들이 불편함 없이 제품을 사용할 수 있도록, 작은 디테일까지
                신경 쓰는 작업을 지향합니다.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-xs uppercase tracking-widest mb-5">
                스택
              </h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-4 py-1.5 text-sm font-normal cursor-default transition-colors duration-200"
                    style={{ border: '1px solid #000000' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#f3a2e3'
                      e.currentTarget.style.borderColor = '#f3a2e3'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent'
                      e.currentTarget.style.borderColor = '#000000'
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-14">
            <div>
              <h3 className="font-semibold text-xs uppercase tracking-widest mb-5">
                경력
              </h3>
              <div className="space-y-0">
                {experiences.map((exp, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center pt-1.5">
                      <div
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: '#000000' }}
                      />
                      {i < experiences.length - 1 && (
                        <div
                          className="w-px flex-1 my-1"
                          style={{ backgroundColor: 'rgba(0,0,0,0.2)', minHeight: '2rem' }}
                        />
                      )}
                    </div>
                    <div className="pb-7">
                      <p className="font-semibold text-base">{exp.role}</p>
                      <p className="font-normal text-sm mt-0.5">{exp.org}</p>
                      <p className="font-normal text-xs mt-1" style={{ color: 'rgba(0,0,0,0.45)' }}>
                        {exp.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-xs uppercase tracking-widest mb-5">
                수상
              </h3>
              <div className="space-y-5">
                {awards.map((award, i) => (
                  <div
                    key={i}
                    className="pl-4"
                    style={{ borderLeft: '2px solid #f3a2e3' }}
                  >
                    <p className="font-semibold text-base">{award.name}</p>
                    <p className="font-normal text-sm mt-0.5">{award.issuer}</p>
                    <p
                      className="font-normal text-xs mt-1"
                      style={{ color: 'rgba(0,0,0,0.45)' }}
                    >
                      {award.year}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

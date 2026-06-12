import StaggerText from './StaggerText'

const experiences = [
  {
    title: '한림대학교 입학',
    org: '',
    year: '2026',
    featured: true,
  },
  {
    title: '중앙동아리 하얀도화지 운영진',
    org: '',
    year: '2026',
    featured: false,
  },
  {
    title: 'ISO 동아리 활동',
    org: '',
    year: '2026',
    featured: false,
  },
]

const awards = [
  {
    title: '디지털인문예술전공 기말프로젝트 전시회 홍보 포스터 공모전 장려상 수상',
    org: '',
    year: '2026',
    featured: true,
  },
  {
    title: '강원과 함께 하는 도서관 - 장서표 디자인 공모전 최우수상 수상',
    org: '',
    year: '2026',
    featured: false,
  },
  {
    title: '디지털인문예술전공 전시회 우수상 수상',
    org: '',
    year: '2026-1학기',
    featured: false,
  },
]

function Timeline({ items }) {
  return (
    <div>
      {items.map((item, i) => (
        <div key={i} className="flex gap-4">
          <div className="flex flex-col items-center flex-shrink-0" style={{ width: '12px' }}>
            <div
              className="rounded-full flex-shrink-0"
              style={{
                width: '10px',
                height: '10px',
                marginTop: '5px',
                backgroundColor: item.featured ? '#AAFF00' : '#1A1A1A',
              }}
            />
            {i < items.length - 1 && (
              <div
                style={{
                  width: '1px',
                  flex: 1,
                  marginTop: '4px',
                  backgroundColor: 'rgba(0,0,0,0.18)',
                  minHeight: '2.5rem',
                }}
              />
            )}
          </div>
          <div
            className="pb-9 flex-1"
            style={
              item.featured
                ? { borderLeft: '2px solid #AAFF00', paddingLeft: '1rem' }
                : { paddingLeft: '0.5rem' }
            }
          >
            <p className="font-bold text-base leading-snug text-black">{item.title}</p>
            {item.org && (
              <p className="font-semibold text-sm mt-1 text-black">{item.org}</p>
            )}
            <p className="font-normal text-xs mt-1.5" style={{ color: 'rgba(0,0,0,0.45)' }}>
              {item.year}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function Experience() {
  return (
    <section id="experience" className="py-24 relative overflow-hidden" style={{ backgroundColor: '#EBEBEB', color: '#1A1A1A', scrollSnapAlign: 'start', scrollSnapStop: 'normal', minHeight: '100vh' }}>
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
            <h3
              className="font-semibold text-xs uppercase tracking-widest mb-10 pb-3"
              style={{ borderBottom: '1px solid #000000' }}
            >
              경력
            </h3>
            <Timeline items={experiences} />
          </div>
          <div>
            <h3
              className="font-semibold text-xs uppercase tracking-widest mb-10 pb-3"
              style={{ borderBottom: '1px solid #000000' }}
            >
              수상
            </h3>
            <Timeline items={awards} />
          </div>
        </div>
      </div>
    </section>
  )
}

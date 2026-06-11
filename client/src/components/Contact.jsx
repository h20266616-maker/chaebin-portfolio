const contactItems = [
  { label: '전화번호', value: '010-1234-5678' },
  { label: '이메일', value: 'chaebin@example.com' },
  { label: 'GitHub', value: 'github.com/chaebin' },
]

export default function Contact() {
  return (
    <footer
      id="contact"
      className="bg-white text-black py-20"
      style={{ borderTop: '1px solid #000000' }}
    >
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="font-bold text-4xl md:text-5xl mb-14">
          CONTACT
        </h2>

        <div className="mb-16 space-y-0">
          {contactItems.map((item, i) => (
            <div
              key={item.label}
              className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0 py-5"
              style={{
                borderBottom: i < contactItems.length - 1 ? '1px solid rgba(0,0,0,0.12)' : 'none',
              }}
            >
              <span className="font-semibold text-xs uppercase tracking-widest sm:w-36 flex-shrink-0">
                {item.label}
              </span>
              <span className="font-normal text-base">
                {item.value}
              </span>
            </div>
          ))}
        </div>

        <div
          className="pt-6"
          style={{ borderTop: '1px solid rgba(0,0,0,0.15)' }}
        >
          <p className="font-normal text-xs" style={{ color: 'rgba(0,0,0,0.4)' }}>
            © 2024 박채빈. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

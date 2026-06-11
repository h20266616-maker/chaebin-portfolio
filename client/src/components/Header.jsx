import { useState } from 'react'

const navItems = [
  { label: 'ABOUT', id: 'about' },
  { label: 'WORK', id: 'work' },
  { label: 'CONTACT', id: 'contact' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white" style={{ borderBottom: '1px solid #000000' }}>
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="font-bold text-xl text-black tracking-tight"
        >
          박채빈
        </button>

        <nav className="hidden md:flex items-center gap-10">
          {navItems.map(({ label, id }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className="text-black font-semibold text-xs tracking-widest uppercase transition-colors duration-200 hover:text-primary"
            >
              {label}
            </button>
          ))}
        </nav>

        <button
          className="md:hidden flex flex-col justify-center gap-1.5 w-8 h-8"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="메뉴 열기"
        >
          <span
            className={`block w-6 h-0.5 bg-black transition-all duration-300 origin-center ${
              menuOpen ? 'rotate-45 translate-y-2' : ''
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-black transition-all duration-300 ${
              menuOpen ? 'opacity-0' : ''
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-black transition-all duration-300 origin-center ${
              menuOpen ? '-rotate-45 -translate-y-2' : ''
            }`}
          />
        </button>
      </div>

      {menuOpen && (
        <div
          className="md:hidden bg-white px-6 py-5 flex flex-col gap-5"
          style={{ borderTop: '1px solid #000000' }}
        >
          {navItems.map(({ label, id }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className="text-black font-semibold text-sm tracking-widest uppercase text-left transition-colors duration-200 hover:text-primary"
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </header>
  )
}

import { useState } from 'react'
import { useScramble } from '../hooks/useScramble'

const navItems = [
  { label: 'MAIN',       id: 'hero' },
  { label: 'INTRO',      id: 'about-me' },
  { label: 'ABOUT',      id: 'about' },
  { label: 'EXPERIENCE', id: 'experience' },
  { label: 'WORK',       id: 'work' },
  { label: 'CONTACT',    id: 'contact' },
]

function NavItem({ label, id, onNavigate }) {
  const { display, start, stop } = useScramble(label)
  return (
    <button
      onClick={() => onNavigate(id)}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = '#AAFF00'
        start()
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = '#1A1A1A'
        stop()
      }}
      className="font-semibold text-xs tracking-widest uppercase px-4 py-2 transition-colors duration-200"
      style={{ color: '#1A1A1A' }}
    >
      {display}
    </button>
  )
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  return (
    <header
      className="fixed top-0 left-0 right-0 z-[100]"
      style={{ backgroundColor: '#F7F7F7', borderBottom: '1px solid #1A1A1A' }}
    >
      <div className="section-container section-padding py-4 flex items-center justify-between">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="text-black tracking-tighter flex items-baseline gap-1.5"
        >
          <span className="font-bold text-base">parkchaebeen</span>
          <span className="font-extrabold text-lg">PORTFOLIO</span>
        </button>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map(({ label, id }) => (
            <NavItem key={id} label={label} id={id} onNavigate={scrollTo} />
          ))}
        </nav>

        <button
          className="md:hidden flex flex-col justify-center gap-1.5 w-8 h-8"
          onClick={() => setMenuOpen((p) => !p)}
          aria-label="메뉴"
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
          className="md:hidden section-padding py-5 flex flex-col gap-4"
          style={{ backgroundColor: '#F7F7F7', borderTop: '1px solid #1A1A1A' }}
        >
          {navItems.map(({ label, id }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className="font-semibold text-sm tracking-widest uppercase text-left transition-colors duration-200"
              style={{ color: '#1A1A1A' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#AAFF00' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#1A1A1A' }}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </header>
  )
}

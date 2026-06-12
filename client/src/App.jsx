import { useEffect, useState } from 'react'
import useRipple from './hooks/useRipple'
import Header from './components/Header'
import Hero from './components/Hero'
import AboutMe from './components/AboutMe'
import About from './components/About'
import Experience from './components/Experience'
import Work from './components/Work'
import Contact from './components/Contact'
import TVIntro from './components/TVIntro'

function GrainOverlay() {
  return (
    <svg
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 9999,
        pointerEvents: 'none',
        opacity: 0.08,
      }}
    >
      <filter id="grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain)" />
    </svg>
  )
}

export default function App() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [introComplete, setIntroComplete] = useState(false)
  useRipple()

  /* Force the page to start at the top on every load.
     'manual' prevents the browser from restoring a previous scroll
     position, which would skip Hero and land mid-page. */
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual'
    }
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress  = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
      setScrollProgress(progress)
    }
    window.addEventListener('scroll', updateProgress)
    return () => window.removeEventListener('scroll', updateProgress)
  }, [])

  return (
    <div className="font-sans">
      {/* 1 — TV intro overlay, plays once */}
      <TVIntro onComplete={() => setIntroComplete(true)} />

      {/* 2 — Full site, fades in after intro */}
      <div
        style={{
          opacity: introComplete ? 1 : 0,
          transition: 'opacity 400ms ease',
          transitionDelay: introComplete ? '100ms' : '0ms',
        }}
      >
        {/* Scroll-progress bar */}
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            height: '2px',
            backgroundColor: '#AAFF00',
            zIndex: 200,
            width: `${scrollProgress}%`,
            transition: 'width 60ms linear',
          }}
        />

        <GrainOverlay />

        {/* 3 — Fixed header */}
        <Header />

        {/* 4 — Scrollable sections in order */}
        <main>
          {/* Hero is the FIRST section — always starts here after TVIntro */}
          <Hero />
          <AboutMe />
          <About />
          <Experience />
          <Work />
        </main>
        <Contact />
      </div>
    </div>
  )
}

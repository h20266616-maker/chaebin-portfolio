import { useEffect, useRef, useState } from 'react'

export default function StaggerText({ children, className = '', style = {}, tag: Tag = 'span' }) {
  const wrapperRef = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = wrapperRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const text = typeof children === 'string' ? children : String(children)
  const chars = text.split('')

  return (
    <Tag ref={wrapperRef} className={className} style={style} aria-label={text}>
      {chars.map((char, i) => (
        <span
          key={i}
          aria-hidden
          style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom' }}
        >
          <span
            style={{
              display: 'inline-block',
              transform: visible ? 'translateY(0)' : 'translateY(110%)',
              opacity: visible ? 1 : 0,
              transition: `transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.04}s, opacity 0.4s ease ${i * 0.04}s`,
            }}
          >
            {char === ' ' ? ' ' : char}
          </span>
        </span>
      ))}
    </Tag>
  )
}

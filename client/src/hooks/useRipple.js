import { useEffect } from 'react'

export default function useRipple() {
  useEffect(() => {
    const handleClick = (e) => {
      const ripple = document.createElement('div')
      ripple.style.cssText = `
        position: fixed;
        left: ${e.clientX - 20}px;
        top: ${e.clientY - 20}px;
        width: 0px;
        height: 0px;
        border-radius: 50%;
        background: #AAFF00;
        opacity: 0.35;
        pointer-events: none;
        z-index: 9998;
        transition: width 500ms ease-out, height 500ms ease-out, opacity 500ms ease-out, margin 500ms ease-out;
      `
      document.body.appendChild(ripple)
      requestAnimationFrame(() => {
        ripple.style.width = '80px'
        ripple.style.height = '80px'
        ripple.style.marginLeft = '-40px'
        ripple.style.marginTop = '-40px'
        ripple.style.opacity = '0'
      })
      setTimeout(() => ripple.remove(), 520)
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])
}

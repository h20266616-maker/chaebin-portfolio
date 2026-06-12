export default function CRTOverlay() {
  return (
    <>
      {/* Scanlines */}
      <div style={{
        position: 'absolute', top: 0, left: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: 10,
        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.07) 2px, rgba(0,0,0,0.07) 4px)'
      }} />
      {/* Flicker layer */}
      <div className="crt-flicker" style={{
        position: 'absolute', top: 0, left: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: 11,
        background: 'transparent'
      }} />
    </>
  )
}

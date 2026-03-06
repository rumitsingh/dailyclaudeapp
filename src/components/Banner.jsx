import { useEffect, useState } from 'react'

const TYPE_STYLES = {
  workout:         'bg-mist-sage text-white',
  schedule_review: 'bg-mist-rose/80 text-white',
  todos:           'bg-amber-400 text-white',
  info:            'bg-mist-warm text-white',
  error:           'bg-red-500 text-white',
}

export default function Banner({ banners, onDismiss }) {
  if (!banners || banners.length === 0) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex flex-col gap-1 p-3 pt-safe">
      {banners.map(banner => (
        <BannerItem key={banner.id} banner={banner} onDismiss={onDismiss} />
      ))}
    </div>
  )
}

function BannerItem({ banner, onDismiss }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Animate in
    requestAnimationFrame(() => setVisible(true))

    // Auto-dismiss after 5 seconds
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(() => onDismiss(banner.id), 300)
    }, 5000)

    return () => clearTimeout(timer)
  }, [banner.id, onDismiss])

  const style = TYPE_STYLES[banner.type] || TYPE_STYLES.info

  return (
    <div className={`rounded-xl2 px-4 py-3 flex items-center gap-3 shadow-card-hover
      transition-all duration-300 ${style}
      ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
      <p className="flex-1 text-sm font-inter font-medium leading-snug">
        {banner.message}
      </p>
      <button
        onClick={() => {
          setVisible(false)
          setTimeout(() => onDismiss(banner.id), 300)
        }}
        className="opacity-80 hover:opacity-100 flex-shrink-0 ml-1"
        aria-label="Dismiss"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
          strokeLinecap="round" className="w-4 h-4">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  )
}

import { useEffect } from 'react'

type VideoModalProps = {
  videoUrl: string
  title?: string
  onClose: () => void
}

function toEmbedUrl(url: string): string {
  // Already an embed URL
  if (url.includes('youtube.com/embed/') || url.includes('youtu.be/embed/')) {
    return url
  }
  // Long-form: https://www.youtube.com/watch?v=XXXXX
  const watchMatch = url.match(/[?&]v=([^&#]+)/)
  if (watchMatch) {
    return `https://www.youtube-nocookie.com/embed/${watchMatch[1]}?rel=0&autoplay=1`
  }
  // Short-form: https://youtu.be/XXXXX
  const shortMatch = url.match(/youtu\.be\/([^?&#]+)/)
  if (shortMatch) {
    return `https://www.youtube-nocookie.com/embed/${shortMatch[1]}?rel=0&autoplay=1`
  }
  // Return as-is for non-YouTube embeds (Vimeo, raw mp4, etc.)
  return url
}

export function VideoModal({ videoUrl, title = 'Demo Video', onClose }: VideoModalProps) {
  // Close on Escape key
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  // Prevent body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const embedUrl = videoUrl ? toEmbedUrl(videoUrl) : ''

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl rounded-2xl bg-black shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className="flex items-center justify-between rounded-t-2xl bg-emerald-900/80 px-4 py-3">
          <span className="text-sm font-semibold text-white">{title}</span>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-white/70 transition hover:bg-white/10 hover:text-white"
            aria-label="Close video"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Video content */}
        <div className="aspect-video w-full overflow-hidden rounded-b-2xl bg-black">
          {embedUrl ? (
            <iframe
              src={embedUrl}
              title={title}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-lg font-semibold text-white">Demo Video Coming Soon</p>
              <p className="max-w-xs text-sm text-white/60">
                The product demo video will be available here shortly. Contact us on WhatsApp for a live walkthrough.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

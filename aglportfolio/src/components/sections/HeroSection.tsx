import { useState } from 'react'
import { Button } from '../../sharedcomponents'
import { VideoModal } from '../VideoModal'
import { trackCtaClick } from '../../utils/api'
import type { HeroContent } from '../website/types'

type HeroSectionProps = {
  content: HeroContent
}

const SAMPLE_DEMO_VIDEOS = [
  'https://youtu.be/M7lc1UVf-VE',
  'https://www.youtube.com/watch?v=aqz-KE-bpKQ',
  'https://www.youtube.com/watch?v=jNQXAC9IVRw',
]

function scrollToSection(id: string) {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

export function HeroSection({ content }: HeroSectionProps) {
  const [showVideo, setShowVideo] = useState(false)
  const titleParts = content.title.split(content.highlightedWord)
  const effectiveVideoUrl = content.videoUrl?.trim() || SAMPLE_DEMO_VIDEOS[0]

  function handleExplore() {
    void trackCtaClick('explore', 'hero')
    scrollToSection('products')
  }

  function handleWatchDemo() {
    void trackCtaClick('watch-demo', 'hero')
    setShowVideo(true)
  }

  function handleGetStarted() {
    void trackCtaClick('get-started', 'hero')
    scrollToSection('contact')
  }

  return (
    <>
      {showVideo && (
        <VideoModal
          videoUrl={effectiveVideoUrl}
          title="Apsonic Vehicles — Product Demo"
          onClose={() => setShowVideo(false)}
        />
      )}
      <section className="grid w-full gap-10 bg-emerald-50 px-6 py-14 md:grid-cols-2 md:px-12 md:py-20" data-purpose="hero-banner" id={content.id}>
        <div className="space-y-5">
          <p className="text-sm font-bold uppercase tracking-widest text-emerald-700">{content.badge}</p>
          <h1 className="text-4xl font-black leading-tight text-emerald-950 md:text-6xl">
            {titleParts[0]}
            <span className="text-emerald-600">{content.highlightedWord}</span>
            {titleParts[1]}
          </h1>
          <p className="max-w-xl text-base text-emerald-800 md:text-lg">{content.description}</p>
          <div className="flex flex-wrap gap-3">
            <Button onClick={handleExplore}>{content.primaryCta}</Button>
            <Button variant="outline" onClick={handleWatchDemo}>
              <span className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                {content.secondaryCta}
              </span>
            </Button>
            <Button variant="secondary" onClick={handleGetStarted}>Get Started →</Button>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-emerald-200 bg-white shadow-lg shadow-emerald-900/10">
          <img src={content.imageSrc} alt={content.imageAlt} className="h-full min-h-72 w-full object-cover" />
        </div>
      </section>
    </>
  )
}

import { Button } from '../../sharedcomponents'
import type { HeroContent } from '../website/types'

type HeroSectionProps = {
  content: HeroContent
}

export function HeroSection({ content }: HeroSectionProps) {
  const titleParts = content.title.split(content.highlightedWord)

  return (
    <section className="mx-auto grid w-full max-w-7xl gap-10 bg-emerald-50 px-4 py-14 md:grid-cols-2 md:px-8 md:py-20" data-purpose="hero-banner" id={content.id}>
      <div className="space-y-5">
        <p className="text-sm font-bold uppercase tracking-widest text-emerald-700">{content.badge}</p>
        <h1 className="text-4xl font-black leading-tight text-emerald-950 md:text-6xl">
          {titleParts[0]}
          <span className="text-emerald-600">{content.highlightedWord}</span>
          {titleParts[1]}
        </h1>
        <p className="max-w-xl text-base text-emerald-800 md:text-lg">{content.description}</p>
        <div className="flex flex-wrap gap-3">
          <Button>{content.primaryCta}</Button>
          <Button variant="outline">{content.secondaryCta}</Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-emerald-200 bg-white shadow-lg shadow-emerald-900/10">
        <img src={content.imageSrc} alt={content.imageAlt} className="h-full min-h-72 w-full object-cover" />
      </div>
    </section>
  )
}

import { Button } from '../../sharedcomponents'
import type { HeroContent } from '../website/types'

type HeroSectionProps = {
  content: HeroContent
}

export function HeroSection({ content }: HeroSectionProps) {
  const titleParts = content.title.split(content.highlightedWord)

  return (
    <section className="company-hero" data-purpose="hero-banner" id="home">
      <div className="company-hero__copy">
        <p className="company-hero__badge">{content.badge}</p>
        <h1>
          {titleParts[0]}
          <span>{content.highlightedWord}</span>
          {titleParts[1]}
        </h1>
        <p>{content.description}</p>
        <div className="company-hero__actions">
          <Button>{content.primaryCta}</Button>
          <Button variant="outline">{content.secondaryCta}</Button>
        </div>
      </div>

      <div className="company-hero__image-wrap">
        <img src={content.imageSrc} alt={content.imageAlt} className="company-hero__image" />
      </div>
    </section>
  )
}

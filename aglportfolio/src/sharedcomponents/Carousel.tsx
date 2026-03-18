import { useEffect, useMemo, useState } from 'react'
import { Button } from './Button'

type CarouselSlide = {
  id: string
  title: string
  text: string
}

type CarouselProps = {
  slides: CarouselSlide[]
  autoPlayMs?: number
}

export function Carousel({ slides, autoPlayMs = 3600 }: CarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  const safeSlides = useMemo(() => slides.filter(Boolean), [slides])

  useEffect(() => {
    if (safeSlides.length < 2) {
      return
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % safeSlides.length)
    }, autoPlayMs)

    return () => window.clearInterval(timer)
  }, [autoPlayMs, safeSlides])

  function prev() {
    setActiveIndex((current) => (current - 1 + safeSlides.length) % safeSlides.length)
  }

  function next() {
    setActiveIndex((current) => (current + 1) % safeSlides.length)
  }

  if (safeSlides.length === 0) {
    return null
  }

  return (
    <div className="ui-carousel" aria-roledescription="carousel">
      <div
        className="ui-carousel__track"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {safeSlides.map((slide) => (
          <article key={slide.id} className="ui-carousel__slide">
            <h3>{slide.title}</h3>
            <p>{slide.text}</p>
          </article>
        ))}
      </div>
      <div className="ui-carousel__controls">
        <Button variant="ghost" size="sm" onClick={prev}>
          Previous
        </Button>
        <Button variant="ghost" size="sm" onClick={next}>
          Next
        </Button>
      </div>
      <div className="ui-carousel__dots">
        {safeSlides.map((slide, index) => (
          <button
            key={slide.id}
            className={`ui-carousel__dot ${index === activeIndex ? 'ui-carousel__dot--active' : ''}`}
            onClick={() => setActiveIndex(index)}
            aria-label={`Slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

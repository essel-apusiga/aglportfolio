import { useRef } from 'react'
import type { ProductSectionContent } from '../website/types'

type ProductsSectionProps = {
  content: ProductSectionContent
}

export function ProductsSection({ content }: ProductsSectionProps) {
  const carouselRef = useRef<HTMLDivElement | null>(null)

  function scrollByAmount(amount: number) {
    if (!carouselRef.current) {
      return
    }

    carouselRef.current.scrollBy({ left: amount, behavior: 'smooth' })
  }

  return (
    <section className="products-section" data-purpose="product-carousel" id={content.id}>
      <div className="products-section__head">
        <div>
          <h2>{content.title}</h2>
          <div className="products-section__underline" />
        </div>
        <div className="products-section__controls">
          <button onClick={() => scrollByAmount(-340)} aria-label="Previous products">
            <span aria-hidden="true">&larr;</span>
          </button>
          <button onClick={() => scrollByAmount(340)} aria-label="Next products">
            <span aria-hidden="true">&rarr;</span>
          </button>
        </div>
      </div>

      <div className="products-section__carousel" ref={carouselRef}>
        {content.products.map((product) => (
          <article key={product.id} className="products-section__card" data-purpose="product-card">
            <img src={product.imageSrc} alt={product.name} />
            <div className="products-section__body">
              <span>{product.category}</span>
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <div className="products-section__meta">
                <strong>{product.price}</strong>
                <button>View</button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

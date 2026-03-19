import { useRef } from 'react'
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi'
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
    <section className="w-full px-6 py-16 md:px-12" data-purpose="product-carousel" id={content.id}>
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-emerald-950 md:text-4xl">{content.title}</h2>
          <div className="mt-3 h-1.5 w-16 rounded-full bg-emerald-600" />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => scrollByAmount(-340)}
            aria-label="Previous products"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-emerald-200 bg-white text-emerald-700 transition hover:border-emerald-500 hover:text-emerald-900"
          >
            <FiArrowLeft className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            onClick={() => scrollByAmount(340)}
            aria-label="Next products"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-emerald-200 bg-white text-emerald-700 transition hover:border-emerald-500 hover:text-emerald-900"
          >
            <FiArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3" ref={carouselRef}>
        {content.products.map((product) => (
          <article
            key={product.id}
            className="w-80 min-w-80 snap-start overflow-hidden rounded-xl border border-emerald-200 bg-white shadow-sm"
            data-purpose="product-card"
          >
            <img src={product.imageSrc} alt={product.name} className="h-48 w-full object-cover" />
            <div className="space-y-3 p-4">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">{product.category}</span>
              <h3 className="text-xl font-bold text-emerald-950">{product.name}</h3>
              <p className="text-sm text-emerald-800">{product.description}</p>
              <div className="flex items-center justify-between">
                <strong className="text-lg font-black text-emerald-900">{product.price}</strong>
                <button className="text-sm font-semibold text-emerald-700 transition hover:text-emerald-900">View</button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

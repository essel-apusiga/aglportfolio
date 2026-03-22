import { useEffect, useRef, useState } from 'react'
import { FiArrowLeft, FiArrowRight, FiEye, FiMail, FiX } from 'react-icons/fi'
import { buildWhatsAppHref } from '../../utils/contact'
import type { ProductSectionContent } from '../website/types'

type ProductsSectionProps = {
  content: ProductSectionContent
}

function resolveShareableImageUrl(imageSrc: string): string | null {
  if (!imageSrc || imageSrc.startsWith('data:')) {
    return null
  }

  if (/^https?:\/\//i.test(imageSrc)) {
    return imageSrc
  }

  if (typeof window !== 'undefined') {
    try {
      return new URL(imageSrc, window.location.origin).toString()
    } catch {
      return null
    }
  }

  return null
}

async function shareViaWhatsApp(productName: string, imageSrc: string) {
  const imageUrl = resolveShareableImageUrl(imageSrc)
  const message = imageUrl
    ? `Hello AGL, I need details for ${productName}.\nProduct image: ${imageUrl}`
    : `Hello AGL, I need details for ${productName}.`
  const waUrl = buildWhatsAppHref(message)

  if (typeof navigator !== 'undefined' && navigator.canShare) {
    try {
      const res = await fetch(imageSrc)
      const blob = await res.blob()
      const ext = blob.type.includes('png') ? 'png' : blob.type.includes('webp') ? 'webp' : 'jpg'
      const file = new File([blob], `${productName}.${ext}`, { type: blob.type || 'image/jpeg' })
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], text: message, url: imageUrl ?? undefined })
        return
      }
    } catch {
      // fall through to wa.me link
    }
  }

  window.open(waUrl, '_blank', 'noreferrer')
}

export function ProductsSection({ content }: ProductsSectionProps) {
  const carouselRef = useRef<HTMLDivElement | null>(null)
  const [activePreview, setActivePreview] = useState<{ imageSrc: string; name: string } | null>(null)

  useEffect(() => {
    if (!activePreview) {
      document.body.style.overflow = ''
      return
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setActivePreview(null)
      }
    }

    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [activePreview])

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

      <div className="hide-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3" ref={carouselRef}>
        {content.products.map((product) => (
          <article
            key={product.id}
            className="anim-fade-up relative w-80 min-w-80 snap-start overflow-hidden rounded-xl border border-emerald-200 bg-white shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-md"
            data-purpose="product-card"
          >
            <button
              type="button"
              onClick={() => setActivePreview({ imageSrc: product.imageSrc, name: product.name })}
              aria-label={`View ${product.name} image`}
              className="absolute right-2 top-2 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full border border-emerald-200 bg-white/95 text-emerald-800 shadow-sm transition hover:bg-emerald-50"
            >
              <FiEye className="h-4 w-4" aria-hidden="true" />
            </button>
            <img src={product.imageSrc} alt={product.name} className="h-48 w-full object-cover" />
            <div className="space-y-3 p-4">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">{product.category}</span>
              <h3 className="text-xl font-bold text-emerald-950">{product.name}</h3>
              <p className="text-sm text-emerald-800">{product.description}</p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => shareViaWhatsApp(product.name, product.imageSrc)}
                  title="WhatsApp for Quote"
                  aria-label={`WhatsApp quote for ${product.name}`}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600 text-white shadow-sm transition hover:bg-emerald-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="h-4 w-4 fill-current" aria-hidden="true">
                    <path d="M19.11 17.21c-.3-.15-1.77-.87-2.05-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.5-.9-.8-1.5-1.8-1.67-2.1-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.8.37-.27.3-1.05 1.02-1.05 2.5s1.07 2.9 1.22 3.1c.15.2 2.1 3.2 5.1 4.48.71.31 1.27.49 1.7.63.72.23 1.38.2 1.9.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.08-.12-.28-.2-.58-.35z" />
                    <path d="M16.03 3C8.84 3 3 8.78 3 15.91c0 2.3.61 4.55 1.78 6.53L3 29l6.74-1.75a13.08 13.08 0 0 0 6.29 1.6H16c7.19 0 13.03-5.78 13.03-12.91C29.03 8.78 23.2 3 16.03 3zm0 23.7h-.01c-2 0-3.96-.54-5.67-1.55l-.41-.24-4 .99 1.07-3.9-.27-.4a10.7 10.7 0 0 1-1.64-5.7c0-5.93 4.86-10.76 10.84-10.76 2.9 0 5.62 1.12 7.66 3.14a10.67 10.67 0 0 1 3.19 7.62c0 5.93-4.86 10.76-10.76 10.76z" />
                  </svg>
                </button>
                <a
                  href={`mailto:sales@apusigaghana.com?subject=${encodeURIComponent(`Enquiry: ${product.name}`)}`}
                  title="Email Enquiry"
                  aria-label={`Email enquiry for ${product.name}`}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-emerald-300 text-emerald-800 transition hover:bg-emerald-50"
                >
                  <FiMail className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>

      {activePreview && (
        <div
          className="anim-modal-backdrop-in fixed inset-0 z-[120] flex items-center justify-center bg-black/85 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`${activePreview.name} fullscreen preview`}
          onClick={() => setActivePreview(null)}
        >
          <button
            type="button"
            onClick={() => setActivePreview(null)}
            className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25"
            aria-label="Close image preview"
          >
            <FiX className="h-6 w-6" aria-hidden="true" />
          </button>

          <figure className="anim-modal-image-in max-h-[92vh] max-w-[96vw]" onClick={(event) => event.stopPropagation()}>
            <img
              src={activePreview.imageSrc}
              alt={activePreview.name}
              className="max-h-[86vh] w-auto max-w-[96vw] rounded-xl border border-white/20 object-contain shadow-2xl"
              decoding="async"
            />
            <figcaption className="mt-3 text-center text-sm font-semibold text-white">{activePreview.name}</figcaption>
          </figure>
        </div>
      )}
    </section>
  )
}

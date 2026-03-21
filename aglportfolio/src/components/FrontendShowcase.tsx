import { useEffect, useState } from 'react'
import { fetchPublishedSiteConfig } from '../utils/api'
import { setJsonLd } from '../utils/seo'
import { CompanyWebsite } from './website/CompanyWebsite'
import type { CompanyWebsiteContent } from './website/types'

export function FrontendShowcase() {
  const [content, setContent] = useState<CompanyWebsiteContent | null>(null)
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [statusMessage, setStatusMessage] = useState<string>('Loading published website content...')

  async function loadFromBackend() {
    setIsLoading(true)
    setHasError(false)
    setStatusMessage('Loading published website content...')

    try {
      const backendConfig = await fetchPublishedSiteConfig()
      setContent(backendConfig)
      setStatusMessage('')

      const productEntities = backendConfig.products.products.map((product) => ({
        '@type': 'Product',
        name: product.name,
        description: product.description,
        image: product.imageSrc,
        brand: {
          '@type': 'Brand',
          name: 'Apsonic',
        },
        url: 'https://apusigaghana.com/where-to-buy',
      }))

      setJsonLd('agl-home-seo', [
        {
          '@context': 'https://schema.org',
          '@type': 'AutoDealer',
          name: backendConfig.header.brandName,
          telephone: backendConfig.location.contactDetails.phone,
          email: backendConfig.location.contactDetails.email,
          areaServed: 'Ghana',
        },
        {
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          itemListElement: productEntities,
        },
      ])
    } catch {
      setContent(null)
      setHasError(true)
      setStatusMessage('Published website content is unavailable right now.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadFromBackend()
  }, [])

  if (!content && isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6" aria-label="Loading" role="status">
        <div className="flex items-center justify-center gap-3">
          <span className="h-5 w-5 animate-bounce rounded-full bg-emerald-600" />
          <span className="h-5 w-5 animate-bounce rounded-full bg-emerald-600" style={{ animationDelay: '120ms' }} />
          <span className="h-5 w-5 animate-bounce rounded-full bg-emerald-600" style={{ animationDelay: '240ms' }} />
        </div>
      </div>
    )
  }

  if (!content) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6 text-center text-emerald-950">
        <div className="max-w-xl space-y-4 rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
          {hasError && (
            <>
              <h1 className="text-3xl font-black md:text-4xl">Website Currently Unavailable</h1>
              <p className="text-sm text-slate-700 md:text-base">{statusMessage}</p>
            <div className="space-y-3 pt-1">
              <button
                type="button"
                onClick={() => void loadFromBackend()}
                className="inline-flex items-center justify-center rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Reload Website
              </button>
              <p className="text-xs text-slate-600">
                Please reload again, or contact us if this persists.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <a
                  href="https://wa.me/233537139760?text=Hello%20AGL%2C%20your%20website%20is%20currently%20unavailable.%20Please%20assist."
                  className="rounded-lg border border-emerald-300 px-3 py-2 text-xs font-semibold text-emerald-800 transition hover:bg-emerald-50"
                >
                  Contact on WhatsApp
                </a>
                <a
                  href="mailto:sales@apusigaghana.com?subject=Website%20currently%20unavailable"
                  className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  Contact by Email
                </a>
              </div>
            </div>
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <>
      <CompanyWebsite content={content} />
      {statusMessage && (
        <div className="fixed bottom-4 right-4 rounded-full bg-emerald-900 px-4 py-2 text-xs font-semibold text-emerald-50 shadow-lg shadow-emerald-900/30">
          {statusMessage}
        </div>
      )}
    </>
  )
}

import { useEffect } from 'react'
import { NotFoundPage } from './components/NotFoundPage'
import { FrontendShowcase } from './components/FrontendShowcase'
import { PublicReviewsPage } from './components/PublicReviewsPage'
import { WhereToBuyPage } from './components/WhereToBuyPage'
import { CmsStudio } from './components/website/CmsStudio'
import { setSeoMeta } from './utils/seo'

const CMS_OG_IMAGE_URL = 'https://aglportfolio.api.agl.business/api/seo/og-image'

function App() {
  const pathname = window.location.pathname
  const isHomeRoute = pathname === '/' || pathname === '/index.html'
  const isCmsRoute = pathname === '/cms' || pathname.startsWith('/cms/')
  const isReviewsRoute =
    pathname === '/reviews' ||
    pathname === '/reviews/' ||
    pathname === '/newreview' ||
    pathname === '/newreview/' ||
    pathname === '/customerreview' ||
    pathname === '/customerreview/' ||
    pathname === '/customer-review' ||
    pathname === '/customer-review/'
  const isWhereToBuyRoute = pathname === '/where-to-buy' || pathname === '/where-to-buy/'
  const isKnownRoute = isHomeRoute || isCmsRoute || isReviewsRoute || isWhereToBuyRoute

  useEffect(() => {
    if (isCmsRoute) {
      setSeoMeta({
        title: 'AGL CMS Studio',
        description: 'Content management studio for Apusiga Ghana Ltd website.',
        robots: 'noindex,nofollow',
      })
      return
    }

    if (isReviewsRoute) {
      setSeoMeta({
        title: 'Customer Reviews | AGL Business (Apusiga GH) | Apsonic Ghana',
        description:
          'Rate your experience with AGL Business (Apusiga GH / Apusiga Ghana Ltd) and Apsonic products in Ghana. Submit customer reviews and service feedback quickly.',
        keywords:
          'Apsonic Ghana reviews, AGL business reviews, Apusia GH reviews, Apusiga GH reviews, Apusiga Ghana Limited reviews, Apsnoce Motors reviews, customer service review Ghana, Apsonic tricycle feedback',
        canonicalPath: '/customerreview',
        robots: 'index,follow,max-image-preview:large',
        ogImage: CMS_OG_IMAGE_URL,
      })
      return
    }

    if (isWhereToBuyRoute) {
      setSeoMeta({
        title: 'Where to Buy Apsonic in Ghana | AGL Business (Apusiga GH)',
        description:
          'Find Tamale and Accra AGL Business branches (Apusiga GH) to buy Apsonic tricycles, motorbikes, tires, and spare parts. Includes contact details and map directions.',
        keywords:
          'AGL business, agl.business, Apusia GH, Apusiga GH, Apusiga Ghana Limited, Apsonic Motors Ghana, Apsnoce Motors, Apsonic dealer Ghana, buy tricycle in Ghana, Apsonic Tamale, Apsonic Accra, Apsonic products Ghana',
        canonicalPath: '/where-to-buy',
        robots: 'index,follow,max-image-preview:large',
        ogImage: CMS_OG_IMAGE_URL,
      })
      return
    }

    if (!isKnownRoute) {
      setSeoMeta({
        title: 'Page Not Found | Apusiga Ghana Ltd (AGL)',
        description: 'The page you requested could not be found.',
        robots: 'noindex,nofollow',
      })
      return
    }

    setSeoMeta({
      title: 'AGL Business (Apusiga GH) | Apsonic Tricycles, Motorbikes and Tires in Ghana',
      description:
        'AGL Business (Apusiga GH / Apusiga Ghana Ltd) is your trusted Apsonic authority in Ghana for tricycles, cargo bikes, passenger pragya options, tires, and after-sales support.',
      keywords:
        'AGL business, AGL Ghana, agl.business, www.agl.business, Apusia GH, Apusiga GH, Apusiga Ghana Limited, Apusiga Ghana Ltd, Apsonic Motors Ghana, Apsnoce Motors, Apsonic Ghana, Apsonic tricycles Ghana, pragya Ghana, camboo Ghana, yellow yellow Ghana, Apsonic products Ghana',
      canonicalPath: '/',
      robots: 'index,follow,max-image-preview:large',
      ogImage: CMS_OG_IMAGE_URL,
    })
  }, [isCmsRoute, isKnownRoute, isReviewsRoute, isWhereToBuyRoute])

  if (isCmsRoute) {
    return <CmsStudio />
  }

  if (isReviewsRoute) {
    return <PublicReviewsPage />
  }

  if (isWhereToBuyRoute) {
    return <WhereToBuyPage />
  }

  if (isHomeRoute) {
    return <FrontendShowcase />
  }

  return <NotFoundPage />
}

export default App

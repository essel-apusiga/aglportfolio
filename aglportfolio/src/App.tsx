import { useEffect } from 'react'
import { NotFoundPage } from './components/NotFoundPage'
import { FrontendShowcase } from './components/FrontendShowcase'
import { PublicReviewsPage } from './components/PublicReviewsPage'
import { WhereToBuyPage } from './components/WhereToBuyPage'
import { CmsStudio } from './components/website/CmsStudio'
import { setSeoMeta } from './utils/seo'

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

  useEffect(() => {
    if (isCmsRoute) {
      setSeoMeta({
        title: 'AGL CMS Studio',
        description: 'Content management studio for Apusiga Ghana Ltd website.',
      })
      return
    }

    if (isReviewsRoute) {
      setSeoMeta({
        title: 'Customer Reviews | Apsonic Ghana | Apusiga Ghana Ltd (AGL)',
        description:
          'Rate your experience with Apusiga Ghana Ltd and Apsonic products in Ghana. Submit customer reviews and service feedback quickly.',
        keywords:
          'Apsonic Ghana reviews, customer service review Ghana, Apsonic tricycle feedback, Apusiga Ghana reviews',
        canonicalPath: '/customerreview',
      })
      return
    }

    if (isWhereToBuyRoute) {
      setSeoMeta({
        title: 'Where to Buy Apsonic in Ghana | Apusiga Ghana Ltd (AGL)',
        description:
          'Find Tamale and Accra AGL branches to buy Apsonic tricycles, motorbikes, tires, and spare parts. Includes contact details and map directions.',
        keywords:
          'Apsonic dealer Ghana, buy tricycle in Ghana, Apsonic Tamale, Apsonic Accra, Apsonic products Ghana',
        canonicalPath: '/where-to-buy',
      })
      return
    }

    setSeoMeta({
      title: 'Apsonic Tricycles, Motorbikes and Tires in Ghana | Apusiga Ghana Ltd (AGL)',
      description:
        'Apusiga Ghana Ltd is your trusted Apsonic authority in Ghana for tricycles, cargo bikes, passenger pragya options, tires, and after-sales support.',
      keywords:
        'Apsonic Ghana, Apsonic tricycles Ghana, pragya Ghana, camboo Ghana, yellow yellow Ghana, Apsonic products Ghana',
      canonicalPath: '/',
    })
  }, [isCmsRoute, isReviewsRoute, isWhereToBuyRoute])

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

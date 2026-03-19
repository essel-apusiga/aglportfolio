import { NotFoundPage } from './components/NotFoundPage'
import { FrontendShowcase } from './components/FrontendShowcase'
import { PublicReviewsPage } from './components/PublicReviewsPage'
import { CmsStudio } from './components/website/CmsStudio'

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

  if (isCmsRoute) {
    return <CmsStudio />
  }

  if (isReviewsRoute) {
    return <PublicReviewsPage />
  }

  if (isHomeRoute) {
    return <FrontendShowcase />
  }

  return <NotFoundPage />
}

export default App

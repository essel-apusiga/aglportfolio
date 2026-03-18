import { NotFoundPage } from './components/NotFoundPage'
import { FrontendShowcase } from './components/FrontendShowcase'
import { CmsStudio } from './components/website/CmsStudio'

function App() {
  const pathname = window.location.pathname
  const isHomeRoute = pathname === '/' || pathname === '/index.html'
  const isCmsRoute = pathname === '/cms' || pathname.startsWith('/cms/')

  if (isCmsRoute) {
    return <CmsStudio />
  }

  if (isHomeRoute) {
    return <FrontendShowcase />
  }

  return <NotFoundPage />
}

export default App

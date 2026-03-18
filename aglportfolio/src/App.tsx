import './App.css'
import { FrontendShowcase } from './components/FrontendShowcase'
import { CmsStudio } from './components/website/CmsStudio'

function App() {
  const isCmsRoute = window.location.pathname.startsWith('/cms')

  if (isCmsRoute) {
    return <CmsStudio />
  }

  return <FrontendShowcase />
}

export default App

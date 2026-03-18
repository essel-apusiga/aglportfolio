import { useEffect, useState } from 'react'
import { companyWebsiteContent } from '../utils/companyData'
import { fetchPublishedSiteConfig } from '../utils/api'
import { CompanyWebsite } from './website/CompanyWebsite'
import type { CompanyWebsiteContent } from './website/types'

export function FrontendShowcase() {
  const [content, setContent] = useState<CompanyWebsiteContent>(companyWebsiteContent)
  const [statusMessage, setStatusMessage] = useState<string>('Loading published website content...')

  useEffect(() => {
    async function loadFromBackend() {
      try {
        const backendConfig = await fetchPublishedSiteConfig()
        setContent(backendConfig)
        setStatusMessage('Showing published website content.')
      } catch {
        setStatusMessage('Backend not available, using local fallback config.')
      }
    }

    void loadFromBackend()
  }, [])

  return (
    <>
      <CompanyWebsite content={content} />
      <div className="fixed bottom-4 right-4 rounded-full bg-emerald-900 px-4 py-2 text-xs font-semibold text-emerald-50 shadow-lg shadow-emerald-900/30">
        {statusMessage}
      </div>
    </>
  )
}

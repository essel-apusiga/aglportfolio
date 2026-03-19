import { useEffect, useState } from 'react'
import { fetchPublishedSiteConfig } from '../utils/api'
import { CompanyWebsite } from './website/CompanyWebsite'
import type { CompanyWebsiteContent } from './website/types'

export function FrontendShowcase() {
  const [content, setContent] = useState<CompanyWebsiteContent | null>(null)
  const [statusMessage, setStatusMessage] = useState<string>('Loading published website content...')

  useEffect(() => {
    async function loadFromBackend() {
      try {
        const backendConfig = await fetchPublishedSiteConfig()
        setContent(backendConfig)
        setStatusMessage('Showing published website content.')
      } catch {
        setStatusMessage('Published website content is unavailable right now.')
      }
    }

    void loadFromBackend()
  }, [])

  if (!content) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-6 text-center text-emerald-950">
        <div className="max-w-xl space-y-3">
          <h1 className="text-3xl font-black md:text-4xl">Published website unavailable</h1>
          <p className="text-sm text-emerald-800 md:text-base">{statusMessage}</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <CompanyWebsite content={content} />
      <div className="fixed bottom-4 right-4 rounded-full bg-emerald-900 px-4 py-2 text-xs font-semibold text-emerald-50 shadow-lg shadow-emerald-900/30">
        {statusMessage}
      </div>
    </>
  )
}

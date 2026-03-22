import { useEffect, useState } from 'react'
import type { IconType } from 'react-icons'
import {
  FiArrowDown,
  FiCompass,
  FiFileText,
  FiHome,
  FiLayout,
  FiMapPin,
  FiMenu,
  FiPackage,
  FiSmartphone,
  FiUsers,
  FiX,
} from 'react-icons/fi'
import { Button } from '../../sharedcomponents'
import { companyWebsiteContent } from '../../utils/companyData'
import { fetchCmsConfig, publishCmsConfig, resetCmsDraft } from '../../utils/api'
import { CompanyWebsite } from './CompanyWebsite'
import type { CompanyWebsiteContent, SectionKey } from './types'
import { SectionEditorPanel } from './SectionEditorPanel'

type CmsMeta = {
  updatedAt: string
  publishedAt: string
}

const NAV_ITEMS: { key: SectionKey | 'header' | 'footer' | 'order'; label: string; icon: IconType }[] = [
  { key: 'header', label: 'Header & Nav', icon: FiLayout },
  { key: 'home', label: 'Hero Banner', icon: FiHome },
  { key: 'about', label: 'About', icon: FiCompass },
  { key: 'products', label: 'Products', icon: FiPackage },
  { key: 'team', label: 'Team', icon: FiUsers },
  { key: 'contact', label: 'Contact', icon: FiMapPin },
  { key: 'footer', label: 'Footer', icon: FiFileText },
  { key: 'order', label: 'Section Order', icon: FiArrowDown },
]

export function CmsStudio() {
  const [config, setConfig] = useState<CompanyWebsiteContent>(companyWebsiteContent)
  const [meta, setMeta] = useState<CmsMeta | null>(null)
  const [activeSection, setActiveSection] = useState<string>('home')
  const [toast, setToast] = useState<{ text: string; type: 'info' | 'success' | 'error' } | null>(null)
  const [isBusy, setIsBusy] = useState(false)
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop')
  const [isNavOpen, setIsNavOpen] = useState(false)

  function showToast(text: string, type: 'info' | 'success' | 'error') {
    setToast({ text, type })
    setTimeout(() => setToast(null), 4000)
  }

  useEffect(() => {
    async function load() {
      try {
        const response = await fetchCmsConfig()
        setConfig(response.config)
        setMeta(response.meta)
        showToast('CMS draft loaded.', 'info')
      } catch {
        showToast('Backend unavailable — using local fallback.', 'error')
      }
    }
    void load()
  }, [])

  async function publishDraft() {
    setIsBusy(true)
    try {
      const response = await publishCmsConfig()
      setConfig(response.config)
      setMeta(response.meta)
      showToast('Published live successfully!', 'success')
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Publish failed.', 'error')
    } finally {
      setIsBusy(false)
    }
  }

  async function resetDraft() {
    setIsBusy(true)
    try {
      const response = await resetCmsDraft()
      setConfig(response.config)
      setMeta(response.meta)
      showToast('Draft reset to published version.', 'info')
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Reset failed.', 'error')
    } finally {
      setIsBusy(false)
    }
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-emerald-50 text-emerald-950">
      <header className="flex h-14 items-center gap-3 bg-emerald-950 px-3 text-white shadow-lg md:px-5">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-300 shadow-[0_0_10px] shadow-emerald-300" />
          <strong className="text-sm font-bold tracking-wide">CMS Studio</strong>
        </div>

        <button
          className="inline-flex rounded-md border border-emerald-700 p-2 text-emerald-100 md:hidden"
          onClick={() => setIsNavOpen((prev) => !prev)}
          aria-label={isNavOpen ? 'Close section menu' : 'Open section menu'}
        >
          {isNavOpen ? <FiX className="h-4 w-4" /> : <FiMenu className="h-4 w-4" />}
        </button>

        <div className="hidden flex-1 items-center gap-4 text-xs text-emerald-200 lg:flex">
          <span>
            Draft:{' '}
            <em className="not-italic text-emerald-50">
              {meta?.updatedAt
                ? new Date(meta.updatedAt).toLocaleString()
                : 'Not saved yet'}
            </em>
          </span>
          <span>
            Published:{' '}
            <em className="not-italic text-emerald-50">
              {meta?.publishedAt
                ? new Date(meta.publishedAt).toLocaleString()
                : 'Never'}
            </em>
          </span>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button
            className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs transition ${
              previewMode === 'mobile'
                ? 'border-emerald-300 bg-emerald-200/20 text-emerald-50'
                : 'border-emerald-700 bg-emerald-900 text-emerald-100 hover:bg-emerald-800'
            }`}
            onClick={() => setPreviewMode(previewMode === 'desktop' ? 'mobile' : 'desktop')}
            title="Toggle preview width"
          >
            <FiSmartphone className="h-3.5 w-3.5" />
            {previewMode === 'desktop' ? 'Mobile' : 'Desktop'}
          </button>

          <Button size="sm" variant="secondary" onClick={() => void resetDraft()} disabled={isBusy} className="hidden sm:inline-flex">
            Reset Draft
          </Button>

          <Button size="sm" onClick={() => void publishDraft()} disabled={isBusy}>
            {isBusy ? 'Publishing…' : 'Publish Live'}
          </Button>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded-md border border-emerald-700 px-3 py-1.5 text-xs font-semibold text-emerald-100 transition hover:bg-emerald-800 sm:inline-flex"
          >
            View Site ↗
          </a>
        </div>
      </header>

      <div className="grid flex-1 overflow-hidden md:grid-cols-[220px_minmax(0,1fr)_360px]">
        <nav
          className={`overflow-y-auto border-r border-emerald-200 bg-white p-3 ${isNavOpen ? 'block' : 'hidden'} md:block`}
        >
          <p className="mb-2 px-2 text-[11px] font-extrabold uppercase tracking-widest text-emerald-700">Sections</p>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            return (
            <button
              key={item.key}
              className={`mb-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-semibold transition ${
                activeSection === item.key
                  ? 'bg-emerald-700 text-white'
                  : 'text-emerald-800 hover:bg-emerald-100'
              }`}
              onClick={() => {
                setActiveSection(item.key)
                setIsNavOpen(false)
              }}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </button>
            )
          })}
        </nav>

        <div className="overflow-y-auto bg-emerald-100/40 p-3 md:p-4">
          <div className={`mx-auto overflow-hidden rounded-xl bg-white shadow-lg shadow-emerald-900/10 ${previewMode === 'mobile' ? 'max-w-[390px]' : 'max-w-full'}`}>
            <CompanyWebsite content={config} showCompanyBackground={false} />
          </div>
        </div>

        <aside className="overflow-y-auto border-l border-emerald-200 bg-white">
          <SectionEditorPanel
            activeSection={activeSection}
            config={config}
            onConfigChange={(next) => setConfig(next)}
            onToast={showToast}
          />
        </aside>
      </div>

      {toast && (
        <div
          className={`fixed bottom-5 left-1/2 z-[200] -translate-x-1/2 rounded-full px-5 py-2 text-sm font-semibold text-white shadow-xl ${
            toast.type === 'success' ? 'bg-emerald-700' : toast.type === 'error' ? 'bg-rose-700' : 'bg-emerald-900'
          }`}
          role="status"
          aria-live="polite"
        >
          {toast.text}
        </div>
      )}
    </div>
  )
}

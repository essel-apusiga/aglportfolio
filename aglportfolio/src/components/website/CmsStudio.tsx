import { useEffect, useState } from 'react'
import { Button } from '../../sharedcomponents'
import { companyWebsiteContent } from '../../utils/companyData'
import { fetchCmsConfig, publishCmsConfig, resetCmsDraft } from '../../utils/api'
import { CompanyWebsite } from './CompanyWebsite'
import type { CompanyWebsiteContent, SectionKey } from './types'
import './cms-studio.css'
import { SectionEditorPanel } from './SectionEditorPanel'

type CmsMeta = {
  updatedAt: string
  publishedAt: string
}

const NAV_ITEMS: { key: SectionKey | 'header' | 'footer' | 'order'; label: string; icon: string }[] = [
  { key: 'header', label: 'Header & Nav', icon: '☰' },
  { key: 'home', label: 'Hero Banner', icon: '⚡' },
  { key: 'about', label: 'About', icon: '🏢' },
  { key: 'products', label: 'Products', icon: '🏍' },
  { key: 'team', label: 'Team', icon: '👥' },
  { key: 'contact', label: 'Contact', icon: '📍' },
  { key: 'footer', label: 'Footer', icon: '📄' },
  { key: 'order', label: 'Section Order', icon: '↕' },
]

export function CmsStudio() {
  const [config, setConfig] = useState<CompanyWebsiteContent>(companyWebsiteContent)
  const [meta, setMeta] = useState<CmsMeta | null>(null)
  const [activeSection, setActiveSection] = useState<string>('home')
  const [toast, setToast] = useState<{ text: string; type: 'info' | 'success' | 'error' } | null>(null)
  const [isBusy, setIsBusy] = useState(false)
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop')

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
    <div className="cms-dash">
      {/* ── Top bar ─────────────────────────────────────────── */}
      <header className="cms-dash__topbar">
        <div className="cms-dash__topbar-brand">
          <span className="cms-dash__topbar-dot" />
          <strong>CMS Studio</strong>
        </div>
        <div className="cms-dash__topbar-meta">
          <span>
            Draft:{' '}
            <em>
              {meta?.updatedAt
                ? new Date(meta.updatedAt).toLocaleString()
                : 'Not saved yet'}
            </em>
          </span>
          <span>
            Published:{' '}
            <em>
              {meta?.publishedAt
                ? new Date(meta.publishedAt).toLocaleString()
                : 'Never'}
            </em>
          </span>
        </div>
        <div className="cms-dash__topbar-actions">
          <button
            className={`cms-preview-toggle ${previewMode === 'mobile' ? 'is-active' : ''}`}
            onClick={() => setPreviewMode(previewMode === 'desktop' ? 'mobile' : 'desktop')}
            title="Toggle preview width"
          >
            {previewMode === 'desktop' ? '📱 Mobile' : '🖥 Desktop'}
          </button>
          <Button size="sm" variant="secondary" onClick={() => void resetDraft()} disabled={isBusy}>
            Reset Draft
          </Button>
          <Button size="sm" onClick={() => void publishDraft()} disabled={isBusy}>
            {isBusy ? 'Publishing…' : '🚀 Publish Live'}
          </Button>
          <a href="/" target="_blank" rel="noopener noreferrer" className="cms-dash__live-link">
            View Site ↗
          </a>
        </div>
      </header>

      {/* ── 3-column body ───────────────────────────────────── */}
      <div className="cms-dash__body">
        {/* Left sidebar */}
        <nav className="cms-dash__sidebar">
          <p className="cms-dash__sidebar-heading">Sections</p>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              className={`cms-dash__nav-item ${activeSection === item.key ? 'is-active' : ''}`}
              onClick={() => setActiveSection(item.key)}
            >
              <span className="cms-dash__nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Centre — live preview */}
        <div className="cms-dash__preview-wrap">
          <div className={`cms-dash__preview-frame ${previewMode === 'mobile' ? 'is-mobile' : ''}`}>
            <CompanyWebsite content={config} />
          </div>
        </div>

        {/* Right — editor panel */}
        <aside className="cms-dash__editor">
          <SectionEditorPanel
            activeSection={activeSection}
            config={config}
            onConfigChange={(next) => setConfig(next)}
            onToast={showToast}
          />
        </aside>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`cms-toast cms-toast--${toast.type}`} role="status" aria-live="polite">
          {toast.text}
        </div>
      )}
    </div>
  )
}

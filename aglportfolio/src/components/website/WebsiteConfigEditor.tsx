import { useEffect, useMemo, useState } from 'react'
import { Button } from '../../sharedcomponents'
import type { CompanyWebsiteContent, SectionKey } from './types'
import { saveNavLinks, saveSectionOrder, saveSiteConfig } from '../../utils/api'

type WebsiteConfigEditorProps = {
  config: CompanyWebsiteContent
  onConfigChange: (config: CompanyWebsiteContent) => void
}

const sectionLabel: Record<SectionKey, string> = {
  home: 'Hero',
  about: 'About',
  products: 'Products',
  team: 'Team',
  contact: 'Location + Contact',
}

export function WebsiteConfigEditor({ config, onConfigChange }: WebsiteConfigEditorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [statusMessage, setStatusMessage] = useState<string>('')
  const [jsonDraft, setJsonDraft] = useState(() => JSON.stringify(config, null, 2))
  const [navDraft, setNavDraft] = useState(() => config.header.navLinks)

  const sectionOrderDisplay = useMemo(
    () => config.sectionOrder.map((sectionKey) => sectionLabel[sectionKey]).join(' -> '),
    [config.sectionOrder],
  )

  useEffect(() => {
    setNavDraft(config.header.navLinks)
    setJsonDraft(JSON.stringify(config, null, 2))
  }, [config])

  async function persistFullConfig(nextConfig: CompanyWebsiteContent) {
    setIsSaving(true)
    setStatusMessage('Saving full configuration...')
    try {
      const saved = await saveSiteConfig(nextConfig)
      onConfigChange(saved.config)
      setJsonDraft(JSON.stringify(saved.config, null, 2))
      setStatusMessage('Configuration saved.')
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : 'Failed to save configuration.')
    } finally {
      setIsSaving(false)
    }
  }

  async function updateSectionOrder(direction: 'up' | 'down', index: number) {
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= config.sectionOrder.length) {
      return
    }

    const nextOrder = [...config.sectionOrder]
    const [current] = nextOrder.splice(index, 1)
    nextOrder.splice(targetIndex, 0, current)

    setIsSaving(true)
    setStatusMessage('Saving section order...')
    try {
      const saved = await saveSectionOrder(nextOrder)
      onConfigChange(saved.config)
      setJsonDraft(JSON.stringify(saved.config, null, 2))
      setStatusMessage('Section order updated.')
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : 'Failed to save section order.')
    } finally {
      setIsSaving(false)
    }
  }

  async function saveNavDraft() {
    setIsSaving(true)
    setStatusMessage('Saving nav links...')
    try {
      const saved = await saveNavLinks(navDraft)
      onConfigChange(saved.config)
      setJsonDraft(JSON.stringify(saved.config, null, 2))
      setStatusMessage('Navigation updated.')
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : 'Failed to save nav links.')
    } finally {
      setIsSaving(false)
    }
  }

  function applyJsonDraft() {
    try {
      const parsed = JSON.parse(jsonDraft) as CompanyWebsiteContent
      void persistFullConfig(parsed)
    } catch {
      setStatusMessage('JSON is invalid. Please fix syntax before saving.')
    }
  }

  return (
    <aside className="config-editor">
      <div className="config-editor__bar">
        <strong>Website Config Editor</strong>
        <div className="ui-stack">
          <Button size="sm" variant="outline" onClick={() => setIsOpen((state) => !state)}>
            {isOpen ? 'Hide editor' : 'Open editor'}
          </Button>
        </div>
      </div>

      {isOpen ? (
        <div className="config-editor__panel">
          <p className="config-editor__hint">Backend-driven controls for nav links, ordering, and full JSON sections.</p>

          <section className="config-editor__section">
            <h3>Section order</h3>
            <p>{sectionOrderDisplay}</p>
            <div className="config-editor__order-grid">
              {config.sectionOrder.map((key, index) => (
                <div key={key} className="config-editor__order-item">
                  <span>{sectionLabel[key]}</span>
                  <div className="ui-stack">
                    <Button size="sm" variant="ghost" onClick={() => updateSectionOrder('up', index)}>
                      Up
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => updateSectionOrder('down', index)}>
                      Down
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="config-editor__section">
            <h3>Navigation labels</h3>
            <div className="config-editor__nav-grid">
              {navDraft.map((link, index) => (
                <label key={link.id} className="config-editor__field">
                  <span>{link.href}</span>
                  <input
                    value={navDraft[index]?.label ?? ''}
                    onChange={(event) =>
                      setNavDraft((current) =>
                        current.map((item, itemIndex) =>
                          itemIndex === index ? { ...item, label: event.target.value } : item,
                        ),
                      )
                    }
                  />
                </label>
              ))}
            </div>
            <div className="ui-stack">
              <Button size="sm" variant="outline" onClick={() => void saveNavDraft()} disabled={isSaving}>
                Save Navigation Labels
              </Button>
            </div>
          </section>

          <section className="config-editor__section">
            <h3>Full configuration (JSON)</h3>
            <textarea
              value={jsonDraft}
              onChange={(event) => setJsonDraft(event.target.value)}
              rows={18}
              spellCheck={false}
            />
            <div className="ui-stack">
              <Button onClick={applyJsonDraft} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save JSON to Backend'}
              </Button>
            </div>
          </section>

          <p className="config-editor__status" aria-live="polite">
            {statusMessage}
          </p>
        </div>
      ) : null}
    </aside>
  )
}

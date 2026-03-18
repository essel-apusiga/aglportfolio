import { useState } from 'react'
import { Button } from '../../sharedcomponents'
import { saveCmsSection, saveNavLinks, saveSectionOrder, saveSiteConfig } from '../../utils/api'
import type {
  AboutSectionContent,
  AboutStat,
  CompanyWebsiteContent,
  FooterContent,
  HeaderContent,
  HeroContent,
  LocationSectionContent,
  Product,
  ProductSectionContent,
  SectionKey,
  TeamMember,
  TeamSectionContent,
} from './types'

type Props = {
  activeSection: string
  config: CompanyWebsiteContent
  onConfigChange: (next: CompanyWebsiteContent) => void
  onToast: (text: string, type: 'info' | 'success' | 'error') => void
}

// ── Shared helpers ────────────────────────────────────────────────────────

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <label className="sep-field">
      <span className="sep-field__label">{label}</span>
      {children}
    </label>
  )
}

function ImageField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="sep-field">
      <span className="sep-field__label">{label}</span>
      {value && (
        <div className="sep-img-preview">
          <img src={value} alt="" />
        </div>
      )}
      <input
        className="sep-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste image URL…"
      />
    </div>
  )
}

function Textarea({
  value,
  onChange,
  rows = 3,
}: {
  value: string
  onChange: (v: string) => void
  rows?: number
}) {
  return (
    <textarea
      className="sep-input sep-textarea"
      value={value}
      rows={rows}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}

function Input({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <input className="sep-input" value={value} onChange={(e) => onChange(e.target.value)} />
  )
}

function SaveBar({
  isSaving,
  onSave,
}: {
  isSaving: boolean
  onSave: () => void
}) {
  return (
    <div className="sep-save-bar">
      <Button onClick={onSave} disabled={isSaving}>
        {isSaving ? 'Saving…' : '💾 Save to Backend'}
      </Button>
    </div>
  )
}

function PanelHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="sep-heading">
      <h2>{title}</h2>
      {subtitle && <p>{subtitle}</p>}
    </div>
  )
}

// ── Header editor ─────────────────────────────────────────────────────────

function HeaderEditor({
  content,
  onSave,
}: {
  content: HeaderContent
  onSave: (next: HeaderContent) => Promise<void>
}) {
  const [draft, setDraft] = useState<HeaderContent>(content)
  const [isSaving, setIsSaving] = useState(false)

  async function save() {
    setIsSaving(true)
    try {
      await onSave(draft)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="sep-body">
      <PanelHeading title="Header & Navigation" subtitle="Brand name, CTA label, and nav link labels." />

      <Field label="Brand name">
        <Input value={draft.brandName} onChange={(v) => setDraft({ ...draft, brandName: v })} />
      </Field>
      <Field label="Badge text">
        <Input value={draft.badge} onChange={(v) => setDraft({ ...draft, badge: v })} />
      </Field>
      <Field label="CTA button label">
        <Input value={draft.ctaLabel} onChange={(v) => setDraft({ ...draft, ctaLabel: v })} />
      </Field>

      <div className="sep-card-stack">
        <p className="sep-sub-heading">Navigation links</p>
        {draft.navLinks.map((link, index) => (
          <div key={link.id} className="sep-card">
            <Field label="Label">
              <Input
                value={link.label}
                onChange={(v) =>
                  setDraft({
                    ...draft,
                    navLinks: draft.navLinks.map((l, i) => (i === index ? { ...l, label: v } : l)),
                  })
                }
              />
            </Field>
            <Field label="Href (#anchor)">
              <Input
                value={link.href}
                onChange={(v) =>
                  setDraft({
                    ...draft,
                    navLinks: draft.navLinks.map((l, i) => (i === index ? { ...l, href: v } : l)),
                  })
                }
              />
            </Field>
          </div>
        ))}
      </div>

      <SaveBar isSaving={isSaving} onSave={() => void save()} />
    </div>
  )
}

// ── Hero editor ───────────────────────────────────────────────────────────

function HeroEditor({
  content,
  onSave,
}: {
  content: HeroContent
  onSave: (next: HeroContent) => Promise<void>
}) {
  const [draft, setDraft] = useState<HeroContent>(content)
  const [isSaving, setIsSaving] = useState(false)

  async function save() {
    setIsSaving(true)
    try {
      await onSave(draft)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="sep-body">
      <PanelHeading title="Hero Banner" subtitle="Main headline, description, CTAs, and hero image." />

      <Field label="Badge text">
        <Input value={draft.badge} onChange={(v) => setDraft({ ...draft, badge: v })} />
      </Field>
      <Field label="Headline">
        <Textarea
          value={draft.title}
          onChange={(v) => setDraft({ ...draft, title: v })}
          rows={2}
        />
      </Field>
      <Field label="Highlighted word (in headline)">
        <Input
          value={draft.highlightedWord}
          onChange={(v) => setDraft({ ...draft, highlightedWord: v })}
        />
      </Field>
      <Field label="Description">
        <Textarea
          value={draft.description}
          onChange={(v) => setDraft({ ...draft, description: v })}
          rows={3}
        />
      </Field>
      <Field label="Primary CTA label">
        <Input value={draft.primaryCta} onChange={(v) => setDraft({ ...draft, primaryCta: v })} />
      </Field>
      <Field label="Secondary CTA label">
        <Input
          value={draft.secondaryCta}
          onChange={(v) => setDraft({ ...draft, secondaryCta: v })}
        />
      </Field>
      <ImageField
        label="Hero image URL"
        value={draft.imageSrc}
        onChange={(v) => setDraft({ ...draft, imageSrc: v })}
      />
      <Field label="Image alt text">
        <Input value={draft.imageAlt} onChange={(v) => setDraft({ ...draft, imageAlt: v })} />
      </Field>

      <SaveBar isSaving={isSaving} onSave={() => void save()} />
    </div>
  )
}

// ── About editor ──────────────────────────────────────────────────────────

function AboutEditor({
  content,
  onSave,
}: {
  content: AboutSectionContent
  onSave: (next: AboutSectionContent) => Promise<void>
}) {
  const [draft, setDraft] = useState<AboutSectionContent>(content)
  const [isSaving, setIsSaving] = useState(false)

  function updateStat(index: number, patch: Partial<AboutStat>) {
    setDraft({
      ...draft,
      stats: draft.stats.map((s, i) => (i === index ? { ...s, ...patch } : s)),
    })
  }

  async function save() {
    setIsSaving(true)
    try {
      await onSave(draft)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="sep-body">
      <PanelHeading title="About Section" subtitle="Company overview text and key stats." />
      <Field label="Section title">
        <Input value={draft.title} onChange={(v) => setDraft({ ...draft, title: v })} />
      </Field>
      <Field label="Description">
        <Textarea
          value={draft.description}
          onChange={(v) => setDraft({ ...draft, description: v })}
          rows={4}
        />
      </Field>

      <div className="sep-card-stack">
        <p className="sep-sub-heading">Stats</p>
        {draft.stats.map((stat, index) => (
          <div key={stat.id} className="sep-card">
            <Field label="Value">
              <Input value={stat.value} onChange={(v) => updateStat(index, { value: v })} />
            </Field>
            <Field label="Label">
              <Input value={stat.label} onChange={(v) => updateStat(index, { label: v })} />
            </Field>
          </div>
        ))}
      </div>

      <SaveBar isSaving={isSaving} onSave={() => void save()} />
    </div>
  )
}

// ── Products editor ───────────────────────────────────────────────────────

function ProductsEditor({
  content,
  onSave,
}: {
  content: ProductSectionContent
  onSave: (next: ProductSectionContent) => Promise<void>
}) {
  const [draft, setDraft] = useState<ProductSectionContent>(content)
  const [isSaving, setIsSaving] = useState(false)

  function updateProduct(index: number, patch: Partial<Product>) {
    setDraft({
      ...draft,
      products: draft.products.map((p, i) => (i === index ? { ...p, ...patch } : p)),
    })
  }

  async function save() {
    setIsSaving(true)
    try {
      await onSave(draft)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="sep-body">
      <PanelHeading title="Products Section" subtitle="Section title and individual product cards." />
      <Field label="Section title">
        <Input value={draft.title} onChange={(v) => setDraft({ ...draft, title: v })} />
      </Field>

      <div className="sep-card-stack">
        {draft.products.map((product, index) => (
          <div key={product.id} className="sep-card">
            <p className="sep-card__label">Product {index + 1}</p>
            <Field label="Name">
              <Input value={product.name} onChange={(v) => updateProduct(index, { name: v })} />
            </Field>
            <Field label="Category">
              <Input
                value={product.category}
                onChange={(v) => updateProduct(index, { category: v })}
              />
            </Field>
            <Field label="Description">
              <Textarea
                value={product.description}
                onChange={(v) => updateProduct(index, { description: v })}
                rows={2}
              />
            </Field>
            <Field label="Price">
              <Input value={product.price} onChange={(v) => updateProduct(index, { price: v })} />
            </Field>
            <ImageField
              label="Product image URL"
              value={product.imageSrc}
              onChange={(v) => updateProduct(index, { imageSrc: v })}
            />
          </div>
        ))}
      </div>

      <SaveBar isSaving={isSaving} onSave={() => void save()} />
    </div>
  )
}

// ── Team editor ───────────────────────────────────────────────────────────

function TeamEditor({
  content,
  onSave,
}: {
  content: TeamSectionContent
  onSave: (next: TeamSectionContent) => Promise<void>
}) {
  const [draft, setDraft] = useState<TeamSectionContent>(content)
  const [isSaving, setIsSaving] = useState(false)

  function updateMember(index: number, patch: Partial<TeamMember>) {
    setDraft({
      ...draft,
      members: draft.members.map((m, i) => (i === index ? { ...m, ...patch } : m)),
    })
  }

  async function save() {
    setIsSaving(true)
    try {
      await onSave(draft)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="sep-body">
      <PanelHeading title="Team Section" subtitle="Section title, description, and member cards." />
      <Field label="Section title">
        <Input value={draft.title} onChange={(v) => setDraft({ ...draft, title: v })} />
      </Field>
      <Field label="Description">
        <Textarea
          value={draft.description}
          onChange={(v) => setDraft({ ...draft, description: v })}
          rows={3}
        />
      </Field>

      <div className="sep-card-stack">
        {draft.members.map((member, index) => (
          <div key={member.id} className="sep-card">
            <p className="sep-card__label">Member {index + 1}</p>
            <Field label="Name">
              <Input value={member.name} onChange={(v) => updateMember(index, { name: v })} />
            </Field>
            <Field label="Role / Title">
              <Input value={member.role} onChange={(v) => updateMember(index, { role: v })} />
            </Field>
            <ImageField
              label="Avatar URL"
              value={member.imageSrc}
              onChange={(v) => updateMember(index, { imageSrc: v })}
            />
          </div>
        ))}
      </div>

      <SaveBar isSaving={isSaving} onSave={() => void save()} />
    </div>
  )
}

// ── Contact / Location editor ─────────────────────────────────────────────

function ContactEditor({
  content,
  onSave,
}: {
  content: LocationSectionContent
  onSave: (next: LocationSectionContent) => Promise<void>
}) {
  const [draft, setDraft] = useState<LocationSectionContent>(content)
  const [isSaving, setIsSaving] = useState(false)

  async function save() {
    setIsSaving(true)
    try {
      await onSave(draft)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="sep-body">
      <PanelHeading title="Location & Contact" subtitle="Address, contact details, map, and form text." />
      <Field label="Section title">
        <Input value={draft.title} onChange={(v) => setDraft({ ...draft, title: v })} />
      </Field>
      <Field label="Description">
        <Textarea
          value={draft.description}
          onChange={(v) => setDraft({ ...draft, description: v })}
          rows={3}
        />
      </Field>
      <Field label="Map embed URL">
        <Input
          value={draft.mapEmbedUrl}
          onChange={(v) => setDraft({ ...draft, mapEmbedUrl: v })}
        />
      </Field>

      <div className="sep-card">
        <p className="sep-card__label">Contact details</p>
        <Field label="Address lines (first)">
          <Input
            value={draft.contactDetails.addressLines[0] ?? ''}
            onChange={(v) =>
              setDraft({
                ...draft,
                contactDetails: {
                  ...draft.contactDetails,
                  addressLines: [v, draft.contactDetails.addressLines[1] ?? ''],
                },
              })
            }
          />
        </Field>
        <Field label="Address lines (second)">
          <Input
            value={draft.contactDetails.addressLines[1] ?? ''}
            onChange={(v) =>
              setDraft({
                ...draft,
                contactDetails: {
                  ...draft.contactDetails,
                  addressLines: [draft.contactDetails.addressLines[0] ?? '', v],
                },
              })
            }
          />
        </Field>
        <Field label="Email">
          <Input
            value={draft.contactDetails.email}
            onChange={(v) =>
              setDraft({
                ...draft,
                contactDetails: { ...draft.contactDetails, email: v },
              })
            }
          />
        </Field>
        <Field label="Phone">
          <Input
            value={draft.contactDetails.phone}
            onChange={(v) =>
              setDraft({
                ...draft,
                contactDetails: { ...draft.contactDetails, phone: v },
              })
            }
          />
        </Field>
      </div>

      <div className="sep-card">
        <p className="sep-card__label">Contact form</p>
        <Field label="Form heading">
          <Input
            value={draft.form.title}
            onChange={(v) => setDraft({ ...draft, form: { ...draft.form, title: v } })}
          />
        </Field>
        <Field label="Form description">
          <Textarea
            value={draft.form.description}
            onChange={(v) => setDraft({ ...draft, form: { ...draft.form, description: v } })}
            rows={2}
          />
        </Field>
        <Field label="Submit button label">
          <Input
            value={draft.form.submitLabel}
            onChange={(v) =>
              setDraft({ ...draft, form: { ...draft.form, submitLabel: v } })
            }
          />
        </Field>
      </div>

      <SaveBar isSaving={isSaving} onSave={() => void save()} />
    </div>
  )
}

// ── Footer editor ─────────────────────────────────────────────────────────

function FooterEditor({
  content,
  onSave,
}: {
  content: FooterContent
  onSave: (next: FooterContent) => Promise<void>
}) {
  const [draft, setDraft] = useState<FooterContent>(content)
  const [isSaving, setIsSaving] = useState(false)

  function updateColumnLinks(colIndex: number, linksRaw: string) {
    setDraft({
      ...draft,
      columns: draft.columns.map((col, i) =>
        i === colIndex
          ? { ...col, links: linksRaw.split('\n').map((l) => l.trim()).filter(Boolean) }
          : col,
      ),
    })
  }

  async function save() {
    setIsSaving(true)
    try {
      await onSave(draft)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="sep-body">
      <PanelHeading title="Footer" subtitle="Brand, description, link columns, and copyright." />
      <Field label="Brand name">
        <Input value={draft.brandName} onChange={(v) => setDraft({ ...draft, brandName: v })} />
      </Field>
      <Field label="Tagline / Description">
        <Textarea
          value={draft.description}
          onChange={(v) => setDraft({ ...draft, description: v })}
          rows={3}
        />
      </Field>
      <Field label="Copyright line">
        <Input value={draft.copyright} onChange={(v) => setDraft({ ...draft, copyright: v })} />
      </Field>

      <div className="sep-card-stack">
        <p className="sep-sub-heading">Link columns</p>
        {draft.columns.map((col, colIndex) => (
          <div key={col.id} className="sep-card">
            <Field label="Column title">
              <Input
                value={col.title}
                onChange={(v) =>
                  setDraft({
                    ...draft,
                    columns: draft.columns.map((c, i) =>
                      i === colIndex ? { ...c, title: v } : c,
                    ),
                  })
                }
              />
            </Field>
            <Field label="Links (one per line)">
              <Textarea
                value={col.links.join('\n')}
                onChange={(v) => updateColumnLinks(colIndex, v)}
                rows={4}
              />
            </Field>
          </div>
        ))}
      </div>

      <SaveBar isSaving={isSaving} onSave={() => void save()} />
    </div>
  )
}

// ── Section order editor ──────────────────────────────────────────────────

const SECTION_LABEL: Record<SectionKey, string> = {
  home: 'Hero Banner',
  about: 'About',
  products: 'Products',
  team: 'Team',
  contact: 'Location + Contact',
}

function OrderEditor({
  config,
  onSave,
}: {
  config: CompanyWebsiteContent
  onSave: (next: SectionKey[]) => Promise<void>
}) {
  const [order, setOrder] = useState<SectionKey[]>(config.sectionOrder)
  const [isSaving, setIsSaving] = useState(false)

  function move(index: number, direction: 'up' | 'down') {
    const target = direction === 'up' ? index - 1 : index + 1
    if (target < 0 || target >= order.length) return
    const next = [...order]
    const [item] = next.splice(index, 1)
    next.splice(target, 0, item)
    setOrder(next)
  }

  async function save() {
    setIsSaving(true)
    try {
      await onSave(order)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="sep-body">
      <PanelHeading
        title="Section Order"
        subtitle="Drag the order in which sections appear on the live site."
      />
      <div className="sep-card-stack">
        {order.map((key, index) => (
          <div key={key} className="sep-order-row">
            <span className="sep-order-num">{index + 1}</span>
            <span className="sep-order-label">{SECTION_LABEL[key]}</span>
            <div className="sep-order-btns">
              <button
                className="sep-move-btn"
                disabled={index === 0}
                onClick={() => move(index, 'up')}
                title="Move up"
              >
                ▲
              </button>
              <button
                className="sep-move-btn"
                disabled={index === order.length - 1}
                onClick={() => move(index, 'down')}
                title="Move down"
              >
                ▼
              </button>
            </div>
          </div>
        ))}
      </div>
      <SaveBar isSaving={isSaving} onSave={() => void save()} />
    </div>
  )
}

// ── Root panel dispatcher ─────────────────────────────────────────────────

export function SectionEditorPanel({ activeSection, config, onConfigChange, onToast }: Props) {
  async function handleSaveSection<K extends 'header' | 'hero' | 'about' | 'products' | 'team' | 'location' | 'footer'>(
    key: K,
    data: CompanyWebsiteContent[K],
  ) {
    try {
      const result = await saveCmsSection(
        key as Parameters<typeof saveCmsSection>[0],
        data as Parameters<typeof saveCmsSection>[1],
      )
      onConfigChange(result.config)
      onToast(`${key.charAt(0).toUpperCase() + key.slice(1)} saved!`, 'success')
    } catch (error) {
      onToast(error instanceof Error ? error.message : 'Save failed.', 'error')
    }
  }

  async function handleSaveNavLinks(header: HeaderContent) {
    try {
      const result = await saveNavLinks(header.navLinks)
      onConfigChange(result.config)
      // Also save non-navLink header fields via section endpoint
      const fullResult = await saveCmsSection('header', header)
      onConfigChange(fullResult.config)
      onToast('Header saved!', 'success')
    } catch (error) {
      onToast(error instanceof Error ? error.message : 'Save failed.', 'error')
    }
  }

  async function handleSaveOrder(order: SectionKey[]) {
    try {
      const result = await saveSectionOrder(order)
      onConfigChange(result.config)
      onToast('Section order saved!', 'success')
    } catch (error) {
      onToast(error instanceof Error ? error.message : 'Save failed.', 'error')
    }
  }

  async function handleSaveAll(next: CompanyWebsiteContent) {
    try {
      const result = await saveSiteConfig(next)
      onConfigChange(result.config)
      onToast('Configuration saved!', 'success')
    } catch (error) {
      onToast(error instanceof Error ? error.message : 'Save failed.', 'error')
    }
  }
  void handleSaveAll

  switch (activeSection) {
    case 'header':
      return <HeaderEditor content={config.header} onSave={handleSaveNavLinks} />
    case 'home':
      return (
        <HeroEditor
          content={config.hero}
          onSave={(d) => handleSaveSection('hero', d)}
        />
      )
    case 'about':
      return (
        <AboutEditor
          content={config.about}
          onSave={(d) => handleSaveSection('about', d)}
        />
      )
    case 'products':
      return (
        <ProductsEditor
          content={config.products}
          onSave={(d) => handleSaveSection('products', d)}
        />
      )
    case 'team':
      return (
        <TeamEditor
          content={config.team}
          onSave={(d) => handleSaveSection('team', d)}
        />
      )
    case 'contact':
      return (
        <ContactEditor
          content={config.location}
          onSave={(d) => handleSaveSection('location', d)}
        />
      )
    case 'footer':
      return (
        <FooterEditor
          content={config.footer}
          onSave={(d) => handleSaveSection('footer', d)}
        />
      )
    case 'order':
      return <OrderEditor config={config} onSave={handleSaveOrder} />
    default:
      return (
        <div className="sep-body">
          <PanelHeading title="Select a section" subtitle="Click a section in the left sidebar to edit it." />
        </div>
      )
  }
}

import { useState } from 'react'
import { FiChevronDown, FiChevronUp, FiPlus, FiSave, FiTrash2 } from 'react-icons/fi'
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

const MAX_IMAGE_FILE_SIZE_BYTES = 4 * 1024 * 1024

function formatFileSize(sizeInBytes: number) {
  if (sizeInBytes < 1024 * 1024) {
    return `${Math.round(sizeInBytes / 1024)} KB`
  }

  return `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
        return
      }

      reject(new Error('Failed to read the selected image.'))
    }

    reader.onerror = () => reject(new Error('Failed to read the selected image.'))
    reader.readAsDataURL(file)
  })
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
    <label className="grid gap-1.5">
      <span className="text-xs font-bold uppercase tracking-wide text-emerald-700">{label}</span>
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
  const [status, setStatus] = useState<string>('')

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    if (!file.type.startsWith('image/')) {
      setStatus('Please select a valid image file.')
      event.target.value = ''
      return
    }

    if (file.size > MAX_IMAGE_FILE_SIZE_BYTES) {
      setStatus(`Image is too large. Use a file smaller than ${formatFileSize(MAX_IMAGE_FILE_SIZE_BYTES)}.`)
      event.target.value = ''
      return
    }

    try {
      const dataUrl = await readFileAsDataUrl(file)
      onChange(dataUrl)
      setStatus(`Uploaded ${file.name} (${formatFileSize(file.size)}). Image will be saved to the database when you save this section.`)
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Failed to process the selected image.')
    } finally {
      event.target.value = ''
    }
  }

  return (
    <div className="grid gap-1.5">
      <span className="text-xs font-bold uppercase tracking-wide text-emerald-700">{label}</span>
      {value && (
        <div className="aspect-[16/7] overflow-hidden rounded-md border border-emerald-200 bg-emerald-50">
          <img src={value} alt="" className="h-full w-full object-cover" />
        </div>
      )}
      <div className="rounded-md border border-dashed border-emerald-300 bg-white p-3">
        <input
          type="file"
          accept="image/*"
          onChange={(event) => void handleFileChange(event)}
          className="block w-full text-sm text-emerald-900 file:mr-3 file:rounded-md file:border-0 file:bg-emerald-700 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-emerald-800"
        />
        <p className="mt-2 text-xs text-emerald-700">
          Upload JPG, PNG, WEBP, or SVG. The file is converted and stored in MongoDB when you save.
        </p>
        {status && <p className="mt-2 text-xs font-medium text-emerald-800">{status}</p>}
        {value && (
          <button
            type="button"
            onClick={() => {
              onChange('')
              setStatus('Image removed. Save this section to update the database.')
            }}
            className="mt-3 inline-flex items-center rounded-md border border-emerald-200 px-3 py-1.5 text-xs font-semibold text-emerald-800 transition hover:bg-emerald-50"
          >
            Remove image
          </button>
        )}
      </div>
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
      className="min-h-16 w-full resize-y rounded-md border border-emerald-200 bg-white px-3 py-2 text-sm text-emerald-950 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
      value={value}
      rows={rows}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}

function Input({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <input
      className="w-full rounded-md border border-emerald-200 bg-white px-3 py-2 text-sm text-emerald-950 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
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
    <div className="mt-1 border-t border-emerald-100 pt-3">
      <Button onClick={onSave} disabled={isSaving} className="inline-flex items-center gap-2">
        <FiSave className="h-4 w-4" />
        {isSaving ? 'Saving…' : 'Save to Backend'}
      </Button>
    </div>
  )
}

function PanelHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-1 border-b border-emerald-200 pb-3">
      <h2 className="text-base font-black text-emerald-950">{title}</h2>
      {subtitle && <p className="mt-1 text-xs text-emerald-700">{subtitle}</p>}
    </div>
  )
}

function createId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
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

  function addNavLink() {
    setDraft({
      ...draft,
      navLinks: [...draft.navLinks, { id: createId('nav'), label: 'New Link', href: '#new' }],
    })
  }

  function removeNavLink(index: number) {
    if (draft.navLinks.length <= 1) {
      return
    }

    setDraft({
      ...draft,
      navLinks: draft.navLinks.filter((_, i) => i !== index),
    })
  }

  return (
    <div className="space-y-4 p-4">
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

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-extrabold uppercase tracking-widest text-emerald-700">Navigation links</p>
          <Button size="sm" variant="ghost" onClick={addNavLink} className="inline-flex items-center gap-1">
            <FiPlus className="h-4 w-4" />
            Add Link
          </Button>
        </div>
        {draft.navLinks.map((link, index) => (
          <div key={link.id} className="space-y-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-extrabold uppercase tracking-widest text-emerald-700">Link {index + 1}</p>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => removeNavLink(index)}
                disabled={draft.navLinks.length <= 1}
                className="inline-flex items-center gap-1 text-rose-700 hover:bg-rose-50 hover:text-rose-800"
              >
                <FiTrash2 className="h-4 w-4" />
                Remove
              </Button>
            </div>
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
    <div className="space-y-4 p-4">
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
        label="Hero image"
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

  function addStat() {
    setDraft({
      ...draft,
      stats: [...draft.stats, { id: createId('stat'), label: 'New stat', value: '0' }],
    })
  }

  function removeStat(index: number) {
    if (draft.stats.length <= 1) {
      return
    }

    setDraft({
      ...draft,
      stats: draft.stats.filter((_, i) => i !== index),
    })
  }

  return (
    <div className="space-y-4 p-4">
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

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-extrabold uppercase tracking-widest text-emerald-700">Stats</p>
          <Button size="sm" variant="ghost" onClick={addStat} className="inline-flex items-center gap-1">
            <FiPlus className="h-4 w-4" />
            Add Stat
          </Button>
        </div>
        {draft.stats.map((stat, index) => (
          <div key={stat.id} className="space-y-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-extrabold uppercase tracking-widest text-emerald-700">Stat {index + 1}</p>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => removeStat(index)}
                disabled={draft.stats.length <= 1}
                className="inline-flex items-center gap-1 text-rose-700 hover:bg-rose-50 hover:text-rose-800"
              >
                <FiTrash2 className="h-4 w-4" />
                Remove
              </Button>
            </div>
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

  function addProduct() {
    setDraft({
      ...draft,
      products: [
        ...draft.products,
        {
          id: createId('product'),
          name: 'New Product',
          category: 'Category',
          description: 'Describe this product.',
          price: '$0',
          imageSrc: '',
        },
      ],
    })
  }

  function removeProduct(index: number) {
    if (draft.products.length <= 1) {
      return
    }

    setDraft({
      ...draft,
      products: draft.products.filter((_, i) => i !== index),
    })
  }

  return (
    <div className="space-y-4 p-4">
      <PanelHeading title="Products Section" subtitle="Section title and individual product cards." />
      <Field label="Section title">
        <Input value={draft.title} onChange={(v) => setDraft({ ...draft, title: v })} />
      </Field>

      <div className="space-y-3">
        <div className="flex items-center justify-end">
          <Button size="sm" variant="ghost" onClick={addProduct} className="inline-flex items-center gap-1">
            <FiPlus className="h-4 w-4" />
            Add Product
          </Button>
        </div>
        {draft.products.map((product, index) => (
          <div key={product.id} className="space-y-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-extrabold uppercase tracking-widest text-emerald-700">Product {index + 1}</p>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => removeProduct(index)}
                disabled={draft.products.length <= 1}
                className="inline-flex items-center gap-1 text-rose-700 hover:bg-rose-50 hover:text-rose-800"
              >
                <FiTrash2 className="h-4 w-4" />
                Remove
              </Button>
            </div>
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
              label="Product image"
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

  function addMember() {
    setDraft({
      ...draft,
      members: [
        ...draft.members,
        {
          id: createId('member'),
          name: 'New Team Member',
          role: 'Role',
          imageSrc: '',
        },
      ],
    })
  }

  function removeMember(index: number) {
    if (draft.members.length <= 1) {
      return
    }

    setDraft({
      ...draft,
      members: draft.members.filter((_, i) => i !== index),
    })
  }

  return (
    <div className="space-y-4 p-4">
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

      <div className="space-y-3">
        <div className="flex items-center justify-end">
          <Button size="sm" variant="ghost" onClick={addMember} className="inline-flex items-center gap-1">
            <FiPlus className="h-4 w-4" />
            Add Member
          </Button>
        </div>
        {draft.members.map((member, index) => (
          <div key={member.id} className="space-y-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-extrabold uppercase tracking-widest text-emerald-700">Member {index + 1}</p>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => removeMember(index)}
                disabled={draft.members.length <= 1}
                className="inline-flex items-center gap-1 text-rose-700 hover:bg-rose-50 hover:text-rose-800"
              >
                <FiTrash2 className="h-4 w-4" />
                Remove
              </Button>
            </div>
            <Field label="Name">
              <Input value={member.name} onChange={(v) => updateMember(index, { name: v })} />
            </Field>
            <Field label="Role / Title">
              <Input value={member.role} onChange={(v) => updateMember(index, { role: v })} />
            </Field>
            <ImageField
              label="Avatar image"
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
    <div className="space-y-4 p-4">
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

      <div className="space-y-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3">
        <p className="text-xs font-extrabold uppercase tracking-widest text-emerald-700">Contact details</p>
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

      <div className="space-y-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3">
        <p className="text-xs font-extrabold uppercase tracking-widest text-emerald-700">Contact form</p>
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

  function addColumn() {
    setDraft({
      ...draft,
      columns: [...draft.columns, { id: createId('column'), title: 'New Column', links: [] }],
    })
  }

  function removeColumn(index: number) {
    if (draft.columns.length <= 1) {
      return
    }

    setDraft({
      ...draft,
      columns: draft.columns.filter((_, i) => i !== index),
    })
  }

  return (
    <div className="space-y-4 p-4">
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

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-extrabold uppercase tracking-widest text-emerald-700">Link columns</p>
          <Button size="sm" variant="ghost" onClick={addColumn} className="inline-flex items-center gap-1">
            <FiPlus className="h-4 w-4" />
            Add Column
          </Button>
        </div>
        {draft.columns.map((col, colIndex) => (
          <div key={col.id} className="space-y-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-extrabold uppercase tracking-widest text-emerald-700">Column {colIndex + 1}</p>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => removeColumn(colIndex)}
                disabled={draft.columns.length <= 1}
                className="inline-flex items-center gap-1 text-rose-700 hover:bg-rose-50 hover:text-rose-800"
              >
                <FiTrash2 className="h-4 w-4" />
                Remove
              </Button>
            </div>
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
    <div className="space-y-4 p-4">
      <PanelHeading
        title="Section Order"
        subtitle="Drag the order in which sections appear on the live site."
      />
      <div className="space-y-2">
        {order.map((key, index) => (
          <div key={key} className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-700 text-xs font-extrabold text-white">{index + 1}</span>
            <span className="flex-1 text-sm font-semibold text-emerald-950">{SECTION_LABEL[key]}</span>
            <div className="flex gap-1">
              <button
                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-emerald-200 bg-white text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-40"
                disabled={index === 0}
                onClick={() => move(index, 'up')}
                title="Move up"
              >
                <FiChevronUp className="h-4 w-4" />
              </button>
              <button
                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-emerald-200 bg-white text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-40"
                disabled={index === order.length - 1}
                onClick={() => move(index, 'down')}
                title="Move down"
              >
                <FiChevronDown className="h-4 w-4" />
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
        <div className="space-y-4 p-4">
          <PanelHeading title="Select a section" subtitle="Click a section in the left sidebar to edit it." />
        </div>
      )
  }
}

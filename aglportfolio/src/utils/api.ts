import type {
  AboutSectionContent,
  CompanyWebsiteContent,
  FooterContent,
  HeaderContent,
  HeroContent,
  LocationSectionContent,
  NavLink,
  ProductSectionContent,
  SectionKey,
  TeamSectionContent,
} from '../components/website/types'

const RAW_API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim() || ''

function normalizeApiBaseUrl(rawBaseUrl: string) {
  if (!rawBaseUrl) {
    return ''
  }

  if (rawBaseUrl.startsWith('http://') || rawBaseUrl.startsWith('https://')) {
    return rawBaseUrl.replace(/\/+$/, '')
  }

  return `http://${rawBaseUrl}`.replace(/\/+$/, '')
}

const API_BASE_URL = normalizeApiBaseUrl(RAW_API_BASE_URL)

function apiUrl(path: string) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`

  if (!API_BASE_URL) {
    return normalizedPath
  }

  return new URL(normalizedPath, `${API_BASE_URL}/`).toString()
}

type CmsMeta = {
  updatedAt: string
  publishedAt: string
}

type CmsResponse = {
  config: CompanyWebsiteContent
  meta: CmsMeta
}

type CmsStateResponse = {
  draft: CompanyWebsiteContent
  published: CompanyWebsiteContent
  meta: CmsMeta
}

type SectionOrderResponse = {
  sectionOrder: SectionKey[]
  meta: CmsMeta
}

export type ContactMessageInput = {
  name: string
  email: string
  message: string
}

type ContactMessageResponse = {
  success: boolean
  message: string
}

export type ReviewInput = {
  rating: number
  reviewerName?: string
  staffName?: string
  comment?: string
}

export type StoredReview = {
  _id: string
  rating: number
  reviewerName: string | null
  staffName: string | null
  comment: string | null
  submittedAt: string
}

export type ReviewsResponse = {
  reviews: StoredReview[]
  total: number
  averageRating: number | null
  ratingCounts: Array<{ _id: number; count: number }>
}

export type PublicUser = {
  id: string
  username: string
  role?: string
}

export type SiteSectionName =
  | 'header'
  | 'home'
  | 'hero'
  | 'about'
  | 'products'
  | 'team'
  | 'contact'
  | 'location'
  | 'footer'
  | 'order'
  | 'section-order'

type SectionResponse<T = unknown> = {
  sectionName: string
  resolvedSection: string
  data: T
  meta: CmsMeta
}

type SectionsResponse = {
  sections: Record<string, unknown>
  meta: CmsMeta
}

export type CmsSectionMap = {
  header: HeaderContent
  hero: HeroContent
  about: AboutSectionContent
  products: ProductSectionContent
  team: TeamSectionContent
  location: LocationSectionContent
  footer: FooterContent
}

async function parseCmsResponse(response: Response, action: string): Promise<CmsResponse> {
  if (!response.ok) {
    throw new Error(`Failed to ${action}: ${response.status}`)
  }

  return response.json() as Promise<CmsResponse>
}

export async function fetchPublishedSiteConfig(): Promise<CompanyWebsiteContent> {
  const response = await fetch(apiUrl('/api/site-config'))
  if (!response.ok) {
    throw new Error(`Failed to fetch published site config: ${response.status}`)
  }

  return response.json() as Promise<CompanyWebsiteContent>
}

export async function fetchPublishedSections(): Promise<SectionsResponse> {
  const response = await fetch(apiUrl('/api/site-config/sections'))
  if (!response.ok) {
    throw new Error(`Failed to fetch published sections: ${response.status}`)
  }

  return response.json() as Promise<SectionsResponse>
}

export async function fetchPublishedSectionOrder(): Promise<SectionOrderResponse> {
  const response = await fetch(apiUrl('/api/site-config/section-order'))
  if (!response.ok) {
    throw new Error(`Failed to fetch published section order: ${response.status}`)
  }

  return response.json() as Promise<SectionOrderResponse>
}

export async function fetchPublishedSection(sectionName: SiteSectionName): Promise<SectionResponse> {
  const response = await fetch(apiUrl(`/api/site-config/section/${sectionName}`))
  if (!response.ok) {
    throw new Error(`Failed to fetch published section ${sectionName}: ${response.status}`)
  }

  return response.json() as Promise<SectionResponse>
}

export async function fetchCmsConfig(): Promise<CmsResponse> {
  const response = await fetch(apiUrl('/api/cms/config'))
  return parseCmsResponse(response, 'fetch CMS config')
}

export async function fetchCmsState(): Promise<CmsStateResponse> {
  const response = await fetch(apiUrl('/api/cms/state'))
  if (!response.ok) {
    throw new Error(`Failed to fetch CMS state: ${response.status}`)
  }

  return response.json() as Promise<CmsStateResponse>
}

export async function fetchCmsSections(): Promise<SectionsResponse> {
  const response = await fetch(apiUrl('/api/cms/sections'))
  if (!response.ok) {
    throw new Error(`Failed to fetch CMS sections: ${response.status}`)
  }

  return response.json() as Promise<SectionsResponse>
}

export async function fetchCmsSectionOrder(): Promise<SectionOrderResponse> {
  const response = await fetch(apiUrl('/api/cms/section-order'))
  if (!response.ok) {
    throw new Error(`Failed to fetch CMS section order: ${response.status}`)
  }

  return response.json() as Promise<SectionOrderResponse>
}

export async function fetchCmsSection(sectionName: SiteSectionName): Promise<SectionResponse> {
  const response = await fetch(apiUrl(`/api/cms/section/${sectionName}`))
  if (!response.ok) {
    throw new Error(`Failed to fetch CMS section ${sectionName}: ${response.status}`)
  }

  return response.json() as Promise<SectionResponse>
}

export async function fetchCmsPreview(): Promise<CmsResponse> {
  const response = await fetch(apiUrl('/api/cms/preview'))
  return parseCmsResponse(response, 'fetch CMS preview')
}

export async function saveSiteConfig(config: CompanyWebsiteContent): Promise<CmsResponse> {
  const response = await fetch(apiUrl('/api/cms/config'), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(config),
  })

  return parseCmsResponse(response, 'save site config')
}

export async function saveSectionOrder(sectionOrder: SectionKey[]): Promise<CmsResponse> {
  const response = await fetch(apiUrl('/api/cms/section-order'), {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ sectionOrder }),
  })

  return parseCmsResponse(response, 'save section order')
}

export async function saveNavLinks(navLinks: NavLink[]): Promise<CmsResponse> {
  const response = await fetch(apiUrl('/api/cms/nav-links'), {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ navLinks }),
  })

  return parseCmsResponse(response, 'save nav links')
}

export async function saveCmsSection<K extends keyof CmsSectionMap>(
  sectionName: K,
  sectionData: CmsSectionMap[K],
): Promise<CmsResponse> {
  const response = await fetch(apiUrl(`/api/cms/section/${sectionName}`), {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(sectionData),
  })

  return parseCmsResponse(response, `save section ${String(sectionName)}`)
}

export async function publishCmsConfig(): Promise<CmsResponse> {
  const response = await fetch(apiUrl('/api/cms/publish'), {
    method: 'POST',
  })

  return parseCmsResponse(response, 'publish CMS config')
}

export async function resetCmsDraft(): Promise<CmsResponse> {
  const response = await fetch(apiUrl('/api/cms/reset-draft'), {
    method: 'POST',
  })

  return parseCmsResponse(response, 'reset CMS draft')
}

export async function resetCmsAll(): Promise<CmsResponse> {
  const response = await fetch(apiUrl('/api/cms/reset-all'), {
    method: 'POST',
  })

  return parseCmsResponse(response, 'reset all CMS data')
}

export async function sendContactMessage(payload: ContactMessageInput): Promise<ContactMessageResponse> {
  const response = await fetch(apiUrl('/api/contact'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    let serverMessage = `Failed to send contact message: ${response.status}`
    try {
      const payload = (await response.json()) as { error?: string; message?: string }
      serverMessage = payload.error || payload.message || serverMessage
    } catch {
      // Ignore parsing errors and keep the fallback message.
    }
    throw new Error(serverMessage)
  }

  return response.json() as Promise<ContactMessageResponse>
}

export async function fetchReviews(limit = 20, skip = 0): Promise<ReviewsResponse> {
  const response = await fetch(apiUrl(`/api/reviews?limit=${limit}&skip=${skip}`))
  if (!response.ok) {
    throw new Error(`Failed to fetch reviews: ${response.status}`)
  }
  return response.json() as Promise<ReviewsResponse>
}

export async function submitReview(payload: ReviewInput): Promise<{ success: boolean; review: StoredReview }> {
  const response = await fetch(apiUrl('/api/reviews'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!response.ok) {
    let serverMessage = `Failed to submit review: ${response.status}`
    try {
      const body = (await response.json()) as { error?: string; message?: string }
      serverMessage = body.error || body.message || serverMessage
    } catch {
      // keep fallback
    }
    throw new Error(serverMessage)
  }
  return response.json() as Promise<{ success: boolean; review: StoredReview }>
}

export async function fetchPublicUsers(): Promise<PublicUser[]> {
  const response = await fetch('https://api.agl.business/api/auth/public/users')
  if (!response.ok) {
    throw new Error(`Failed to fetch public users: ${response.status}`)
  }

  const payload = (await response.json()) as {
    data?: {
      users?: Array<{
        _id?: string
        username?: string
        role?: string
        isActive?: boolean
        isActve?: boolean
      }>
    }
  }

  const users = payload.data?.users ?? []

  return users
    .filter((user) => user.isActive !== false && user.isActve !== false)
    .map((user) => ({
      id: user._id ?? `${user.username ?? ''}-${user.role ?? ''}`,
      username: (user.username ?? '').replace(/\s+/g, ' ').trim(),
      role: user.role,
    }))
    .filter((user) => Boolean(user.id && user.username))
    .sort((a, b) => a.username.localeCompare(b.username))
}

// --- CTA tracking ---

export type CtaButtonName = 'explore' | 'watch-demo' | 'get-started' | string

export async function trackCtaClick(button: CtaButtonName, source = 'home'): Promise<void> {
  try {
    await fetch(apiUrl('/api/track/cta'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ button, source }),
    })
  } catch {
    // Tracking failures are silent — never block the user action
  }
}

export async function fetchCtaStats(): Promise<
  { button: string; count: number; lastClickedAt: string | null }[]
> {
  const response = await fetch(apiUrl('/api/cms/cta-stats'))
  if (!response.ok) throw new Error(`Failed to fetch CTA stats: ${response.status}`)
  const payload = (await response.json()) as {
    stats: { button: string; count: number; lastClickedAt: string | null }[]
  }
  return payload.stats ?? []
}


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
    throw new Error(`Failed to send contact message: ${response.status}`)
  }

  return response.json() as Promise<ContactMessageResponse>
}

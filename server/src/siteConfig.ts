import { getDb } from './db'

export type SectionKey = 'home' | 'about' | 'products' | 'team' | 'contact'

export type SiteConfig = {
  sectionOrder: SectionKey[]
  header: {
    badge: string
    brandName: string
    ctaLabel: string
    navLinks: Array<{ id: string; label: string; href: string }>
  }
  hero: {
    id: SectionKey
    badge: string
    title: string
    highlightedWord: string
    description: string
    primaryCta: string
    secondaryCta: string
    videoUrl: string
    imageSrc: string
    imageAlt: string
  }
  about: {
    id: string
    title: string
    description: string
    stats: Array<{ id: string; label: string; value: string }>
  }
  products: {
    id: string
    title: string
    products: Array<{
      id: string
      category: string
      name: string
      description: string
      imageSrc: string
    }>
  }
  team: {
    id: string
    title: string
    description: string
    members: Array<{ id: string; name: string; role: string; imageSrc: string }>
  }
  location: {
    id: string
    title: string
    description: string
    mapEmbedUrl: string
    contactDetails: {
      addressLabel: string
      addressLines: string[]
      contactLabel: string
      email: string
      phone: string
    }
    form: {
      title: string
      description: string
      submitLabel: string
    }
  }
  footer: {
    brandName: string
    description: string
    columns: Array<{ id: string; title: string; links: string[] }>
    copyright: string
  }
}

const SITE_STATE_COLLECTION = 'site_state'
const SITE_STATE_KEY = 'primary'

type SiteState = {
  draft: SiteConfig
  published: SiteConfig
  updatedAt: string
  publishedAt: string
}

type SiteStateDocument = SiteState & {
  key: string
}

export const defaultSiteConfig: SiteConfig = {
  sectionOrder: ['home', 'about', 'products', 'team', 'contact'],
  header: {
    badge: 'Apsonic Motors Partner',
    brandName: 'GreenRide Apsonic',
    ctaLabel: 'Get Started',
    navLinks: [
      { id: 'home', label: 'Home', href: '#home' },
      { id: 'products', label: 'Products', href: '#products' },
      { id: 'team', label: 'Team', href: '#team' },
      { id: 'contact', label: 'Contact', href: '#contact' },
    ],
  },
  hero: {
    id: 'home',
    badge: 'Sustainable Mobility Platform',
    title: 'Powering a Smarter and Greener Future for Riders',
    highlightedWord: 'Greener',
    description:
      'Discover dependable Apsonic motorcycles, service expertise, and fleet-ready support designed for modern commuters and businesses.',
    primaryCta: 'Explore Our Models',
    secondaryCta: 'Watch Demo',
    videoUrl: 'https://youtu.be/M7lc1UVf-VE',
    imageSrc: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Apsonic motorcycles display',
  },
  about: {
    id: 'about',
    title: 'About GreenRide Apsonic',
    description:
      'We combine trusted Apsonic product distribution with practical service operations to help riders, delivery teams, and businesses scale with confidence.',
    stats: [
      { id: 'network', label: 'Service Locations', value: '18+' },
      { id: 'riders', label: 'Active Riders Supported', value: '12k+' },
      { id: 'uptime', label: 'Fleet Uptime', value: '96%' },
    ],
  },
  products: {
    id: 'products',
    title: 'Featured Apsonic Models',
    products: [
      {
        id: 'ap150-7',
        category: 'Commuter',
        name: 'Apsonic AP150-7',
        description: 'Fuel-efficient and dependable for daily urban commuting with practical long-term maintenance costs.',
        imageSrc: 'https://images.unsplash.com/photo-1558981285-6f0c94958bb6?auto=format&fit=crop&w=1200&q=80',
      },
      {
        id: 'ap200gy',
        category: 'Dual Purpose',
        name: 'Apsonic AP200GY',
        description: 'Built for mixed road conditions and commercial routes that demand stronger suspension and reliability.',
        imageSrc: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80',
      },
      {
        id: 'ap125-2',
        category: 'Entry Series',
        name: 'Apsonic AP125-2',
        description: 'Lightweight model suited for new riders and city fleets focused on efficient delivery cycles.',
        imageSrc: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=1200&q=80',
      },
    ],
  },
  team: {
    id: 'team',
    title: 'Leadership Team',
    description: 'Our leadership and employee team aligns product delivery, customer support, and operational excellence.',
    members: [
      {
        id: 'kwesi-armah',
        name: 'Kwesi Armah',
        role: 'Managing Director',
        imageSrc: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
      },
      {
        id: 'abena-ofori',
        name: 'Abena Ofori',
        role: 'Head of Operations',
        imageSrc: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
      },
      {
        id: 'daniel-boateng',
        name: 'Daniel Boateng',
        role: 'Technical Service Lead',
        imageSrc: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      },
      {
        id: 'miriam-asare',
        name: 'Miriam Asare',
        role: 'Customer Success Manager',
        imageSrc: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80',
      },
    ],
  },
  location: {
    id: 'contact',
    title: 'Visit Our Location',
    description: 'Our Accra showroom and service center supports test rides, model consultations, and post-purchase maintenance.',
    mapEmbedUrl: 'https://www.openstreetmap.org/export/embed.html?bbox=-0.236%2C5.53%2C-0.11%2C5.63&layer=mapnik',
    contactDetails: {
      addressLabel: 'Address',
      addressLines: ['No. 12 Industrial Road, North Kaneshie', 'Accra, Ghana'],
      contactLabel: 'Contact',
      email: 'sales@greenride-apsonic.com',
      phone: '+233 20 000 1234',
    },
    form: {
      title: 'Get in Touch',
      description: 'Have an inquiry about fleet options or service plans? Send us a message.',
      submitLabel: 'Send Message',
    },
  },
  footer: {
    brandName: 'GreenRide Apsonic',
    description: 'Delivering practical and sustainable mobility through trusted Apsonic motorcycles and responsive support.',
    columns: [
      {
        id: 'quick-links',
        title: 'Quick Links',
        links: ['About Us', 'Products', 'Leadership Team', 'Contact'],
      },
      {
        id: 'support',
        title: 'Support',
        links: ['Help Center', 'Warranty', 'Terms of Service', 'Privacy Policy'],
      },
      {
        id: 'resources',
        title: 'Resources',
        links: ['Fleet Guide', 'Maintenance Tips', 'Dealer Program', 'Campaign Updates'],
      },
    ],
    copyright: '© 2026 GreenRide Apsonic. All rights reserved.',
  },
}

function cloneConfig<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

function normalizeSiteConfig(config: SiteConfig): SiteConfig {
  return {
    ...config,
    hero: {
      ...config.hero,
      videoUrl:
        typeof config.hero?.videoUrl === 'string' && config.hero.videoUrl.trim().length > 0
          ? config.hero.videoUrl.trim()
          : defaultSiteConfig.hero.videoUrl,
    },
    products: {
      ...config.products,
      products: config.products.products.map((product) => ({
        id: product.id,
        category: product.category,
        name: product.name,
        description: product.description,
        imageSrc: product.imageSrc,
      })),
    },
  }
}

function createDefaultSiteState(): SiteState {
  const now = new Date().toISOString()
  return {
    draft: cloneConfig(defaultSiteConfig),
    published: cloneConfig(defaultSiteConfig),
    updatedAt: now,
    publishedAt: now,
  }
}

let siteState: SiteState = createDefaultSiteState()

function isConfigLike(value: unknown): value is SiteConfig {
  if (!value || typeof value !== 'object') {
    return false
  }

  const candidate = value as Partial<SiteConfig>
  return Boolean(candidate.header && candidate.hero && candidate.products && candidate.team && candidate.location && candidate.footer)
}

function isSiteStateLike(value: unknown): value is SiteState {
  if (!value || typeof value !== 'object') {
    return false
  }

  const candidate = value as Partial<SiteState>
  return Boolean(
    candidate.draft &&
      candidate.published &&
      isConfigLike(candidate.draft) &&
      isConfigLike(candidate.published) &&
      typeof candidate.updatedAt === 'string' &&
      typeof candidate.publishedAt === 'string',
  )
}

export async function loadSiteConfig(): Promise<SiteConfig> {
  const collection = await getSiteStateCollection()
  const existingState = await collection.findOne({ key: SITE_STATE_KEY })

  if (existingState && isSiteStateLike(existingState)) {
    const normalizedDraft = normalizeSiteConfig(existingState.draft)
    const normalizedPublished = normalizeSiteConfig(existingState.published)

    siteState = {
      draft: cloneConfig(normalizedDraft),
      published: cloneConfig(normalizedPublished),
      updatedAt: existingState.updatedAt,
      publishedAt: existingState.publishedAt,
    }
    return siteState.published
  }

  siteState = createDefaultSiteState()
  await persistSiteState(siteState)
  return siteState.published
}

export function getSiteConfig(): SiteConfig {
  return siteState.published
}

export function getDraftSiteConfig(): SiteConfig {
  return siteState.draft
}

export function getSiteStateMeta() {
  return {
    updatedAt: siteState.updatedAt,
    publishedAt: siteState.publishedAt,
  }
}

async function persistSiteState(nextState: SiteState): Promise<SiteState> {
  siteState = {
    draft: cloneConfig(nextState.draft),
    published: cloneConfig(nextState.published),
    updatedAt: nextState.updatedAt,
    publishedAt: nextState.publishedAt,
  }

  const collection = await getSiteStateCollection()
  const document: SiteStateDocument = {
    key: SITE_STATE_KEY,
    ...siteState,
  }

  await collection.updateOne({ key: SITE_STATE_KEY }, { $set: document }, { upsert: true })
  return siteState
}

export async function persistSiteConfig(nextConfig: SiteConfig): Promise<SiteConfig> {
  const now = new Date().toISOString()
  await persistSiteState({
    ...siteState,
    draft: normalizeSiteConfig(nextConfig),
    updatedAt: now,
  })
  return siteState.draft
}

export async function publishDraftSiteConfig(): Promise<SiteConfig> {
  const now = new Date().toISOString()
  await persistSiteState({
    ...siteState,
    published: cloneConfig(siteState.draft),
    publishedAt: now,
  })
  return siteState.published
}

export async function resetDraftSiteConfig(): Promise<SiteConfig> {
  const now = new Date().toISOString()
  await persistSiteState({
    ...siteState,
    draft: cloneConfig(siteState.published),
    updatedAt: now,
  })
  return siteState.draft
}

export async function resetAllSiteConfig(): Promise<SiteConfig> {
  await persistSiteState(createDefaultSiteState())
  return siteState.draft
}

async function getSiteStateCollection() {
  const db = await getDb()
  return db.collection<SiteStateDocument>(SITE_STATE_COLLECTION)
}

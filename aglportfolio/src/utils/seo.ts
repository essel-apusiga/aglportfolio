type SeoOptions = {
  title: string
  description: string
  keywords?: string
  canonicalPath?: string
  robots?: string
  ogImage?: string
}

function upsertMeta(name: string, content: string) {
  let meta = document.head.querySelector<HTMLMetaElement>(`meta[name="${name}"]`)
  if (!meta) {
    meta = document.createElement('meta')
    meta.setAttribute('name', name)
    document.head.appendChild(meta)
  }
  meta.setAttribute('content', content)
}

function upsertPropertyMeta(property: string, content: string) {
  let meta = document.head.querySelector<HTMLMetaElement>(`meta[property="${property}"]`)
  if (!meta) {
    meta = document.createElement('meta')
    meta.setAttribute('property', property)
    document.head.appendChild(meta)
  }
  meta.setAttribute('content', content)
}

function upsertCanonical(path?: string) {
  const origin = window.location.origin
  const canonicalHref = path ? new URL(path, `${origin}/`).toString() : window.location.href

  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!link) {
    link = document.createElement('link')
    link.setAttribute('rel', 'canonical')
    document.head.appendChild(link)
  }

  link.setAttribute('href', canonicalHref)
}

export function setSeoMeta({ title, description, keywords, canonicalPath, robots, ogImage }: SeoOptions) {
  document.title = title
  upsertMeta('description', description)
  if (keywords) {
    upsertMeta('keywords', keywords)
  }

  if (robots) {
    upsertMeta('robots', robots)
  } else {
    upsertMeta('robots', 'index,follow,max-image-preview:large')
  }

  upsertPropertyMeta('og:title', title)
  upsertPropertyMeta('og:description', description)
  upsertPropertyMeta('og:type', 'website')
  upsertPropertyMeta('og:url', window.location.href)
  if (ogImage) {
    upsertPropertyMeta('og:image', ogImage)
    upsertMeta('twitter:image', ogImage)
  }

  upsertMeta('twitter:card', 'summary_large_image')
  upsertMeta('twitter:title', title)
  upsertMeta('twitter:description', description)

  upsertCanonical(canonicalPath)
}

export function setJsonLd(scriptId: string, data: Record<string, unknown> | Array<Record<string, unknown>>) {
  const existing = document.getElementById(scriptId)
  if (existing) {
    existing.remove()
  }

  const script = document.createElement('script')
  script.id = scriptId
  script.type = 'application/ld+json'
  script.text = JSON.stringify(data)
  document.head.appendChild(script)
}

function extractIframeSrc(raw: string): string {
  const match = raw.match(/src=["']([^"']+)["']/i)
  if (!match?.[1]) {
    return raw
  }

  return match[1].replace(/&amp;/g, '&')
}

function inferGoogleQueryFromPath(pathname: string): string {
  const cleaned = pathname.replace(/^\/maps\//, '')
  const segments = cleaned.split('/').filter(Boolean)
  const placeIndex = segments.findIndex((segment) => segment === 'place' || segment === 'search')
  if (placeIndex >= 0 && segments[placeIndex + 1]) {
    return decodeURIComponent(segments[placeIndex + 1]).replace(/\+/g, ' ')
  }

  return ''
}

export function normalizeMapEmbedUrl(rawValue: string): string {
  const trimmed = rawValue.trim()
  if (!trimmed) {
    return ''
  }

  const candidate = extractIframeSrc(trimmed)
  let parsed: URL

  try {
    parsed = new URL(candidate)
  } catch {
    return candidate
  }

  const host = parsed.hostname.toLowerCase()
  const isGoogleHost = host.includes('google.') || host === 'maps.app.goo.gl'
  if (!isGoogleHost) {
    return parsed.toString()
  }

  if (parsed.pathname.startsWith('/maps/embed')) {
    return parsed.toString()
  }

  const query =
    parsed.searchParams.get('q') ||
    parsed.searchParams.get('query') ||
    parsed.searchParams.get('destination') ||
    inferGoogleQueryFromPath(parsed.pathname)

  if (!query) {
    return parsed.toString()
  }

  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`
}
import { getDb } from './db'

const CTA_COLLECTION = 'cta_clicks'

export type CtaButton = 'explore' | 'watch-demo' | 'get-started' | string

export type CtaClickRecord = {
  button: CtaButton
  source: string
  userAgent?: string
  clickedAt: string
}

export type CtaStat = {
  button: CtaButton
  count: number
  lastClickedAt: string | null
}

function isValidCtaPayload(value: unknown): value is { button: string; source?: string } {
  if (!value || typeof value !== 'object') return false
  const candidate = value as Record<string, unknown>
  return typeof candidate.button === 'string' && candidate.button.trim().length > 0
}

export { isValidCtaPayload }

export async function recordCtaClick(
  button: CtaButton,
  source: string,
  userAgent?: string,
): Promise<CtaClickRecord> {
  const db = await getDb()
  const record: CtaClickRecord = {
    button: button.trim().toLowerCase(),
    source: source.trim() || 'home',
    userAgent,
    clickedAt: new Date().toISOString(),
  }
  await db.collection<CtaClickRecord>(CTA_COLLECTION).insertOne({ ...record })
  return record
}

export async function getCtaStats(): Promise<CtaStat[]> {
  const db = await getDb()
  const pipeline = [
    {
      $group: {
        _id: '$button',
        count: { $sum: 1 },
        lastClickedAt: { $max: '$clickedAt' },
      },
    },
    { $sort: { count: -1 } },
  ]

  const results = await db
    .collection<CtaClickRecord>(CTA_COLLECTION)
    .aggregate<{ _id: string; count: number; lastClickedAt: string }>(pipeline)
    .toArray()

  return results.map((r: { _id: string; count: number; lastClickedAt: string }) => ({
    button: r._id,
    count: r.count,
    lastClickedAt: r.lastClickedAt ?? null,
  }))
}

export async function getCtaClickHistory(
  button?: CtaButton,
  limit = 50,
): Promise<CtaClickRecord[]> {
  const db = await getDb()
  const filter = button ? { button: button.trim().toLowerCase() } : {}
  return db
    .collection<CtaClickRecord>(CTA_COLLECTION)
    .find(filter)
    .sort({ clickedAt: -1 })
    .limit(Math.min(limit, 200))
    .project<CtaClickRecord>({ _id: 0, button: 1, source: 1, clickedAt: 1 })
    .toArray()
}

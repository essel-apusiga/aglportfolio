import { getDb } from './db'
import type { ObjectId } from 'mongodb'

export type ReviewInput = {
  rating: number
  reviewerName?: string
  staffName?: string
  comment?: string
}

export type StoredReview = {
  _id?: ObjectId
  rating: number
  reviewerName: string | null
  staffName: string | null
  comment: string | null
  submittedAt: Date
}

type RatingCount = { _id: number; count: number }
type AggFacet = {
  avg: Array<{ avg: number }>
  counts: RatingCount[]
}

export function validateReview(payload: unknown): payload is ReviewInput {
  if (!payload || typeof payload !== 'object') return false
  const c = payload as Partial<ReviewInput>
  if (
    typeof c.rating !== 'number' ||
    !Number.isInteger(c.rating) ||
    c.rating < 1 ||
    c.rating > 5
  ) {
    return false
  }
  if (
    c.reviewerName !== undefined &&
    (typeof c.reviewerName !== 'string' || c.reviewerName.trim().length > 120)
  ) {
    return false
  }
  if (
    c.staffName !== undefined &&
    (typeof c.staffName !== 'string' || c.staffName.trim().length > 120)
  ) {
    return false
  }
  if (
    c.comment !== undefined &&
    (typeof c.comment !== 'string' || c.comment.trim().length > 2000)
  ) {
    return false
  }
  return true
}

export async function saveReview(payload: ReviewInput): Promise<StoredReview> {
  const db = await getDb()
  const doc: Omit<StoredReview, '_id'> = {
    rating: payload.rating,
    reviewerName: payload.reviewerName?.trim() || null,
    staffName: payload.staffName?.trim() || null,
    comment: payload.comment?.trim() || null,
    submittedAt: new Date(),
  }
  const result = await db.collection<StoredReview>('customerReviews').insertOne(doc)
  return { ...doc, _id: result.insertedId }
}

export async function listReviews(limit = 20, skip = 0) {
  const db = await getDb()
  const col = db.collection<StoredReview>('customerReviews')

  const [reviews, total, agg] = await Promise.all([
    col.find({}).sort({ submittedAt: -1 }).skip(skip).limit(limit).toArray(),
    col.countDocuments(),
    col
      .aggregate<AggFacet>([
        {
          $facet: {
            avg: [{ $group: { _id: null, avg: { $avg: '$rating' } } }],
            counts: [
              { $group: { _id: '$rating', count: { $sum: 1 } } },
              { $sort: { _id: -1 } },
            ],
          },
        },
      ])
      .next(),
  ])

  return {
    reviews,
    total,
    averageRating: agg?.avg[0]?.avg ?? null,
    ratingCounts: agg?.counts ?? [],
  }
}

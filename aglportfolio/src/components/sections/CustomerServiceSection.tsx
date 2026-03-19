import { useEffect, useMemo, useState } from 'react'
import { fetchPublicUsers, fetchReviews, submitReview } from '../../utils/api'
import type { PublicUser, ReviewInput, StoredReview } from '../../utils/api'

// ── Star Rating Widget ────────────────────────────────────────────────────────

type StarRatingProps = {
  value: number
  onChange?: (rating: number) => void
  readonly?: boolean
  size?: 'sm' | 'md' | 'lg'
}

function StarRating({ value, onChange, readonly = false, size = 'md' }: StarRatingProps) {
  const [hovered, setHovered] = useState(0)
  const sizeClass = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-8 h-8' : 'w-6 h-6'
  const display = readonly ? value : (hovered || value)

  return (
    <div
      className="flex gap-0.5"
      role={readonly ? 'img' : 'radiogroup'}
      aria-label={`Rating: ${value} out of 5`}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => !readonly && setHovered(0)}
          aria-label={`${star} star${star !== 1 ? 's' : ''}`}
          className={`transition-transform ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'}`}
        >
          <svg
            className={`${sizeClass} transition-colors duration-150 ${
              star <= display
                ? 'fill-amber-400 text-amber-400'
                : 'fill-emerald-100 text-emerald-200'
            }`}
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      ))}
    </div>
  )
}

// ── Review Card ───────────────────────────────────────────────────────────────

function ReviewCard({ review }: { review: StoredReview }) {
  const date = new Date(review.submittedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  return (
    <article className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-1">
          <StarRating value={review.rating} readonly size="sm" />
          {review.staffName && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {review.staffName}
            </span>
          )}
        </div>
        <time className="shrink-0 text-xs text-emerald-500">{date}</time>
      </div>

      {review.comment && (
        <p className="mt-3 text-sm leading-relaxed text-emerald-800">"{review.comment}"</p>
      )}

      {review.reviewerName && (
        <p className="mt-3 text-xs font-medium text-emerald-600">— {review.reviewerName}</p>
      )}
    </article>
  )
}

// ── Rating Distribution Bar ───────────────────────────────────────────────────

function RatingBar({ star, count, total }: { star: number; count: number; total: number }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-4 text-right font-medium text-emerald-900">{star}</span>
      <svg className="h-3 w-3 fill-amber-400 shrink-0" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-emerald-100">
        <div
          className="h-full rounded-full bg-amber-400 transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-8 text-emerald-600">{pct}%</span>
    </div>
  )
}

// ── Submit Form ───────────────────────────────────────────────────────────────

const LABELS: Record<number, string> = {
  1: 'Poor',
  2: 'Fair',
  3: 'Good',
  4: 'Very Good',
  5: 'Excellent',
}

type FormState = {
  rating: number
  reviewerName: string
  staffName: string
  comment: string
}

type FormFeedback = { type: 'success' | 'error'; text: string }

type SubmitFormProps = {
  onSubmitted: (review: StoredReview) => void
  teamMembers: PublicUser[]
  teamMembersLoading: boolean
}

function SubmitForm({ onSubmitted, teamMembers, teamMembersLoading }: SubmitFormProps) {
  const [form, setForm] = useState<FormState>({
    rating: 0,
    reviewerName: '',
    staffName: '',
    comment: '',
  })
  const [ratingTouched, setRatingTouched] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<FormFeedback | null>(null)
  const [isStaffDropdownOpen, setIsStaffDropdownOpen] = useState(false)

  const canSubmit = form.rating >= 1 && !isSubmitting

  function set<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const filteredTeamMembers = useMemo(() => {
    const normalized = form.staffName.trim().toLowerCase()
    if (!normalized) {
      return teamMembers.slice(0, 8)
    }

    return teamMembers
      .filter((member) => member.username.toLowerCase().includes(normalized))
      .slice(0, 8)
  }, [form.staffName, teamMembers])

  const selectedTeamMember = useMemo(() => {
    const normalized = form.staffName.trim().toLowerCase()
    if (!normalized) {
      return null
    }

    return teamMembers.find((member) => member.username.toLowerCase() === normalized) ?? null
  }, [form.staffName, teamMembers])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setRatingTouched(true)
    setFeedback(null)

    if (form.rating < 1) {
      return
    }

    setIsSubmitting(true)

    const payload: ReviewInput = {
      rating: form.rating,
      ...(form.reviewerName.trim() ? { reviewerName: form.reviewerName.trim() } : {}),
      ...(form.staffName.trim() ? { staffName: form.staffName.trim() } : {}),
      ...(form.comment.trim() ? { comment: form.comment.trim() } : {}),
    }

    try {
      const result = await submitReview(payload)
      onSubmitted(result.review)
      setFeedback({ type: 'success', text: 'Thank you! Your review has been submitted.' })
      setForm({ rating: 0, reviewerName: '', staffName: '', comment: '' })
      setRatingTouched(false)
    } catch (error) {
      setFeedback({
        type: 'error',
        text: error instanceof Error ? error.message : 'Could not submit review. Please try again.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputClass =
    'w-full rounded-xl border border-emerald-200 bg-white px-4 py-2.5 text-sm text-emerald-950 outline-none transition placeholder:text-emerald-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200'

  return (
    <form
      id="review-submit-form"
      onSubmit={handleSubmit}
      className="scroll-mt-24 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-6 shadow-sm"
    >
      <h3 className="text-xl font-black text-emerald-950">Share Your Experience</h3>
      <p className="mt-1 text-sm text-emerald-700">
        How did we do? Your feedback helps us improve.
      </p>

      {/* Star rating */}
      <div className="mt-5">
        <label className="mb-2 block text-sm font-semibold text-emerald-900">
          Overall Rating <span className="text-rose-500">*</span>
        </label>
        <div className="flex items-center gap-3">
          <StarRating
            value={form.rating}
            onChange={(r) => {
              set('rating', r)
              setRatingTouched(true)
            }}
            size="lg"
          />
          {form.rating > 0 && (
            <span className="rounded-full bg-amber-100 px-3 py-0.5 text-sm font-semibold text-amber-700">
              {LABELS[form.rating]}
            </span>
          )}
        </div>
        {ratingTouched && form.rating === 0 && (
          <p className="mt-1 text-xs text-rose-600" aria-live="polite">
            Please select a rating.
          </p>
        )}
      </div>

      {/* Staff name */}
      <div className="mt-4">
        <label className="mb-1 block text-sm font-semibold text-emerald-900">
          Team Member Name{' '}
          <span className="font-normal text-emerald-500">(optional)</span>
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder={teamMembersLoading ? 'Loading team members...' : 'Search staff name...'}
            value={form.staffName}
            onChange={(e) => {
              set('staffName', e.target.value)
              setIsStaffDropdownOpen(true)
            }}
            onFocus={() => setIsStaffDropdownOpen(true)}
            onBlur={() => {
              setTimeout(() => setIsStaffDropdownOpen(false), 120)
            }}
            maxLength={120}
            className={`${inputClass} pr-12`}
            aria-label="Search and select team member"
            autoComplete="off"
          />

          {form.staffName.trim().length > 0 && (
            <button
              type="button"
              aria-label="Clear team member"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => {
                set('staffName', '')
                setIsStaffDropdownOpen(false)
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-emerald-200 bg-white px-2 py-0.5 text-xs font-bold uppercase text-emerald-700 transition hover:bg-emerald-50"
            >
              x
            </button>
          )}

          {!teamMembersLoading && isStaffDropdownOpen && filteredTeamMembers.length > 0 && (
            <div className="absolute z-20 mt-1 max-h-52 w-full overflow-y-auto rounded-xl border border-emerald-200 bg-white p-1 shadow-lg">
              {filteredTeamMembers.map((member) => (
                <button
                  key={member.id}
                  type="button"
                  onClick={() => {
                    set('staffName', member.username)
                    setIsStaffDropdownOpen(false)
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm text-emerald-900 transition hover:bg-emerald-50 ${
                    selectedTeamMember?.id === member.id ? 'bg-emerald-50' : ''
                  }`}
                >
                  <span>{member.username}</span>
                  {member.role && <span className="text-xs text-emerald-600">{member.role.replace(/_/g, ' ')}</span>}
                </button>
              ))}
            </div>
          )}
        </div>
        <p className="mt-1 text-xs text-emerald-500">
          Tag a specific team member to recognise great or improve poor service. {teamMembersLoading ? 'Syncing staff list...' : `${teamMembers.length} members available.`} {selectedTeamMember ? `Selected: ${selectedTeamMember.username}.` : ''}
        </p>
      </div>

      {/* Comment */}
      <div className="mt-4">
        <label className="mb-1 block text-sm font-semibold text-emerald-900">
          Comment{' '}
          <span className="font-normal text-emerald-500">(optional)</span>
        </label>
        <textarea
          rows={4}
          placeholder="Tell us about your experience..."
          value={form.comment}
          onChange={(e) => set('comment', e.target.value)}
          maxLength={2000}
          className={`${inputClass} resize-none`}
        />
        <p className="text-right text-xs text-emerald-500">{form.comment.length}/2000</p>
      </div>

      {/* Reviewer name */}
      <div className="mt-4">
        <label className="mb-1 block text-sm font-semibold text-emerald-900">
          Your Name{' '}
          <span className="font-normal text-emerald-500">(optional)</span>
        </label>
        <input
          type="text"
          placeholder="Anonymous"
          value={form.reviewerName}
          onChange={(e) => set('reviewerName', e.target.value)}
          maxLength={120}
          className={inputClass}
        />
      </div>

      {/* Feedback */}
      {feedback && (
        <div
          role="status"
          aria-live="polite"
          className={`mt-4 rounded-xl px-4 py-3 text-sm font-medium ${
            feedback.type === 'success'
              ? 'bg-emerald-100 text-emerald-800'
              : 'bg-rose-50 text-rose-700'
          }`}
        >
          {feedback.text}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={!canSubmit}
        className="mt-5 w-full rounded-xl bg-emerald-700 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? 'Submitting…' : 'Submit Review'}
      </button>
    </form>
  )
}

// ── Main Section ──────────────────────────────────────────────────────────────

export function CustomerServiceSection() {
  const [reviews, setReviews] = useState<StoredReview[]>([])
  const [total, setTotal] = useState(0)
  const [averageRating, setAverageRating] = useState<number | null>(null)
  const [ratingCounts, setRatingCounts] = useState<Array<{ _id: number; count: number }>>([])
  const [loading, setLoading] = useState(true)
  const [teamMembers, setTeamMembers] = useState<PublicUser[]>([])
  const [teamMembersLoading, setTeamMembersLoading] = useState(true)
  const [page, setPage] = useState(0)
  const pageSize = 6

  async function loadReviews(skip: number) {
    setLoading(true)
    try {
      const data = await fetchReviews(pageSize, skip)
      setReviews(data.reviews)
      setTotal(data.total)
      setAverageRating(data.averageRating)
      setRatingCounts(data.ratingCounts)
    } catch {
      // silently degrade
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadReviews(page * pageSize)
  }, [page])

  useEffect(() => {
    async function loadTeamMembers() {
      setTeamMembersLoading(true)
      try {
        const users = await fetchPublicUsers()
        setTeamMembers(users)
      } catch {
        setTeamMembers([])
      } finally {
        setTeamMembersLoading(false)
      }
    }

    void loadTeamMembers()
  }, [])

  function handleNewReview(review: StoredReview) {
    setReviews((prev) => [review, ...prev.slice(0, pageSize - 1)])
    setTotal((prev) => prev + 1)
    if (averageRating === null) {
      setAverageRating(review.rating)
    } else {
      const newAvg = ((averageRating * (total)) + review.rating) / (total + 1)
      setAverageRating(newAvg)
    }
  }

  const totalPages = Math.ceil(total / pageSize)

  // Build full 1-5 rating counts mapping from server data
  const countMap: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  ratingCounts.forEach(({ _id, count }) => {
    countMap[_id] = count
  })

  return (
    <section
      id="reviews"
      className="w-full bg-gradient-to-b from-emerald-50 to-white px-6 py-16 md:px-12"
      data-purpose="customer-service-section"
    >
      {/* Heading */}
      <div className="mb-10">
        <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">Customer Service</p>
        <h2 className="mt-1 text-3xl font-black text-emerald-950 md:text-4xl">
          What People Are Saying
        </h2>
        <p className="mt-2 max-w-xl text-sm text-emerald-700">
          We value every piece of feedback. Share your honest experience — it helps us serve
          everyone better.
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
        {/* Left: Stats + Review list */}
        <div className="space-y-8">
          {/* Summary card */}
          {total > 0 && (
            <div className="flex flex-wrap items-center gap-6 rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm">
              <div className="text-center">
                <div className="text-5xl font-black text-emerald-950">
                  {averageRating !== null ? averageRating.toFixed(1) : '—'}
                </div>
                <StarRating value={Math.round(averageRating ?? 0)} readonly size="sm" />
                <div className="mt-1 text-xs text-emerald-600">
                  {total} review{total !== 1 ? 's' : ''}
                </div>
              </div>
              <div className="flex-1 min-w-[160px] space-y-1.5">
                {[5, 4, 3, 2, 1].map((star) => (
                  <RatingBar key={star} star={star} count={countMap[star]} total={total} />
                ))}
              </div>
            </div>
          )}

          {/* Review list */}
          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-28 animate-pulse rounded-2xl bg-emerald-100"
                />
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-emerald-200 py-16 text-center text-sm text-emerald-500">
              No reviews yet. Be the first to share your experience!
            </div>
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                {reviews.map((r) => (
                  <ReviewCard key={String(r._id)} review={r} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    disabled={page === 0}
                    onClick={() => setPage((p) => p - 1)}
                    className="rounded-lg border border-emerald-200 px-4 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    ← Newer
                  </button>
                  <span className="text-xs text-emerald-600">
                    Page {page + 1} of {totalPages}
                  </span>
                  <button
                    type="button"
                    disabled={page >= totalPages - 1}
                    onClick={() => setPage((p) => p + 1)}
                    className="rounded-lg border border-emerald-200 px-4 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Older →
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Right: Submit form (sticky on desktop) */}
        <div className="lg:sticky lg:top-6 lg:self-start">
          <SubmitForm
            onSubmitted={handleNewReview}
            teamMembers={teamMembers}
            teamMembersLoading={teamMembersLoading}
          />
        </div>
      </div>
    </section>
  )
}

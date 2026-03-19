import { useState } from 'react'
import { Button } from '../../sharedcomponents'
import { sendContactMessage } from '../../utils/api'
import type { LocationSectionContent } from '../website/types'

type LocationContactSectionProps = {
  content: LocationSectionContent
}

export function LocationContactSection({ content }: LocationContactSectionProps) {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [touched, setTouched] = useState({ name: false, email: false, message: false })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const trimmedName = form.name.trim()
  const trimmedEmail = form.email.trim()
  const trimmedMessage = form.message.trim()
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  const errors = {
    name:
      trimmedName.length === 0
        ? 'Name is required.'
        : trimmedName.length < 2
          ? 'Name must be at least 2 characters.'
          : '',
    email:
      trimmedEmail.length === 0
        ? 'Email is required.'
        : !emailPattern.test(trimmedEmail)
          ? 'Enter a valid email address.'
          : '',
    message:
      trimmedMessage.length === 0
        ? 'Message is required.'
        : trimmedMessage.length < 10
          ? 'Message must be at least 10 characters.'
          : '',
  }

  const isFormValid = !errors.name && !errors.email && !errors.message
  const canSubmit = isFormValid && !isSubmitting

  function markTouched(field: 'name' | 'email' | 'message') {
    setTouched((current) => ({ ...current, [field]: true }))
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFeedback(null)

    if (!isFormValid) {
      setTouched({ name: true, email: true, message: true })
      setFeedback({ type: 'error', text: 'Please fix the highlighted fields before submitting.' })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await sendContactMessage({
        name: trimmedName,
        email: trimmedEmail,
        message: trimmedMessage,
      })
      setFeedback({ type: 'success', text: response.message })
      setForm({ name: '', email: '', message: '' })
      setTouched({ name: false, email: false, message: false })
    } catch (error) {
      setFeedback({
        type: 'error',
        text: error instanceof Error ? error.message : 'Unable to send your message right now.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="grid w-full gap-8 px-6 py-16 md:grid-cols-2 md:px-12" id={content.id} data-purpose="location-section">
      <div className="space-y-5">
        <h2 className="text-3xl font-black text-emerald-950 md:text-4xl">{content.title}</h2>
        <p className="text-base text-emerald-800">{content.description}</p>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-emerald-700">{content.contactDetails.addressLabel}</h3>
            {content.contactDetails.addressLines.map((line) => (
              <p key={line} className="text-sm text-emerald-900">{line}</p>
            ))}
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-emerald-700">{content.contactDetails.contactLabel}</h3>
            <p className="text-sm text-emerald-900">{content.contactDetails.email}</p>
            <p className="text-sm text-emerald-900">{content.contactDetails.phone}</p>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-emerald-200">
          <iframe title="Company location" src={content.mapEmbedUrl} loading="lazy" className="h-72 w-full border-0" />
        </div>
      </div>

      <div className="rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm" data-purpose="contact-form-container">
        <h3 className="text-2xl font-black text-emerald-950">{content.form.title}</h3>
        <p className="mt-2 text-sm text-emerald-800">{content.form.description}</p>
        <form className="mt-5 grid gap-4" onSubmit={handleSubmit}>
          <label className="grid gap-1 text-sm font-medium text-emerald-900">
            Full Name
            <input
              type="text"
              placeholder="John Doe"
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              onBlur={() => markTouched('name')}
              className={`rounded-lg border px-3 py-2 text-sm outline-none transition focus:ring-2 ${
                touched.name && errors.name
                  ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200'
                  : 'border-emerald-200 focus:border-emerald-500 focus:ring-emerald-200'
              }`}
              required
              minLength={2}
              aria-invalid={touched.name && Boolean(errors.name)}
              aria-describedby="contact-name-error"
            />
            <span id="contact-name-error" className="min-h-5 text-xs text-rose-700" aria-live="polite">
              {touched.name && errors.name ? errors.name : ' '}
            </span>
          </label>
          <label className="grid gap-1 text-sm font-medium text-emerald-900">
            Email Address
            <input
              type="email"
              placeholder="john@example.com"
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              onBlur={() => markTouched('email')}
              className={`rounded-lg border px-3 py-2 text-sm outline-none transition focus:ring-2 ${
                touched.email && errors.email
                  ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200'
                  : 'border-emerald-200 focus:border-emerald-500 focus:ring-emerald-200'
              }`}
              required
              aria-invalid={touched.email && Boolean(errors.email)}
              aria-describedby="contact-email-error"
            />
            <span id="contact-email-error" className="min-h-5 text-xs text-rose-700" aria-live="polite">
              {touched.email && errors.email ? errors.email : ' '}
            </span>
          </label>
          <label className="grid gap-1 text-sm font-medium text-emerald-900">
            Message
            <textarea
              rows={5}
              placeholder="How can we help you?"
              value={form.message}
              onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
              onBlur={() => markTouched('message')}
              className={`rounded-lg border px-3 py-2 text-sm outline-none transition focus:ring-2 ${
                touched.message && errors.message
                  ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200'
                  : 'border-emerald-200 focus:border-emerald-500 focus:ring-emerald-200'
              }`}
              required
              minLength={10}
              aria-invalid={touched.message && Boolean(errors.message)}
              aria-describedby="contact-message-error contact-message-helper"
            />
            <div className="flex min-h-5 items-center justify-between gap-2 text-xs" id="contact-message-helper">
              <span id="contact-message-error" className="text-rose-700" aria-live="polite">
                {touched.message && errors.message ? errors.message : ' '}
              </span>
              <span className="text-emerald-700">{form.message.length}/5000</span>
            </div>
          </label>
          {feedback && (
            <p
              className={feedback.type === 'success' ? 'rounded-lg bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700' : 'rounded-lg bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700'}
              role="status"
              aria-live="polite"
            >
              {feedback.text}
            </p>
          )}
          <Button disabled={!canSubmit}>{isSubmitting ? 'Sending...' : content.form.submitLabel}</Button>
        </form>
      </div>
    </section>
  )
}

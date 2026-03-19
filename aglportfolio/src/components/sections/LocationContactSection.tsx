import { useState } from 'react'
import { Button } from '../../sharedcomponents'
import { sendContactMessage } from '../../utils/api'
import type { LocationSectionContent } from '../website/types'

type LocationContactSectionProps = {
  content: LocationSectionContent
}

export function LocationContactSection({ content }: LocationContactSectionProps) {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFeedback(null)

    if (form.name.trim().length < 2 || form.message.trim().length < 10) {
      setFeedback({ type: 'error', text: 'Please provide your name and a more detailed message.' })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await sendContactMessage({
        name: form.name.trim(),
        email: form.email.trim(),
        message: form.message.trim(),
      })
      setFeedback({ type: 'success', text: response.message })
      setForm({ name: '', email: '', message: '' })
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
              className="rounded-lg border border-emerald-200 px-3 py-2 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
              required
              minLength={2}
            />
          </label>
          <label className="grid gap-1 text-sm font-medium text-emerald-900">
            Email Address
            <input
              type="email"
              placeholder="john@example.com"
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              className="rounded-lg border border-emerald-200 px-3 py-2 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
              required
            />
          </label>
          <label className="grid gap-1 text-sm font-medium text-emerald-900">
            Message
            <textarea
              rows={5}
              placeholder="How can we help you?"
              value={form.message}
              onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
              className="rounded-lg border border-emerald-200 px-3 py-2 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
              required
              minLength={10}
            />
          </label>
          {feedback && (
            <p className={feedback.type === 'success' ? 'text-sm font-medium text-emerald-700' : 'text-sm font-medium text-rose-700'}>
              {feedback.text}
            </p>
          )}
          <Button disabled={isSubmitting}>{isSubmitting ? 'Sending...' : content.form.submitLabel}</Button>
        </form>
      </div>
    </section>
  )
}

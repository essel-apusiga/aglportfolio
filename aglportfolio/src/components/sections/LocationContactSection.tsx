import { Button } from '../../sharedcomponents'
import type { LocationSectionContent } from '../website/types'

type LocationContactSectionProps = {
  content: LocationSectionContent
}

export function LocationContactSection({ content }: LocationContactSectionProps) {
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
        <form className="mt-5 grid gap-4">
          <label className="grid gap-1 text-sm font-medium text-emerald-900">
            Full Name
            <input type="text" placeholder="John Doe" className="rounded-lg border border-emerald-200 px-3 py-2 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200" />
          </label>
          <label className="grid gap-1 text-sm font-medium text-emerald-900">
            Email Address
            <input type="email" placeholder="john@example.com" className="rounded-lg border border-emerald-200 px-3 py-2 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200" />
          </label>
          <label className="grid gap-1 text-sm font-medium text-emerald-900">
            Message
            <textarea rows={5} placeholder="How can we help you?" className="rounded-lg border border-emerald-200 px-3 py-2 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200" />
          </label>
          <Button>{content.form.submitLabel}</Button>
        </form>
      </div>
    </section>
  )
}

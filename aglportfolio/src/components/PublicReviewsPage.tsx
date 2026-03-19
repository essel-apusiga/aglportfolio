import { CustomerServiceSection } from './sections'
import { WhatsAppFloatButton } from './WhatsAppFloatButton'

export function PublicReviewsPage() {
  return (
    <main className="min-h-screen bg-white text-emerald-950">
      <section className="w-full bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.18),_transparent_40%),linear-gradient(180deg,_#ecfdf5_0%,_#ffffff_62%)] px-6 py-16 md:px-12">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-5 text-center">
          <div className="flex justify-center">
            <div className="flex flex-wrap items-center justify-center gap-2">
              <a
                href="/"
                className="inline-flex items-center rounded-full border border-emerald-200 bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-emerald-700 backdrop-blur transition hover:border-emerald-300 hover:bg-white"
              >
                Back to Main Site
              </a>
              <a
                href="/where-to-buy"
                className="inline-flex items-center rounded-full border border-emerald-200 bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-emerald-700 backdrop-blur transition hover:border-emerald-300 hover:bg-white"
              >
                Where To Buy
              </a>
            </div>
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-emerald-600">Customer Feedback</p>
          <h1 className="text-4xl font-black tracking-tight text-emerald-950 md:text-6xl">
            Rate Our Service
          </h1>
          <p className="mx-auto max-w-2xl text-sm leading-6 text-emerald-700 md:text-base">
            Scan, rate, and share your experience in less than a minute. Your feedback helps us recognize excellent staff performance and fix weak service quickly.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs font-semibold text-emerald-700">
            <span className="rounded-full bg-white px-4 py-2 shadow-sm shadow-emerald-900/5">1-5 star rating</span>
            <span className="rounded-full bg-white px-4 py-2 shadow-sm shadow-emerald-900/5">Optional staff tagging</span>
            <span className="rounded-full bg-white px-4 py-2 shadow-sm shadow-emerald-900/5">Takes under 1 minute</span>
          </div>
          <div className="pt-2">
            <a
              href="#review-submit-form"
              aria-label="Jump to review form"
              className="group inline-flex flex-col items-center gap-1 rounded-full border border-emerald-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-50"
            >
              <span>Jump to Form</span>
              <span className="text-base leading-none transition-transform group-hover:translate-y-0.5">↓</span>
            </a>
          </div>
        </div>
      </section>
      <CustomerServiceSection />
      <WhatsAppFloatButton message="Hello AGL, I just left a review and need support on Apsonic products." />
    </main>
  )
}
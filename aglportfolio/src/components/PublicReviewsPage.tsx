import { CustomerServiceSection } from './sections'

export function PublicReviewsPage() {
  return (
    <main className="min-h-screen bg-white text-emerald-950">
      <section className="w-full bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.18),_transparent_40%),linear-gradient(180deg,_#ecfdf5_0%,_#ffffff_62%)] px-6 py-16 md:px-12">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-5 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-emerald-600">Customer Feedback</p>
          <h1 className="text-4xl font-black tracking-tight text-emerald-950 md:text-6xl">
            Rate Our Service
          </h1>
          <p className="mx-auto max-w-2xl text-sm leading-6 text-emerald-700 md:text-base">
            Scan, rate, and share your experience in less than a minute. Your feedback helps us recognize excellent staff performance and fix weak service quickly.
          </p>
        </div>
      </section>
      <CustomerServiceSection />
    </main>
  )
}
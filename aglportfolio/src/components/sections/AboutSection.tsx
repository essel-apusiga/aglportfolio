import type { AboutSectionContent } from '../website/types'

type AboutSectionProps = {
  content: AboutSectionContent
}

export function AboutSection({ content }: AboutSectionProps) {
  return (
    <section className="mx-auto w-full max-w-7xl space-y-5 px-4 py-16 md:px-8" id={content.id}>
      <h2 className="text-3xl font-black text-emerald-950 md:text-4xl">{content.title}</h2>
      <p className="max-w-3xl text-base text-emerald-800 md:text-lg">{content.description}</p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {content.stats.map((stat) => (
          <article key={stat.id} className="rounded-xl border border-emerald-200 bg-white p-5 shadow-sm">
            <strong className="block text-3xl font-black text-emerald-700">{stat.value}</strong>
            <span className="text-sm font-medium text-emerald-900">{stat.label}</span>
          </article>
        ))}
      </div>
    </section>
  )
}

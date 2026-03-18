import type { AboutSectionContent } from '../website/types'

type AboutSectionProps = {
  content: AboutSectionContent
}

export function AboutSection({ content }: AboutSectionProps) {
  return (
    <section className="about-section" id={content.id}>
      <h2>{content.title}</h2>
      <p>{content.description}</p>
      <div className="about-section__stats">
        {content.stats.map((stat) => (
          <article key={stat.id}>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </article>
        ))}
      </div>
    </section>
  )
}

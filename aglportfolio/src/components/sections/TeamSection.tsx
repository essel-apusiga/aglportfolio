import type { TeamSectionContent } from '../website/types'

type TeamSectionProps = {
  content: TeamSectionContent
}

export function TeamSection({ content }: TeamSectionProps) {
  return (
    <section className="team-section" id={content.id} data-purpose="team-section">
      <div className="team-section__head">
        <h2>{content.title}</h2>
        <p>{content.description}</p>
      </div>

      <div className="team-section__grid">
        {content.members.map((member) => (
          <article key={member.id} className="team-section__card" data-purpose="team-member-card">
            <img src={member.imageSrc} alt={member.name} />
            <h3>{member.name}</h3>
            <p>{member.role}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

import type { TeamSectionContent } from '../website/types'

type TeamSectionProps = {
  content: TeamSectionContent
}

export function TeamSection({ content }: TeamSectionProps) {
  return (
    <section className="bg-emerald-50" id={content.id} data-purpose="team-section">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 md:px-8">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-black text-emerald-950 md:text-4xl">{content.title}</h2>
          <p className="mx-auto mt-2 max-w-2xl text-base text-emerald-800">{content.description}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {content.members.map((member) => (
            <article
              key={member.id}
              className="rounded-xl border border-emerald-200 bg-white p-5 text-center shadow-sm"
              data-purpose="team-member-card"
            >
              <img
                src={member.imageSrc}
                alt={member.name}
                className="mx-auto h-24 w-24 rounded-full border-4 border-emerald-100 object-cover"
              />
              <h3 className="mt-4 text-lg font-bold text-emerald-950">{member.name}</h3>
              <p className="text-sm font-medium text-emerald-700">{member.role}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

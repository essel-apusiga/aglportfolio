import type { ReactNode } from 'react'

type CampaignBannerProps = {
  title: string
  description: string
  hint?: string
  action?: ReactNode
}

export function CampaignBanner({ title, description, hint = 'Campaign', action }: CampaignBannerProps) {
  return (
    <section className="ui-campaign-banner" aria-label={title}>
      <div>
        <p className="ui-campaign-banner__hint">{hint}</p>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      {action}
    </section>
  )
}

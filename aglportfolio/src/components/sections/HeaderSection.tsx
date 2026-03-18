import { Badge, Button } from '../../sharedcomponents'
import type { HeaderContent } from '../website/types'

type HeaderSectionProps = {
  content: HeaderContent
}

export function HeaderSection({ content }: HeaderSectionProps) {
  return (
    <header className="company-header" data-purpose="site-navigation">
      <div className="company-header__brand">
        <Badge tone="success">{content.badge}</Badge>
        <strong>{content.brandName}</strong>
      </div>

      <nav className="company-header__nav" aria-label="Primary navigation">
        {content.navLinks.map((link) => (
          <a key={link.id} href={link.href}>
            {link.label}
          </a>
        ))}
      </nav>

      <Button size="sm">{content.ctaLabel}</Button>
    </header>
  )
}

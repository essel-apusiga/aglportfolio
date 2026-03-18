import type { FooterContent } from '../website/types'

type FooterSectionProps = {
  content: FooterContent
}

export function FooterSection({ content }: FooterSectionProps) {
  return (
    <footer className="company-footer" data-purpose="main-footer">
      <div className="company-footer__grid">
        <div>
          <h3>{content.brandName}</h3>
          <p>{content.description}</p>
        </div>

        {content.columns.map((column) => (
          <div key={column.id}>
            <h4>{column.title}</h4>
            <ul>
              {column.links.map((link) => (
                <li key={link}>
                  <a href="#">{link}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="company-footer__bottom">{content.copyright}</div>
    </footer>
  )
}

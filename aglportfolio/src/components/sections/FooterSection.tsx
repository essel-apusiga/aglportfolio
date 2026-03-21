import type { FooterContent } from '../website/types'

type FooterSectionProps = {
  content: FooterContent
}

export function FooterSection({ content }: FooterSectionProps) {
  return (
    <footer className="border-t border-emerald-900 bg-emerald-800" data-purpose="main-footer">
      <div className="grid w-full gap-8 px-6 py-14 md:grid-cols-4 md:px-12">
        <div>
          <h3 className="text-xl font-black text-white md:text-2xl">{content.brandName}</h3>
          <p className="mt-2 text-sm font-semibold text-emerald-50">{content.description}</p>
        </div>

        {content.columns.map((column) => (
          <div key={column.id}>
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-white">{column.title}</h4>
            <ul className="mt-3 space-y-2">
              {column.links.map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm font-semibold text-emerald-50 transition hover:text-white">{link}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-emerald-700 px-6 py-4 text-center text-xs font-semibold text-emerald-100 md:px-12">{content.copyright}</div>
    </footer>
  )
}

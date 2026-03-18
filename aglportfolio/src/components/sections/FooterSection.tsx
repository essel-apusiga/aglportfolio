import type { FooterContent } from '../website/types'

type FooterSectionProps = {
  content: FooterContent
}

export function FooterSection({ content }: FooterSectionProps) {
  return (
    <footer className="border-t border-emerald-200 bg-white" data-purpose="main-footer">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-14 md:grid-cols-4 md:px-8">
        <div>
          <h3 className="text-xl font-black text-emerald-950">{content.brandName}</h3>
          <p className="mt-2 text-sm text-emerald-800">{content.description}</p>
        </div>

        {content.columns.map((column) => (
          <div key={column.id}>
            <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-700">{column.title}</h4>
            <ul className="mt-3 space-y-2">
              {column.links.map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-emerald-900 transition hover:text-emerald-600">{link}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-emerald-100 px-4 py-4 text-center text-xs text-emerald-700 md:px-8">{content.copyright}</div>
    </footer>
  )
}

import { useState } from 'react'
import { FiMenu, FiX } from 'react-icons/fi'
import { Badge, Button } from '../../sharedcomponents'
import { trackCtaClick } from '../../utils/api'
import type { HeaderContent } from '../website/types'

type HeaderSectionProps = {
  content: HeaderContent
  activeHref?: string
}

function scrollToSection(id: string) {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

export function HeaderSection({ content, activeHref }: HeaderSectionProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  function handleGetStarted() {
    void trackCtaClick('get-started', 'header')
    scrollToSection('contact')
    setIsMenuOpen(false)
  }

  function handleLogoClick() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <header className="sticky top-0 z-50 border-b border-emerald-100 bg-white/95 backdrop-blur" data-purpose="site-navigation">
      <div className="flex w-full items-center justify-between gap-3 px-6 py-3 md:px-12">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault()
            handleLogoClick()
          }}
          className="flex items-center gap-2 transition hover:opacity-80"
          title="Go to home"
          aria-label="Home"
        >
          {content.logoImageSrc ? (
            <img src={content.logoImageSrc} alt="Site logo" className="h-14 w-auto object-contain md:h-16" />
          ) : (
            <>
              <Badge tone="success">{content.badge}</Badge>
              <strong className="text-lg font-bold text-emerald-950">{content.brandName}</strong>
            </>
          )}
        </a>

        <button
          className="inline-flex rounded-lg border border-emerald-200 p-2 text-emerald-800 md:hidden"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isMenuOpen}
          aria-controls="main-nav"
        >
          {isMenuOpen ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
        </button>

        <nav id="main-nav" className="hidden items-center gap-2 md:flex" aria-label="Primary navigation">
          {content.navLinks.map((link) => (
            <a
              key={link.id}
              href={link.href}
              className={
                activeHref === link.href
                  ? 'rounded-lg bg-emerald-700 px-3 py-2 text-sm font-semibold text-white'
                  : 'rounded-lg px-3 py-2 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-50 hover:text-emerald-900'
              }
              aria-current={activeHref === link.href ? 'page' : undefined}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <Button size="sm" className="hidden md:inline-flex" onClick={handleGetStarted}>{content.ctaLabel}</Button>
      </div>

      {isMenuOpen && (
        <div className="border-t border-emerald-100 bg-white md:hidden">
          <div className="flex w-full flex-col gap-2 px-6 py-3 md:px-12">
            {content.navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={
                  activeHref === link.href
                    ? 'rounded-lg bg-emerald-700 px-3 py-2 text-sm font-semibold text-white'
                    : 'rounded-lg px-3 py-2 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-50'
                }
                aria-current={activeHref === link.href ? 'page' : undefined}
              >
                {link.label}
              </a>
            ))}
            <Button size="sm" className="mt-1 w-full" onClick={handleGetStarted}>{content.ctaLabel}</Button>
          </div>
        </div>
      )}
    </header>
  )
}

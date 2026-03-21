import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import {
  AboutSection,
  CustomerServiceSection,
  FooterSection,
  HeaderSection,
  HeroSection,
  LocationContactSection,
  ProductsSection,
  TeamSection,
} from '../sections'
import { WhatsAppFloatButton } from '../WhatsAppFloatButton'
import type { CompanyWebsiteContent, SectionKey } from './types'

type CompanyWebsiteProps = {
  content: CompanyWebsiteContent
}

export function CompanyWebsite({ content }: CompanyWebsiteProps) {
  const [activeHref, setActiveHref] = useState<string | undefined>(content.header.navLinks[0]?.href)
  const siteBackgroundImage = content.hero.siteBackgroundImage?.trim() || ''

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    content.header.navLinks.forEach((link) => {
      const target = document.querySelector<HTMLElement>(link.href)
      if (!target) {
        return
      }

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveHref(link.href)
            }
          })
        },
        {
          rootMargin: '-35% 0px -55% 0px',
          threshold: 0.1,
        },
      )

      observer.observe(target)
      observers.push(observer)
    })

    return () => {
      observers.forEach((observer) => observer.disconnect())
    }
  }, [content.header.navLinks, content.sectionOrder])

  const sectionMap: Record<SectionKey, ReactNode> = {
    home: <HeroSection content={content.hero} />,
    about: <AboutSection content={content.about} />,
    products: <ProductsSection content={content.products} />,
    team: <TeamSection content={content.team} />,
    contact: <LocationContactSection content={content.location} />,
  }

  return (
    <main className="relative isolate min-h-screen w-full overflow-hidden bg-white text-emerald-950">
      {siteBackgroundImage && (
        <div
          className="pointer-events-none fixed inset-0 z-10 bg-cover bg-center bg-no-repeat opacity-15 mix-blend-multiply"
          style={{ backgroundImage: `url(${siteBackgroundImage})` }}
          aria-hidden="true"
        />
      )}

      <div className="relative z-20">
        <HeaderSection content={content.header} activeHref={activeHref} />
        {content.sectionOrder.map((sectionKey) => (
          <section key={sectionKey} className="w-full">{sectionMap[sectionKey]}</section>
        ))}
        <CustomerServiceSection />
        <FooterSection content={content.footer} />
      </div>

      <WhatsAppFloatButton message="Hello AGL, I need details about Apsonic tricycles in Ghana." />
    </main>
  )
}

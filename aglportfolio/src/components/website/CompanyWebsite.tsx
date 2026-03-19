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
import type { CompanyWebsiteContent, SectionKey } from './types'

type CompanyWebsiteProps = {
  content: CompanyWebsiteContent
}

export function CompanyWebsite({ content }: CompanyWebsiteProps) {
  const [activeHref, setActiveHref] = useState<string | undefined>(content.header.navLinks[0]?.href)

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
    <main className="min-h-screen w-full bg-white text-emerald-950">
      <HeaderSection content={content.header} activeHref={activeHref} />
      {content.sectionOrder.map((sectionKey) => (
        <section key={sectionKey} className="w-full">{sectionMap[sectionKey]}</section>
      ))}
      <CustomerServiceSection />
      <FooterSection content={content.footer} />
    </main>
  )
}

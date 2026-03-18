import {
  AboutSection,
  FooterSection,
  HeaderSection,
  HeroSection,
  LocationContactSection,
  ProductsSection,
  TeamSection,
} from '../sections'
import type { CompanyWebsiteContent } from './types'
import './company-website.css'

type CompanyWebsiteProps = {
  content: CompanyWebsiteContent
}

export function CompanyWebsite({ content }: CompanyWebsiteProps) {
  return (
    <main className="company-page">
      <HeaderSection content={content.header} />
      <HeroSection content={content.hero} />
      <AboutSection content={content.about} />
      <ProductsSection content={content.products} />
      <TeamSection content={content.team} />
      <LocationContactSection content={content.location} />
      <FooterSection content={content.footer} />
    </main>
  )
}

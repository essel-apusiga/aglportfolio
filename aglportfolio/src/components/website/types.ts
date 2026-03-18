export type NavLink = {
  id: string
  label: string
  href: string
}

export type HeaderContent = {
  badge: string
  brandName: string
  navLinks: NavLink[]
  ctaLabel: string
}

export type HeroContent = {
  badge: string
  title: string
  highlightedWord: string
  description: string
  primaryCta: string
  secondaryCta: string
  imageSrc: string
  imageAlt: string
}

export type Product = {
  id: string
  category: string
  name: string
  description: string
  price: string
  imageSrc: string
}

export type ProductSectionContent = {
  id: string
  title: string
  products: Product[]
}

export type AboutStat = {
  id: string
  label: string
  value: string
}

export type AboutSectionContent = {
  id: string
  title: string
  description: string
  stats: AboutStat[]
}

export type TeamMember = {
  id: string
  name: string
  role: string
  imageSrc: string
}

export type TeamSectionContent = {
  id: string
  title: string
  description: string
  members: TeamMember[]
}

export type ContactDetails = {
  addressLabel: string
  addressLines: string[]
  contactLabel: string
  email: string
  phone: string
}

export type ContactFormContent = {
  title: string
  description: string
  submitLabel: string
}

export type LocationSectionContent = {
  id: string
  title: string
  description: string
  mapEmbedUrl: string
  contactDetails: ContactDetails
  form: ContactFormContent
}

export type FooterColumn = {
  id: string
  title: string
  links: string[]
}

export type FooterContent = {
  brandName: string
  description: string
  columns: FooterColumn[]
  copyright: string
}

export type CompanyWebsiteContent = {
  header: HeaderContent
  hero: HeroContent
  products: ProductSectionContent
  about: AboutSectionContent
  team: TeamSectionContent
  location: LocationSectionContent
  footer: FooterContent
}

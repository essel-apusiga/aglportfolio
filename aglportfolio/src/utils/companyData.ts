import heroImage from '../assets/hero.png'
import uiReferenceImage from '../assets/ui/screen.png'
import type { CompanyWebsiteContent } from '../components/website/types'

export const companyWebsiteContent: CompanyWebsiteContent = {
  sectionOrder: ['home', 'about', 'products', 'team', 'contact'],
  header: {
    badge: 'Apsonic Motors Partner',
    brandName: 'GreenRide Apsonic',
    ctaLabel: 'Get Started',
    navLinks: [
      { id: 'home', label: 'Home', href: '#home' },
      { id: 'products', label: 'Products', href: '#products' },
      { id: 'team', label: 'Team', href: '#team' },
      { id: 'contact', label: 'Contact', href: '#contact' },
    ],
  },
  hero: {
    id: 'home',
    badge: 'Sustainable Mobility Platform',
    title: 'Powering a Smarter and Greener Future for Riders',
    highlightedWord: 'Greener',
    description:
      'Discover dependable Apsonic motorcycles, service expertise, and fleet-ready support designed for modern commuters and businesses.',
    primaryCta: 'Explore Our Models',
    secondaryCta: 'Watch Demo',
    imageSrc: heroImage,
    imageAlt: 'Apsonic motorcycles display',
  },
  about: {
    id: 'about',
    title: 'About GreenRide Apsonic',
    description:
      'We combine trusted Apsonic product distribution with practical service operations to help riders, delivery teams, and businesses scale with confidence.',
    stats: [
      { id: 'network', label: 'Service Locations', value: '18+' },
      { id: 'riders', label: 'Active Riders Supported', value: '12k+' },
      { id: 'uptime', label: 'Fleet Uptime', value: '96%' },
    ],
  },
  products: {
    id: 'products',
    title: 'Featured Apsonic Models',
    products: [
      {
        id: 'ap150-7',
        category: 'Commuter',
        name: 'Apsonic AP150-7',
        description:
          'Fuel-efficient and dependable for daily urban commuting with practical long-term maintenance costs.',
        imageSrc: heroImage,
      },
      {
        id: 'ap200gy',
        category: 'Dual Purpose',
        name: 'Apsonic AP200GY',
        description:
          'Built for mixed road conditions and commercial routes that demand stronger suspension and reliability.',
        imageSrc: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80',
      },
      {
        id: 'ap125-2',
        category: 'Entry Series',
        name: 'Apsonic AP125-2',
        description: 'Lightweight model suited for new riders and city fleets focused on efficient delivery cycles.',
        imageSrc: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=1200&q=80',
      },
      {
        id: 'ap250-sport',
        category: 'Performance',
        name: 'Apsonic AP250 Sport',
        description: 'Performance-oriented model with improved road grip and responsive acceleration for power riders.',
        imageSrc: uiReferenceImage,
      },
    ],
  },
  team: {
    id: 'team',
    title: 'Leadership Team',
    description:
      'Our leadership and employee team aligns product delivery, customer support, and operational excellence.',
    members: [
      {
        id: 'kwesi-armah',
        name: 'Kwesi Armah',
        role: 'Managing Director',
        imageSrc:
          'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
      },
      {
        id: 'abena-ofori',
        name: 'Abena Ofori',
        role: 'Head of Operations',
        imageSrc:
          'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
      },
      {
        id: 'daniel-boateng',
        name: 'Daniel Boateng',
        role: 'Technical Service Lead',
        imageSrc:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      },
      {
        id: 'miriam-asare',
        name: 'Miriam Asare',
        role: 'Customer Success Manager',
        imageSrc:
          'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80',
      },
    ],
  },
  location: {
    id: 'contact',
    title: 'Visit Our Location',
    description:
      'Our Accra showroom and service center supports test rides, model consultations, and post-purchase maintenance.',
    mapEmbedUrl:
      'https://www.openstreetmap.org/export/embed.html?bbox=-0.236%2C5.53%2C-0.11%2C5.63&layer=mapnik',
    contactDetails: {
      addressLabel: 'Address',
      addressLines: ['No. 12 Industrial Road, North Kaneshie', 'Accra, Ghana'],
      contactLabel: 'Contact',
      email: 'sales@greenride-apsonic.com',
      phone: '+233 20 000 1234',
    },
    form: {
      title: 'Get in Touch',
      description: 'Have an inquiry about fleet options or service plans? Send us a message.',
      submitLabel: 'Send Message',
    },
  },
  footer: {
    brandName: 'GreenRide Apsonic',
    description:
      'Delivering practical and sustainable mobility through trusted Apsonic motorcycles and responsive support.',
    columns: [
      {
        id: 'quick-links',
        title: 'Quick Links',
        links: ['About Us', 'Products', 'Leadership Team', 'Contact'],
      },
      {
        id: 'support',
        title: 'Support',
        links: ['Help Center', 'Warranty', 'Terms of Service', 'Privacy Policy'],
      },
      {
        id: 'resources',
        title: 'Resources',
        links: ['Fleet Guide', 'Maintenance Tips', 'Dealer Program', 'Campaign Updates'],
      },
    ],
    copyright: '© 2026 GreenRide Apsonic. All rights reserved.',
  },
}

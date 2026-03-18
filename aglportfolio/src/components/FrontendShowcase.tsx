import heroImage from '../assets/hero.png'
import {
  Accordion,
  Avatar,
  Badge,
  Button,
  CampaignBanner,
  Card,
  Carousel,
  RichInputField,
  SearchableDropdown,
  StatCard,
  Tooltip,
} from '../sharedcomponents'
import { carouselSlides, industryOptions, serviceSearchOptions } from '../utils/mockData'
import './frontend-showcase.css'

const accordionItems = [
  {
    id: 'tokens',
    title: 'Design token strategy',
    content: 'Central color, spacing, and typography values power all shared components for consistency.',
  },
  {
    id: 'reuse',
    title: 'Reusable component slots',
    content: 'Cards, banners, and buttons expose focused props so teams can ship pages quickly.',
  },
  {
    id: 'accessibility',
    title: 'Accessible interactions',
    content: 'Inputs, dropdowns, and accordion controls include semantic HTML and clear states.',
  },
]

export function FrontendShowcase() {
  return (
    <main className="showcase-page">
      <header className="showcase-hero ui-surface">
        <div>
          <Badge tone="success">Frontend structure upgrade</Badge>
          <h1>Reusable component system for your portfolio frontend</h1>
          <p>
            Folder structure now follows <strong>sharedcomponents</strong>, <strong>utils</strong>, and <strong>components</strong>
            with scalable UI patterns inspired by modern libraries.
          </p>
          <div className="ui-stack">
            <Button variant="primary">Primary action</Button>
            <Button variant="secondary">Secondary action</Button>
            <Button variant="outline">Outline action</Button>
            <Button variant="ghost">Ghost action</Button>
            <Button variant="danger">Danger action</Button>
          </div>
        </div>
        <div className="showcase-avatars">
          <Tooltip content="Lead Designer">
            <Avatar name="Ava Green" size="lg" />
          </Tooltip>
          <Tooltip content="Frontend Engineer">
            <Avatar name="Noah Fields" size="lg" />
          </Tooltip>
          <Tooltip content="Brand Strategist">
            <Avatar name="Liam Stone" size="lg" />
          </Tooltip>
        </div>
      </header>

      <CampaignBanner
        hint="Campaign banner"
        title="Spring refresh campaign ready"
        description="Launch promotional sections with strong CTAs and reusable style tokens."
        action={<Button variant="secondary">View campaign brief</Button>}
      />

      <section className="showcase-grid showcase-grid--3">
        <Card
          title="Image card usage"
          text="Use cards for project highlights, services, or campaign stories with optional images."
          imageSrc={heroImage}
          footer={<Button size="sm">Open case study</Button>}
        />
        <Card
          title="Text card usage"
          text="Cards also work in lightweight text-only mode for concise announcements or value points."
          footer={<Badge tone="neutral">Reusable pattern</Badge>}
        />
        <StatCard label="Components" value="11" detail="Button, inputs, cards, carousel, tooltip, and more." />
      </section>

      <section className="showcase-grid showcase-grid--2">
        <div className="ui-surface showcase-block">
          <h2>Rich input field and searchable dropdown</h2>
          <p>
            Capture searches with suggestion lists and filterable option menus for better UX.
          </p>
          <div className="showcase-form-grid">
            <RichInputField
              label="Search services"
              placeholder="Type a service"
              options={serviceSearchOptions}
            />
            <SearchableDropdown
              label="Choose an industry"
              options={industryOptions}
              placeholder="Search industries"
            />
          </div>
        </div>

        <div className="ui-surface showcase-block">
          <h2>Accordion and utility content blocks</h2>
          <p>Ideal for FAQs, implementation notes, and collapse-friendly information sections.</p>
          <Accordion items={accordionItems} defaultOpenId="tokens" />
        </div>
      </section>

      <section className="showcase-grid showcase-grid--2">
        <div className="ui-surface showcase-block">
          <h2>Animated carousel</h2>
          <p>Use rotating message slides for campaign callouts, testimonials, or highlight reels.</p>
          <Carousel slides={carouselSlides} />
        </div>

        <div className="ui-surface showcase-block">
          <h2>Additional recommended component</h2>
          <p>
            Status badges plus stat cards help users scan progress and conversion signals quickly.
          </p>
          <div className="ui-stack">
            <Badge tone="success">Stable</Badge>
            <Badge tone="neutral">In review</Badge>
            <Badge tone="warning">Needs approval</Badge>
            <Badge tone="danger">Attention needed</Badge>
          </div>
        </div>
      </section>
    </main>
  )
}

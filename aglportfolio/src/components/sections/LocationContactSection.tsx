import { Button } from '../../sharedcomponents'
import type { LocationSectionContent } from '../website/types'

type LocationContactSectionProps = {
  content: LocationSectionContent
}

export function LocationContactSection({ content }: LocationContactSectionProps) {
  return (
    <section className="location-contact" id={content.id} data-purpose="location-section">
      <div className="location-contact__info">
        <h2>{content.title}</h2>
        <p>{content.description}</p>

        <div className="location-contact__detail-list">
          <div>
            <h3>{content.contactDetails.addressLabel}</h3>
            {content.contactDetails.addressLines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
          <div>
            <h3>{content.contactDetails.contactLabel}</h3>
            <p>{content.contactDetails.email}</p>
            <p>{content.contactDetails.phone}</p>
          </div>
        </div>

        <div className="location-contact__map-wrap">
          <iframe title="Company location" src={content.mapEmbedUrl} loading="lazy" />
        </div>
      </div>

      <div className="location-contact__form-wrap" data-purpose="contact-form-container">
        <h3>{content.form.title}</h3>
        <p>{content.form.description}</p>
        <form className="location-contact__form">
          <label>
            Full Name
            <input type="text" placeholder="John Doe" />
          </label>
          <label>
            Email Address
            <input type="email" placeholder="john@example.com" />
          </label>
          <label>
            Message
            <textarea rows={5} placeholder="How can we help you?" />
          </label>
          <Button>{content.form.submitLabel}</Button>
        </form>
      </div>
    </section>
  )
}

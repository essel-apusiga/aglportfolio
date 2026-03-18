import type { ReactNode } from 'react'

type CardProps = {
  title: string
  text: string
  imageSrc?: string
  footer?: ReactNode
}

export function Card({ title, text, imageSrc, footer }: CardProps) {
  return (
    <article className="ui-card">
      {imageSrc ? <img className="ui-card__image" src={imageSrc} alt={title} /> : null}
      <div className="ui-card__body">
        <h3 className="ui-card__title">{title}</h3>
        <p className="ui-card__text">{text}</p>
        {footer}
      </div>
    </article>
  )
}

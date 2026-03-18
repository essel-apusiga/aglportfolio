import { useState } from 'react'

export type AccordionItem = {
  id: string
  title: string
  content: string
}

type AccordionProps = {
  items: AccordionItem[]
  defaultOpenId?: string
}

export function Accordion({ items, defaultOpenId }: AccordionProps) {
  const [openId, setOpenId] = useState<string | null>(defaultOpenId ?? null)

  return (
    <div className="ui-accordion">
      {items.map((item) => {
        const isOpen = openId === item.id

        return (
          <div key={item.id} className="ui-accordion-item">
            <button
              className="ui-accordion-trigger"
              onClick={() => setOpenId(isOpen ? null : item.id)}
              aria-expanded={isOpen}
            >
              <span>{item.title}</span>
              <span>{isOpen ? '-' : '+'}</span>
            </button>
            {isOpen ? <div className="ui-accordion-content">{item.content}</div> : null}
          </div>
        )
      })}
    </div>
  )
}

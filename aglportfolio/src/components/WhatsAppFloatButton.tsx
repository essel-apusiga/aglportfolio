type WhatsAppFloatButtonProps = {
  message?: string
}

export function WhatsAppFloatButton({ message = 'Hello AGL, I need details on Apsonic products in Ghana.' }: WhatsAppFloatButtonProps) {
  const href = `https://wa.me/233200001234?text=${encodeURIComponent(message)}`

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-4 left-4 z-50 inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-white shadow-lg shadow-emerald-900/30 transition hover:bg-emerald-700"
    >
      <span className="text-sm leading-none">💬</span>
      <span>Chat on WhatsApp</span>
    </a>
  )
}

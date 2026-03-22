type WhatsAppFloatButtonProps = {
  message?: string
}

export function WhatsAppFloatButton({ message = 'Hello AGL, I need details on Apsonic products in Ghana.' }: WhatsAppFloatButtonProps) {
  const href = `https://wa.me/233537139760?text=${encodeURIComponent(message)}`

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      title="Chat on WhatsApp"
      className="anim-pulse-float fixed bottom-5 right-5 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-xl shadow-emerald-900/40 transition hover:scale-105 hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="h-7 w-7 fill-current" aria-hidden="true">
        <path d="M19.11 17.21c-.3-.15-1.77-.87-2.05-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.5-.9-.8-1.5-1.8-1.67-2.1-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.8.37-.27.3-1.05 1.02-1.05 2.5s1.07 2.9 1.22 3.1c.15.2 2.1 3.2 5.1 4.48.71.31 1.27.49 1.7.63.72.23 1.38.2 1.9.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.08-.12-.28-.2-.58-.35z" />
        <path d="M16.03 3C8.84 3 3 8.78 3 15.91c0 2.3.61 4.55 1.78 6.53L3 29l6.74-1.75a13.08 13.08 0 0 0 6.29 1.6H16c7.19 0 13.03-5.78 13.03-12.91C29.03 8.78 23.2 3 16.03 3zm0 23.7h-.01c-2 0-3.96-.54-5.67-1.55l-.41-.24-4 .99 1.07-3.9-.27-.4a10.7 10.7 0 0 1-1.64-5.7c0-5.93 4.86-10.76 10.84-10.76 2.9 0 5.62 1.12 7.66 3.14a10.67 10.67 0 0 1 3.19 7.62c0 5.93-4.86 10.76-10.76 10.76z" />
      </svg>
    </a>
  )
}

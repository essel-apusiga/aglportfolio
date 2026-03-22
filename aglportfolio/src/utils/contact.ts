export const WHATSAPP_NUMBER = '233537139760'

export function buildWhatsAppHref(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}
import { Resend } from 'resend'

export type ContactMessageInput = {
  name: string
  email: string
  message: string
}

const resendApiKey = process.env.RESEND_API_KEY?.trim()
const contactRecipient = process.env.CONTACT_TO_EMAIL?.trim()
const contactFromEmail = process.env.CONTACT_FROM_EMAIL?.trim()
const contactFromName = process.env.CONTACT_FROM_NAME?.trim() || 'AGL Portfolio'

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export function validateContactMessage(payload: unknown): payload is ContactMessageInput {
  if (!payload || typeof payload !== 'object') {
    return false
  }

  const candidate = payload as Partial<ContactMessageInput>
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  return Boolean(
    typeof candidate.name === 'string' &&
      candidate.name.trim().length >= 2 &&
      candidate.name.trim().length <= 120 &&
      typeof candidate.email === 'string' &&
      emailPattern.test(candidate.email.trim()) &&
      typeof candidate.message === 'string' &&
      candidate.message.trim().length >= 10 &&
      candidate.message.trim().length <= 5000,
  )
}

export function isContactEmailConfigured() {
  return Boolean(resendApiKey && contactRecipient && contactFromEmail)
}

export async function sendContactEmail({ name, email, message }: ContactMessageInput) {
  if (!isContactEmailConfigured()) {
    throw new Error('Contact email service is not configured.')
  }

  const resend = new Resend(resendApiKey)
  const safeName = escapeHtml(name.trim())
  const safeEmail = escapeHtml(email.trim())
  const safeMessage = escapeHtml(message.trim()).replace(/\n/g, '<br />')

  await resend.emails.send({
    from: `${contactFromName} <${contactFromEmail}>`,
    to: [contactRecipient as string],
    replyTo: email.trim(),
    subject: `New contact message from ${name.trim()}`,
    text: `Name: ${name.trim()}\nEmail: ${email.trim()}\n\nMessage:\n${message.trim()}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a;">
        <h2 style="margin-bottom: 16px; color: #064e3b;">New Contact Message</h2>
        <p><strong>Name:</strong> ${safeName}</p>
        <p><strong>Email:</strong> ${safeEmail}</p>
        <div style="margin-top: 20px; padding: 16px; border-radius: 12px; background: #f0fdf4; border: 1px solid #bbf7d0;">
          <strong>Message</strong>
          <p style="margin-top: 8px; white-space: normal;">${safeMessage}</p>
        </div>
      </div>
    `,
  })
}

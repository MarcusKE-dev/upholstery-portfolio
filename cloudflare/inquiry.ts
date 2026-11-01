import {type Env,json} from './types'
import {throttle} from './auth'
const CATEGORY_LABELS: Record<string, string> = { residential: 'Bespoke Seating', window: 'Window Dressings', bedroom: 'Beds & Accents', automotive: 'Car Seat Covers' }
const escapeHtml = (value: string) => value.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!))
export async function inquiry(req: Request,env:Env) {
  if(req.headers.get('origin')!==new URL(req.url).origin) return json({error:'Invalid request origin.'},403)
  await throttle(req,env,'inquiry',5,300)
  if (!req.headers.get('content-type')?.includes('application/json')) return json({ error: 'Please send a JSON enquiry.' }, 415)
  if (Number(req.headers.get('content-length')) > 24000) return json({ error: 'Enquiry is too large.' }, 413)
  let body: unknown
  try {
    const reader = req.body?.getReader(); if (!reader) throw new Error('Missing body')
    const chunks: Uint8Array[] = []; let size = 0
    while (true) { const { value, done } = await reader.read(); if (done) break; size += value.length; if (size > 24000) { await reader.cancel(); return json({ error: 'Enquiry is too large.' }, 413) } chunks.push(value) }
    body = JSON.parse(Buffer.concat(chunks).toString('utf8'))
  } catch { return json({ error: 'Invalid enquiry format.' }, 400) }
  if (!body || typeof body !== 'object' || Array.isArray(body)) return json({ error: 'Invalid enquiry format.' }, 400)
  const input = body as Record<string, unknown>
  if (input.website) return json({error:'Enquiry rejected.'},400)
  const limits: Record<string, number> = { name: 100, email: 254, phone: 40, category: 30, description: 5000 }
  const fields: Record<string, string> = {}
  for (const [key, max] of Object.entries(limits)) {
    const value = input[key] ?? ''
    if (typeof value !== 'string' || value.length > max || /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(value)) return json({ error: `Please check the ${key} field.` }, 400)
    fields[key] = value.trim()
  }
  const { name, email, phone, category, description } = fields
  if (!name || !description || !/^[^\s@<>"']+@[^\s@<>"']+\.[^\s@<>"']+$/.test(email) || /[\r\n]/.test(name + email + phone) || (category && !Object.prototype.hasOwnProperty.call(CATEGORY_LABELS, category))) return json({ error: 'Provide a name, valid email, project description and available service category.' }, 400)
  if (!env.RESEND_API_KEY || !env.CHARLES_EMAIL || !env.RESEND_FROM_EMAIL) return json({ error: 'Enquiries are temporarily unavailable. Please use the listed contact email.' }, 503)
  try {
    if (/[\r\n]/.test(env.CHARLES_EMAIL!+env.RESEND_FROM_EMAIL!)) return json({error:'Email configuration is invalid.'},503)
    const label = CATEGORY_LABELS[category] || 'General enquiry'
    const delivery = await fetch('https://api.resend.com/emails', { method:'POST', signal:AbortSignal.timeout(15000),headers:{Authorization:`Bearer ${env.RESEND_API_KEY}`,'Content-Type':'application/json'}, body: JSON.stringify({
      from: env.RESEND_FROM_EMAIL || 'onboarding@resend.dev', to: [env.CHARLES_EMAIL], reply_to: email,
      subject: `New Inquiry: ${label} from ${name}`,
      text: `Charles’ Interiors\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nService: ${label}\n\n${description}`,
      html: `<div style="font-family:Georgia,serif;color:#2C1810;max-width:600px"><h1>${escapeHtml("Charles' Interiors")}</h1><h2>New client enquiry</h2><p>Name: ${escapeHtml(name)}</p><p>Email: ${escapeHtml(email)}</p><p>Phone: ${escapeHtml(phone || 'Not provided')}</p><p>Service: ${escapeHtml(label)}</p><p style="white-space:pre-wrap">${escapeHtml(description)}</p></div>`,
    }) })
    if (!delivery.ok) return json({ error: 'Email could not be sent. Please try the listed contact email.' }, 502)
    return json({ success: true })
  } catch { return json({ error: 'Email could not be sent. Please try again later.' }, 502) }
}

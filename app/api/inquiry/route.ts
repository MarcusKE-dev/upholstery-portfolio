import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const CATEGORY_LABELS: Record<string, string> = {
  residential: 'Bespoke Seating',
  window:      'Window Dressings',
  bedroom:     'Beds & Accents',
  automotive:  'Car Seat Covers',
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, phone, category, description } = body

    if (!name || !email || !description) {
      return NextResponse.json(
        { error: 'Name, email, and description are required.' },
        { status: 400 }
      )
    }

    const categoryLabel = CATEGORY_LABELS[category] ?? category

    const { error } = await resend.emails.send({
      from:    'onboarding@resend.dev',
      to:      [process.env.CHARLES_EMAIL!],
      replyTo: email,
      subject: `New Inquiry — ${categoryLabel} from ${name}`,
      html: `
        <div style="font-family:'Georgia',serif;max-width:600px;margin:0 auto;color:#2C1810;">
          <div style="background:#2C1810;padding:32px 40px;">
            <h1 style="color:#C9A84C;font-size:1.5rem;font-weight:300;margin:0;letter-spacing:0.05em;">
              Atelier Charles
            </h1>
            <p style="color:rgba(250,245,233,0.6);font-size:0.75rem;letter-spacing:0.25em;text-transform:uppercase;margin:6px 0 0;">
              New Client Inquiry
            </p>
          </div>

          <div style="background:#FAF5E9;padding:40px;">
            <table style="width:100%;border-collapse:collapse;">
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid rgba(201,168,76,0.2);font-size:0.75rem;letter-spacing:0.15em;text-transform:uppercase;color:#8B6F5E;width:140px;">Name</td>
                <td style="padding:10px 0;border-bottom:1px solid rgba(201,168,76,0.2);font-size:0.9rem;">${name}</td>
              </tr>
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid rgba(201,168,76,0.2);font-size:0.75rem;letter-spacing:0.15em;text-transform:uppercase;color:#8B6F5E;">Email</td>
                <td style="padding:10px 0;border-bottom:1px solid rgba(201,168,76,0.2);font-size:0.9rem;">
                  <a href="mailto:${email}" style="color:#C9A84C;">${email}</a>
                </td>
              </tr>
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid rgba(201,168,76,0.2);font-size:0.75rem;letter-spacing:0.15em;text-transform:uppercase;color:#8B6F5E;">Phone</td>
                <td style="padding:10px 0;border-bottom:1px solid rgba(201,168,76,0.2);font-size:0.9rem;">${phone || '—'}</td>
              </tr>
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid rgba(201,168,76,0.2);font-size:0.75rem;letter-spacing:0.15em;text-transform:uppercase;color:#8B6F5E;">Service</td>
                <td style="padding:10px 0;border-bottom:1px solid rgba(201,168,76,0.2);font-size:0.9rem;">${categoryLabel}</td>
              </tr>
            </table>

            <div style="margin-top:28px;">
              <p style="font-size:0.75rem;letter-spacing:0.15em;text-transform:uppercase;color:#8B6F5E;margin-bottom:10px;">Project Description</p>
              <p style="font-size:0.95rem;line-height:1.8;white-space:pre-wrap;">${description}</p>
            </div>
          </div>

          <div style="background:#2C1810;padding:20px 40px;text-align:center;">
            <p style="color:rgba(250,245,233,0.35);font-size:0.7rem;letter-spacing:0.2em;text-transform:uppercase;margin:0;">
              Atelier Charles · Nairobi, Kenya
            </p>
          </div>
        </div>
      `,
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json({ error: 'Failed to send email.' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Inquiry API error:', err)
    return NextResponse.json({ error: 'Server error.' }, { status: 500 })
  }
}
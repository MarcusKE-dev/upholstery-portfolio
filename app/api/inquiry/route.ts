import { NextApiRequest, NextApiResponse } from 'next';
import Resend from 'resend';

const categoryLabels = {
  residential: 'Bespoke Seating',
  window: 'Window Dressings',
  bedroom: 'Beds & Accents',
  automotive: 'Car Seat Covers',
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, phone, category, description } = req.body;

  if (!name || !email || !description) {
    return res.status(400).json({ error: 'Name, email, and description are required' });
  }

  try {
    const label = categoryLabels[category];
    const htmlBody = `
      <table>
        <tr>
          <th>Name</th>
          <td>${name}</td>
        </tr>
        <tr>
          <th>Email</th>
          <td>${email}</td>
        </tr>
        <tr>
          <th>Phone</th>
          <td>${phone}</td>
        </tr>
        <tr>
          <th>Category</th>
          <td>${label}</td>
        </tr>
        <tr>
          <th>Description</th>
          <td>${description}</td>
        </tr>
      </table>
    `;

    await Resend.emails.send({
      from: 'Atelier Charles Inquiries <inquiries@yourdomain.com>',
      to: process.env.CHARLES_EMAIL,
      replyTo: email,
      subject: `New Inquiry — ${label} from ${name}`,
      html: htmlBody,
    });

    return res.json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error sending email' });
  }
}

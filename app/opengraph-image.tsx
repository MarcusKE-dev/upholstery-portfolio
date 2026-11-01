export const dynamic='force-static'
import { ImageResponse } from 'next/og'
export const alt = "Charles' Interiors: upholstery and furniture restoration in Nairobi"
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export default function Image() {
  return new ImageResponse(<div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%', height: '100%', background: '#FAF5E9', color: '#2C1810', padding: 90, borderBottom: '16px solid #C9A84C' }}><div style={{ fontSize: 76, fontFamily: 'serif' }}>Charles&apos; Interiors</div><div style={{ fontSize: 34, marginTop: 35 }}>Upholstery &amp; furniture restoration</div><div style={{ fontSize: 26, marginTop: 24 }}>Nairobi, Kenya</div></div>, size)
}

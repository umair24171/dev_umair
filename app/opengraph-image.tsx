import { ImageResponse } from 'next/og';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export default function Image() {
  return new ImageResponse(<div style={{ background: '#090b12', color: '#f4f3f8', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', padding: '64px 76px', justifyContent: 'space-between', fontFamily: 'sans-serif' }}><div style={{ display: 'flex', fontSize: 30, fontWeight: 700 }}>Build<span style={{ color: '#c4b5fd' }}>Zn</span></div><div style={{ display: 'flex', flexDirection: 'column', fontSize: 64, fontWeight: 700, lineHeight: 1.1 }}><span>Build the product</span><span>your business actually needs.</span></div><div style={{ display: 'flex', color: '#c4b5fd', fontSize: 25 }}>Mobile apps · SaaS products · Useful AI</div></div>, size);
}

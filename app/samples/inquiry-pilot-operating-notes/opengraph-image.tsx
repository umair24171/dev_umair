import { ImageResponse } from 'next/og';

export const alt = "BuildZn: Operating notes";
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function SocialImage() {
  return new ImageResponse(
    <div style={{ background: '#090b12', color: '#f4f3f8', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', padding: '64px 76px', justifyContent: 'space-between', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', fontSize: 30, fontWeight: 700 }}>Build<span style={{ color: '#a4edcc' }}>Zn</span></div>
      <div style={{ display: 'flex', fontSize: 64, fontWeight: 700, lineHeight: 1.1, maxWidth: 1000 }}>Operating notes</div>
      <div style={{ display: 'flex', color: '#a4edcc', fontSize: 25 }}>Checks, recovery, pausing and account ownership.</div>
    </div>, size);
}

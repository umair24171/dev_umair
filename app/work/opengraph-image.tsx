import { ImageResponse } from 'next/og';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export default function Image() { return new ImageResponse(<div style={{ background: '#0b1110', color: '#edf4ef', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 80 }}><div style={{ color: '#a8ebcd', fontSize: 28, marginBottom: 34 }}>BuildZn</div><div style={{ fontSize: 64, lineHeight: 1.12 }}>Work and technical evidence</div><div style={{ fontSize: 28, marginTop: 30 }}>Browser workflows. Public source. Recorded runs.</div></div>, size); }

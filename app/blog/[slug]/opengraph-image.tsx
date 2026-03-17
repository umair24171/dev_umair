import { ImageResponse } from 'next/og';
import { getPostBySlug } from '@/lib/posts';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  const title   = post?.title   ?? 'Dev.Umair Blog';
  const excerpt = post?.excerpt ?? 'Flutter development, AI, and software engineering insights.';
  const tags    = post?.tags    ?? ['Flutter', 'Development'];
  const date    = post?.date
    ? new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : '';

  // Truncate long titles
  const shortTitle   = title.length   > 65 ? title.slice(0, 62)   + '...' : title;
  const shortExcerpt = excerpt.length > 110 ? excerpt.slice(0, 107) + '...' : excerpt;

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          background: '#06080f',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '60px 70px',
          fontFamily: 'sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Purple glow top-left */}
        <div style={{
          position: 'absolute', top: '-80px', left: '-80px',
          width: '400px', height: '400px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(147,51,234,0.35) 0%, transparent 70%)',
        }} />
        {/* Pink glow bottom-right */}
        <div style={{
          position: 'absolute', bottom: '-100px', right: '-100px',
          width: '450px', height: '450px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(236,72,153,0.3) 0%, transparent 70%)',
        }} />

        {/* Top: avatar + site name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '52px', height: '52px', borderRadius: '14px',
            background: 'linear-gradient(135deg, #9333ea, #ec4899)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '24px', fontWeight: '900', color: 'white',
          }}>U</div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: 'white', fontWeight: '800', fontSize: '22px', lineHeight: '1' }}>Dev.Umair</span>
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginTop: '4px' }}>Flutter Developer & AI Builder</span>
          </div>
        </div>

        {/* Middle: title + excerpt */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1, justifyContent: 'center', marginTop: '20px' }}>
          <div style={{
            fontSize: title.length > 50 ? '42px' : '50px',
            fontWeight: '900',
            color: 'white',
            lineHeight: '1.15',
            letterSpacing: '-1px',
          }}>{shortTitle}</div>
          <div style={{
            fontSize: '20px',
            color: 'rgba(255,255,255,0.5)',
            lineHeight: '1.5',
          }}>{shortExcerpt}</div>
        </div>

        {/* Bottom: tags + date */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '24px' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            {tags.slice(0, 3).map((tag) => (
              <span key={tag} style={{
                padding: '6px 14px', borderRadius: '999px',
                background: 'rgba(147,51,234,0.2)',
                border: '1px solid rgba(147,51,234,0.4)',
                color: '#c084fc', fontSize: '14px', fontWeight: '600',
              }}>{tag}</span>
            ))}
          </div>
          {date && (
            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '15px' }}>{date}</span>
          )}
        </div>
      </div>
    ),
    { ...size }
  );
}

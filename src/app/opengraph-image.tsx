import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import { siteConfig } from '@/content/site';

export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const markDataUri = `data:image/png;base64,${readFileSync(
  join(process.cwd(), 'public', 'logo-mark.png'),
).toString('base64')}`;

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#0A0A0A',
          backgroundImage:
            'radial-gradient(circle at 78% 22%, rgba(225,6,0,0.35) 0%, transparent 55%)',
          padding: 80,
          fontFamily: 'sans-serif',
        }}
      >
        {/* Brand row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={markDataUri} width={84} height={84} alt="" />
          <div
            style={{
              fontSize: 40,
              fontWeight: 800,
              color: 'white',
              letterSpacing: '-0.03em',
            }}
          >
            {siteConfig.name}
          </div>
        </div>

        {/* Headline */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              fontSize: 84,
              fontWeight: 800,
              color: 'white',
              lineHeight: 1.04,
              letterSpacing: '-0.04em',
              maxWidth: 980,
            }}
          >
            {siteConfig.tagline}
          </div>
          <div
            style={{
              marginTop: 28,
              fontSize: 30,
              color: 'rgba(255,255,255,0.65)',
              maxWidth: 880,
              lineHeight: 1.35,
            }}
          >
            500+ certified cars on flexible EMI · Approvals in 24 hours · UAE
          </div>
        </div>

        {/* Footer accent */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 64, height: 6, background: '#E10600' }} />
          <div
            style={{
              fontSize: 24,
              fontWeight: 600,
              color: 'rgba(255,255,255,0.7)',
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
            }}
          >
            {siteConfig.url.replace(/^https?:\/\//, '')}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}

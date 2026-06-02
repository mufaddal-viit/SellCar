import { ImageResponse } from 'next/og';
import { siteConfig } from '@/content/site';

export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

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
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div
            style={{
              width: 72,
              height: 72,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#E10600',
              borderRadius: 16,
            }}
          >
            <svg
              width="44"
              height="44"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 17h14M7 17v-5l2-4h6l2 4v5M9 17v2M15 17v2" />
              <circle cx="8" cy="14" r="1.2" fill="white" />
              <circle cx="16" cy="14" r="1.2" fill="white" />
            </svg>
          </div>
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

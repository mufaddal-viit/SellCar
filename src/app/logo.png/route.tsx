import { ImageResponse } from 'next/og';

// Branded logo served at /logo.png — referenced by Organization/AutoDealer JSON-LD.
export const dynamic = 'force-static';

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#E10600',
          borderRadius: 96,
        }}
      >
        <svg
          width="300"
          height="300"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 17h14M7 17v-5l2-4h6l2 4v5M9 17v2M15 17v2" />
          <circle cx="8" cy="14" r="1.2" fill="white" />
          <circle cx="16" cy="14" r="1.2" fill="white" />
        </svg>
      </div>
    ),
    { width: 512, height: 512 },
  );
}

import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
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
          borderRadius: 40,
        }}
      >
        <svg
          width="120"
          height="120"
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
    { ...size },
  );
}

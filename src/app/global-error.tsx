'use client';

import { useEffect } from 'react';

/**
 * Root-level error boundary. This replaces the entire document (including the
 * root layout) when an error escapes everything below it, so it cannot rely on
 * globals.css / Tailwind being loaded — all styling here is inline.
 *
 * Without this file, an uncaught client error in the App Router unmounts the
 * whole tree and the user is left staring at a blank white page (the exact
 * symptom seen on iOS Safari). This keeps the page legible and recoverable.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface the real error in the browser console (and any logging tooling).
    // On iOS this is what you'll read via Safari Web Inspector to find the cause.
    // eslint-disable-next-line no-console
    console.error('Global error boundary caught:', error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          padding: '24px',
          backgroundColor: '#0a0a0a',
          color: '#fafafa',
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: '420px' }}>
          <div
            style={{
              fontSize: '64px',
              lineHeight: 1,
              fontWeight: 700,
              color: '#e10600',
            }}
          >
            !
          </div>
          <h1 style={{ fontSize: '26px', marginTop: '16px', fontWeight: 700 }}>
            Something went wrong
          </h1>
          <p style={{ marginTop: '12px', color: 'rgba(250,250,250,0.6)' }}>
            We hit an unexpected error while loading the page. Please try again.
          </p>
          {error?.digest && (
            <p
              style={{
                marginTop: '8px',
                fontSize: '12px',
                color: 'rgba(250,250,250,0.35)',
              }}
            >
              Reference: {error.digest}
            </p>
          )}
          <button
            type="button"
            onClick={() => reset()}
            style={{
              marginTop: '28px',
              height: '44px',
              padding: '0 28px',
              borderRadius: '9999px',
              border: 'none',
              backgroundColor: '#e10600',
              color: '#ffffff',
              fontSize: '15px',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}

import Script from 'next/script';

export function GoogleAnalytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const adsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
  // The gtag.js loader is shared by GA4 and Google Ads; load it if either is set.
  const loaderId = gaId || adsId;
  if (!loaderId) return null;
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${loaderId}`}
        strategy="afterInteractive"
      />
      <Script id="gtag-config" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          ${gaId ? `gtag('config', '${gaId}', { send_page_view: true });` : ''}
          ${adsId ? `gtag('config', '${adsId}');` : ''}
        `}
      </Script>
    </>
  );
}

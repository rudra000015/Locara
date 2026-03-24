import type { Metadata, Viewport } from 'next';
import './globals.css';
import ThemeSync from '@/components/ui/ThemeSync';
import LanguageSync from '@/components/ui/LanguageSync';

export const metadata: Metadata = {
  title: 'Locara - Heritage Shop Discovery | Meerut',
  description: 'Discover heritage shops of Meerut. Unveiling the local treasure with authentic shops, products, and traditions.',
  keywords: 'heritage shops, Meerut, traditional products, local business, shop discovery',
  authors: [{ name: 'Locara' }],
  creator: 'Locara Team',
  icons: {
    icon: '/favicon.svg',
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    startUrl: '/',
    title: 'Locara',
  },
  formatDetection: {
    telephone: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://locara.app',
    siteName: 'Locara',
    title: 'Locara - Heritage Shop Discovery',
    description: 'Discover heritage shops of Meerut',
    images: [
      {
        url: 'https://locara.app/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Locara Heritage Shop Discovery',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Locara - Heritage Shop Discovery',
    description: 'Discover heritage shops of Meerut',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#b87333',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Locara" />
        <meta name="application-name" content="Locara" />
        <meta name="msapplication-TileColor" content="#b87333" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 192 192'><rect fill='%23b87333' width='192' height='192'/></svg>" />
        <link rel="manifest" href="/manifest.json" />
        
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        />
        
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://api.dicebear.com" />
        <link rel="preconnect" href="https://cdnjs.cloudflare.com" />
        <link rel="preconnect" href="https://unpkg.com" />
      </head>
      <body suppressHydrationWarning className="antialiased">
        <ThemeSync />
        <LanguageSync />
        {children}
        {/* Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                navigator.serviceWorker.register('/sw.js').catch(() => {
                  // Service worker registration failed, app will still work
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}

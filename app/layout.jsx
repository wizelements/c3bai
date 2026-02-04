import './globals.css';
import PWAInstall from './pwa-install';

export const metadata = {
  title: 'Cod3Black Agency - Web Design, Apps, Software',
  description: 'Custom web design, mobile apps, and software development. $125/hour transparent pricing. See our work in Beltline Golf, TradeAlerts, Gratog, and more.',
  viewport: 'width=device-width, initial-scale=1, viewport-fit=cover',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Cod3Black',
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: '/icon-192x192.png',
    apple: '/icon-192x192.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Cod3Black" />
        <meta name="description" content="Custom web design, mobile apps, and software development. $125/hour transparent pricing." />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <link rel="icon" type="image/png" href="/icon-192x192.png" />
      </head>
      <body>
        <PWAInstall />
        <div className="min-h-screen bg-white">
          {children}
        </div>
      </body>
    </html>
  );
}

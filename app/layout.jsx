import './globals.css';
import PWAInstall from './pwa-install';

export const metadata = {
  title: 'Cod3Black Agency - Done-for-You AI Business Systems',
  description:
    'Cod3Black Agency installs websites, funnels, admin dashboards, automations, and AI workflows so small businesses stop manually chasing customers and orders.',
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
    icon: '/icon.svg',
    apple: '/icon.svg',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
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
        <link rel="apple-touch-icon" href="/icon.svg" />
        <link rel="icon" type="image/svg+xml" href="/icon.svg" />
      </head>
      <body>
        <PWAInstall />
        <div className="min-h-screen bg-white">{children}</div>
      </body>
    </html>
  );
}

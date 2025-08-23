import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/context/AuthContext';
import { AppStateProvider } from '@/context/AppStateContext';
import { PWAPrompt, OfflineIndicator } from '@/components/PWAPrompt';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Christmas Gift List - Organize Your Holiday Gifts',
  description:
    'Collaborative Christmas gift list organizer. Create lists, share with family, and track your holiday shopping.',
  manifest: '/manifest.json',
  themeColor: '#dc2626',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'XmasGifts',
  },
  icons: {
    icon: '/icons/icon-192x192.png',
    apple: '/icons/icon-192x192.png',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: 'cover',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#dc2626" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="XmasGifts" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/icons/icon-192x192.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="512x512"
          href="/icons/icon-512x512.png"
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased bg-gray-50`}>
        <AuthProvider>
          <AppStateProvider>
            <OfflineIndicator />
            {children}
            <PWAPrompt />
          </AppStateProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

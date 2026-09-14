import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: {
    default: 'Pari Gift Center — 30–45 Min Express Delivery in Kinwat',
    template: '%s | Pari Gift Center',
  },
  description:
    'Shop ladies fashion, jewellery, cosmetics, toys & gifts online. Free delivery above ₹299. 30–45 min express delivery in Kinwat & nearby areas.',
  keywords: ['Pari Gift Center', 'Kinwat', 'online shopping', 'ladies fashion', 'jewellery', 'cosmetics', 'gifts', 'toys'],
  openGraph: {
    title: 'Pari Gift Center — 30–45 Min Express Delivery in Kinwat',
    description: 'Shop ladies fashion, jewellery, cosmetics, toys & gifts. 30–45 min express delivery!',
    type: 'website',
    locale: 'en_IN',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1A1A1A',
              color: '#fff',
              borderRadius: '12px',
              fontSize: '14px',
            },
            success: {
              iconTheme: { primary: '#E8272A', secondary: '#fff' },
            },
          }}
        />
      </body>
    </html>
  )
}

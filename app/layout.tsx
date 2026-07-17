import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Frank_Ruhl_Libre, Heebo } from 'next/font/google'
import './globals.css'

const frankRuhl = Frank_Ruhl_Libre({
  subsets: ['hebrew', 'latin'],
  weight: ['400', '500', '700', '900'],
  variable: '--font-frank-ruhl',
})

const heebo = Heebo({
  subsets: ['hebrew', 'latin'],
  weight: ['400', '500', '700'],
  variable: '--font-heebo',
})

export const metadata: Metadata = {
  title: 'אישור הגעה לברית - משפחת דודיאן',
  description: 'אנא אשרו את הגעתכם לברית המילה וזבד הבנות של משפחת דודיאן',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#c9a86a',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="he" dir="rtl" className={`${frankRuhl.variable} ${heebo.variable} bg-background`}>
      <body className="font-serif antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}

import type { Metadata, Viewport } from 'next'
import { Orbitron, Rajdhani } from 'next/font/google'

import './globals.css'

const orbitron = Orbitron({ subsets: ['latin'], variable: '--font-orbitron' })
const rajdhani = Rajdhani({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-rajdhani',
})

export const metadata: Metadata = {
  title: 'Physics Racer - Test Your Knowledge, Win the Race',
  description:
    'A web-based drag racing game where your physics knowledge determines your speed. Answer questions, earn cars, and race to the finish!',
}

export const viewport: Viewport = {
  themeColor: '#00e5ff',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${orbitron.variable} ${rajdhani.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased overflow-x-hidden" suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}

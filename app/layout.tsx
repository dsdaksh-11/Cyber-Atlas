import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'CyberLaw Atlas | Global Cybercrime & Cybersecurity Legal Intelligence',
  description:
    'Explore cybercrime and cybersecurity laws from countries around the world. Search by country name or ISO country code to access structured, source-attributed legal information.',
  keywords: [
    'CyberLaw Atlas',
    'Cybercrime laws',
    'Cybersecurity legislation',
    'ISO country code cyber law',
    'Data protection law India IN',
    'Cybersecurity Law China CN',
    'Computer Fraud and Abuse Act US',
    'Computer Misuse Act UK GB',
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} dark scroll-smooth h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}

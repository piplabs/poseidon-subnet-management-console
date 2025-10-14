import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import { QueryProvider } from '@/lib/query-client'
import { Header } from '@/common/components/layout/header'
import './globals.css'

export const metadata: Metadata = {
  title: 'Poseidon Subnet Management Console',
  description: 'Monitor workflows, activities, and workers in the subnet',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <QueryProvider>
          <div className="min-h-screen bg-background">
            <Header />
            {children}
          </div>
          <Analytics />
        </QueryProvider>
      </body>
    </html>
  )
}

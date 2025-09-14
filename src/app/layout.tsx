import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import { Geist_Mono } from 'next/font/google'
import { Toaster } from '@/components/ui/sonner'

export const metadata: Metadata = {
  title: 'Task Manager',
  description:
    'A full-stack task management application to organize and track your tasks efficiently.',
}

const font = Geist_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={font.className}>
        <Navbar />
        {children}
        <Toaster />
      </body>
    </html>
  )
}

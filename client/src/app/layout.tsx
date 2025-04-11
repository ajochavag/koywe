import './globals.css'
import type { Metadata } from 'next'
import { Kanit} from 'next/font/google'

const kanitFonts = Kanit({ weight: ['400', '600', '700'], subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Koywe Swap',
  description: 'Portal para swapear tu moneda favorita 💚⚡',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={kanitFonts.className}>{children}</body>
    </html>
  )
}
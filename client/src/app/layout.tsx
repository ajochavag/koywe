import './globals.css'
import type { Metadata } from 'next'
import { Kanit} from 'next/font/google'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const kanitFonts = Kanit({ weight: ['400', '600', '700'], subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Koywe Swap',
  description: 'Portal para swapear tu moneda favorita 💚⚡',
}

export default async function RootLayout({ children, }: { children: React.ReactNode}) {
  return (
    <html lang="es">
      <body className={kanitFonts.className}>{children}
      <ToastContainer />
      </body>
    </html>
  )
}
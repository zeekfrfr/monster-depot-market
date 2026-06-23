import type { Metadata } from 'next'
import { Syne, DM_Sans } from 'next/font/google'
import Script from 'next/script'
import { CartProvider } from '@/lib/cart'
import { SavedRecipesProvider } from '@/lib/savedRecipes'
import { getCatalog } from '@/lib/catalog'
import { CatalogProvider } from '@/lib/catalogContext'
import AgeGate from '@/components/AgeGate'
import Nav from '@/components/Nav'
import CartSheet from '@/components/CartSheet'
import Footer from '@/components/Footer'
import './globals.css'

const syne = Syne({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-syne',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://monsterdepotmarket.com'),
  title: 'Monster Depot Market — Got Munchies?',
  description:
    'Exotic single-serving Munchie Pouches. Just add liquid and make a dessert in a mug, air fryer, or waffle maker in under 5 minutes. Five flavors. 18+.',
  icons: { icon: '/favicon.ico' },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const squareSrc = process.env.NEXT_PUBLIC_SQUARE_ENVIRONMENT === 'production'
    ? 'https://web.squarecdn.com/v1/square.js'
    : 'https://sandbox.web.squarecdn.com/v1/square.js'

  // Trusted catalog (prices + toppings) fetched server-side and seeded into the
  // client provider, so DB edits go live via ISR without a redeploy.
  const catalog = await getCatalog()

  return (
    <html lang="en" className={`${syne.variable} ${dmSans.variable}`}>
      <body>
        <a href="#main" className="skip-link">Skip to main content</a>
        <Script src={squareSrc} strategy="lazyOnload" />
        <CartProvider>
          <CatalogProvider initial={catalog}>
            <SavedRecipesProvider>
              <AgeGate />
              <Nav />
              <main id="main">{children}</main>
              <Footer />
              <CartSheet />
            </SavedRecipesProvider>
          </CatalogProvider>
        </CartProvider>
      </body>
    </html>
  )
}

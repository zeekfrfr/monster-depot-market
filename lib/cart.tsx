'use client'

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react'

export type CartFormat = 'single' | '7pack' | 'mixmatch7' | 'weekly-sub'

export interface CartTopping {
  name: string
  price: number
}

export interface CartItem {
  id: string // unique: `${slug}-${format}-${timestamp}`
  slug: string
  name: string
  format: CartFormat
  price: number
  toppings: CartTopping[]
  bg: string
  accent: string
}

export const FORMAT_LABELS: Record<CartFormat, string> = {
  single: 'Single',
  '7pack': '7-pack',
  mixmatch7: 'Mix & Match 7-pack',
  'weekly-sub': 'Weekly subscription',
}

export function itemTotal(item: CartItem): number {
  return item.price + item.toppings.reduce((s, t) => s + t.price, 0)
}

interface CartContextValue {
  cart: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  removeTopping: (id: string, toppingIndex: number) => void
  clearCart: () => void
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
  total: number
  count: number
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)

  // Each add is a distinct line (id carries a timestamp), so configurations
  // with different toppings don't collapse into one another.
  const addItem = useCallback((item: CartItem) => {
    setCart((prev) => [...prev, item])
  }, [])

  const removeItem = useCallback((id: string) => {
    setCart((prev) => prev.filter((i) => i.id !== id))
  }, [])

  const removeTopping = useCallback((id: string, toppingIndex: number) => {
    setCart((prev) =>
      prev.map((i) =>
        i.id === id
          ? { ...i, toppings: i.toppings.filter((_, idx) => idx !== toppingIndex) }
          : i
      )
    )
  }, [])

  const clearCart = useCallback(() => setCart([]), [])

  const total = cart.reduce((sum, i) => sum + itemTotal(i), 0)
  const count = cart.length

  return (
    <CartContext.Provider
      value={{
        cart,
        addItem,
        removeItem,
        removeTopping,
        clearCart,
        isOpen,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        total,
        count,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}

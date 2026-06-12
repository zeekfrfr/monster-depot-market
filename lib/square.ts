declare global {
  interface Window {
    Square?: {
      payments: (appId: string, locationId: string) => Promise<SquarePayments>
    }
  }
}

interface SquarePayments {
  card: (options?: object) => Promise<SquareCard>
}

interface SquareCard {
  attach: (selector: string) => Promise<void>
  tokenize: () => Promise<{ status: string; token?: string; errors?: unknown[] }>
  destroy: () => Promise<void>
}

export async function initSquare(): Promise<SquarePayments | null> {
  const env = process.env.NEXT_PUBLIC_SQUARE_ENVIRONMENT ?? 'sandbox'
  const isProd = env === 'production'

  const appId = isProd
    ? process.env.NEXT_PUBLIC_SQUARE_PROD_APP_ID
    : process.env.NEXT_PUBLIC_SQUARE_SANDBOX_APP_ID

  const locationId = isProd
    ? process.env.NEXT_PUBLIC_SQUARE_PROD_LOCATION_ID
    : process.env.NEXT_PUBLIC_SQUARE_SANDBOX_LOCATION_ID

  if (!appId || !locationId || !window.Square) return null

  return window.Square.payments(appId, locationId)
}

export function formatPrice(cents: number): string {
  return (cents / 100).toFixed(2)
}

export function toSquareMoney(dollars: number): number {
  return Math.round(dollars * 100)
}

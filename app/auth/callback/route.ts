import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/account'
  const orderId = searchParams.get('order_id')
  const optIn = searchParams.get('opt_in') === '1'

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!code || !supabaseUrl || !anonKey) {
    return NextResponse.redirect(`${origin}/login`)
  }

  const cookieStore = cookies()
  const supabase = createServerClient(supabaseUrl, anonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: CookieOptions) {
        cookieStore.set({ name, value, ...options })
      },
      remove(name: string, options: CookieOptions) {
        cookieStore.set({ name, value: '', ...options })
      },
    },
  })

  const { data, error } = await supabase.auth.exchangeCodeForSession(code)
  if (error || !data.session) {
    return NextResponse.redirect(`${origin}/login`)
  }

  // Post-checkout signup: link the order to the new account and seed the profile
  if (orderId) {
    try {
      await fetch(`${supabaseUrl}/functions/v1/claim-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${data.session.access_token}`,
        },
        body: JSON.stringify({ orderId, marketingOptIn: optIn }),
      })
    } catch {
      // Non-fatal — the account still works; order linking can be retried by support
    }
  }

  return NextResponse.redirect(`${origin}${next.startsWith('/') ? next : '/account'}`)
}

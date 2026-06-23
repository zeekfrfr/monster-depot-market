'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useCart } from '@/lib/cart'
import { getSupabase } from '@/lib/supabase'

const lightRoutes = ['/refunds', '/shipping', '/privacy', '/terms', '/cart']

export default function Nav() {
  const pathname = usePathname()
  const { count, openCart } = useCart()
  const [scrolled, setScrolled] = useState(false)
  const [signedIn, setSignedIn] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const supabase = getSupabase()
    if (!supabase) return
    let active = true
    const syncUser = async (email?: string | null) => {
      if (active) setSignedIn(!!email)
      if (!email) {
        if (active) setIsAdmin(false)
        return
      }
      const { data } = await supabase
        .from('admin_users')
        .select('email')
        .eq('email', email)
        .eq('status', 'active')
        .maybeSingle()
      if (active) setIsAdmin(!!data)
    }
    supabase.auth.getUser().then(({ data }) => syncUser(data.user?.email))
    const { data } = supabase.auth.onAuthStateChange((_event, session) =>
      syncUser(session?.user?.email),
    )
    return () => {
      active = false
      data.subscription.unsubscribe()
    }
  }, [])

  const isLight = lightRoutes.includes(pathname)
  const textColor = scrolled ? '#fff' : isLight ? 'var(--text-primary)' : '#fff'

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 'var(--space-4)',
        background: scrolled ? 'rgba(0,0,0,0.6)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
        transition:
          'background var(--dur-base) var(--ease-out), backdrop-filter var(--dur-base) var(--ease-out)',
      }}
    >
      <Link
        href="/"
        style={{
          fontFamily: 'var(--font-syne)',
          fontWeight: 800,
          fontSize: '18px',
          color: textColor,
          textDecoration: 'none',
          lineHeight: 1,
          letterSpacing: '-0.01em',
          transition: 'color var(--dur-base) var(--ease-out)',
        }}
      >
        Monster Depot
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
        <Link
          href="/recipes"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '40px',
            padding: '0 var(--space-2)',
            fontFamily: 'var(--font-syne)',
            fontWeight: 700,
            fontSize: '15px',
            color: textColor,
            textDecoration: 'none',
            letterSpacing: '-0.01em',
            transition: 'color var(--dur-base) var(--ease-out)',
          }}
        >
          Recipes
        </Link>
        {isAdmin && (
          <Link
            href="/admin"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '40px',
              padding: '0 var(--space-2)',
              fontFamily: 'var(--font-syne)',
              fontWeight: 700,
              fontSize: '15px',
              color: textColor,
              textDecoration: 'none',
              letterSpacing: '-0.01em',
              transition: 'color var(--dur-base) var(--ease-out)',
            }}
          >
            Admin
          </Link>
        )}
        <Link
          href={signedIn ? '/account' : '/login'}
          aria-label={signedIn ? 'Your account' : 'Sign in'}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: '40px',
            minHeight: '40px',
            color: textColor,
            transition: 'color var(--dur-base) var(--ease-out)',
          }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill={signedIn ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            focusable="false"
          >
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" />
          </svg>
        </Link>

        <button
        type="button"
        onClick={openCart}
        aria-label="Open cart"
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: '44px',
          minHeight: '44px',
          padding: 0,
          margin: 0,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: textColor,
          transition: 'color var(--dur-base) var(--ease-out)',
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M5 7h14l-1.2 12.2a1 1 0 0 1-1 .8H7.2a1 1 0 0 1-1-.8L5 7Z" />
          <path d="M8.5 7V5.5a3.5 3.5 0 0 1 7 0V7" />
        </svg>

        <span
          aria-hidden={count === 0}
          style={{
            position: 'absolute',
            top: '4px',
            right: '4px',
            width: '18px',
            height: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 'var(--radius-full)',
            background: 'var(--brand-purple-light)',
            color: '#fff',
            fontFamily: 'var(--font-syne)',
            fontWeight: 700,
            fontSize: '10px',
            lineHeight: 1,
            pointerEvents: 'none',
            opacity: count > 0 ? 1 : 0,
            transform: count > 0 ? 'scale(1)' : 'scale(0)',
            animation:
              count > 0 ? 'badgePop var(--dur-base) var(--ease-spring)' : 'none',
          }}
        >
          {count}
        </span>
      </button>
      </div>
    </header>
  )
}

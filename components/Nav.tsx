'use client'

import Link from 'next/link'
import { useCart } from '@/lib/cart'

export default function Nav() {
  const { itemCount, openCart } = useCart()

  return (
    <header
      className="sticky top-0 z-40 flex items-center justify-between px-6"
      style={{
        height: '56px',
        backgroundColor: 'var(--off-white)',
        borderBottom: '1px solid var(--mid-gray)',
      }}
    >
      <Link
        href="/"
        style={{
          fontSize: 'var(--text-base)',
          fontWeight: 400,
          color: 'var(--text-primary)',
          textDecoration: 'none',
          letterSpacing: '-0.01em',
        }}
      >
        Monster Depot
      </Link>

      <button
        onClick={openCart}
        aria-label={`Cart${itemCount > 0 ? `, ${itemCount} items` : ''}`}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--text-primary)',
          fontSize: 'var(--text-sm)',
          fontWeight: 400,
          letterSpacing: '-0.01em',
        }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6 6.5V5a3 3 0 1 1 6 0v1.5"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
          />
          <path
            d="M2.5 6.5h13l-1.25 9H3.75L2.5 6.5z"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {itemCount > 0 && (
          <span style={{ color: 'var(--text-primary)' }}>{itemCount}</span>
        )}
      </button>
    </header>
  )
}

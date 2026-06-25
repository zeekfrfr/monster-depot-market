'use client'

import { useState } from 'react'
import { getSupabase } from '@/lib/supabase'

const TOPICS = ['Question', 'Report a problem', 'Order help', 'Wholesale', 'Other']
const SUPPORT_EMAIL = 'monsterdepotmarketing@gmail.com'

export default function ContactPage() {
  const supabase = getSupabase()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [topic, setTopic] = useState(TOPICS[0])
  const [message, setMessage] = useState('')
  const [focused, setFocused] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!message.trim()) {
      setError('Please add a message.')
      return
    }
    if (!supabase) {
      setError(`Please email us directly at ${SUPPORT_EMAIL}.`)
      return
    }
    setLoading(true)
    const { error: insertErr } = await supabase.from('contact_messages').insert({
      name: name.trim() || null,
      email: email.trim() || null,
      topic,
      message: message.trim(),
    })
    if (insertErr) {
      setError(`Something went wrong. Please email us at ${SUPPORT_EMAIL}.`)
      setLoading(false)
      return
    }
    setSent(true)
    setLoading(false)
  }

  const field = (name: string): React.CSSProperties => ({
    width: '100%',
    border: 'none',
    borderBottom: `1px solid ${focused === name ? 'var(--brand-purple-dark)' : '#E5E5E5'}`,
    borderRadius: 0,
    padding: '12px 0',
    fontSize: '16px',
    fontFamily: 'inherit',
    background: 'transparent',
    color: 'var(--text-primary)',
    outline: 'none',
    transition: 'border-color 150ms ease',
    boxSizing: 'border-box',
  })

  return (
    <main style={{ minHeight: '100svh', background: 'var(--surface-white)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '120px 24px 80px' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--text-tertiary)', marginBottom: '12px' }}>
          Monster Depot Market
        </p>
        <h1 style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: '28px', letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: '12px' }}>
          Contact &amp; report.
        </h1>
        <p style={{ fontFamily: 'var(--font-dm-sans)', fontWeight: 300, fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '36px' }}>
          Questions, order help, wholesale, or reporting a problem — send it here and we&apos;ll get back to you. You can also email{' '}
          <a href={`mailto:${SUPPORT_EMAIL}`} style={{ color: 'var(--brand-purple-light)', textDecoration: 'none' }}>{SUPPORT_EMAIL}</a>.
        </p>

        {sent ? (
          <div style={{ background: 'var(--surface-off)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
            <p style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: '18px', color: 'var(--text-primary)', margin: '0 0 6px' }}>Thanks — we got it.</p>
            <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              We&apos;ll reply{email ? ` to ${email}` : ' soon'}. For anything urgent, email {SUPPORT_EMAIL}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <input placeholder="Name (optional)" value={name} onChange={(e) => setName(e.target.value)} onFocus={() => setFocused('name')} onBlur={() => setFocused(null)} style={field('name')} />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <input type="email" placeholder="Email (so we can reply)" value={email} onChange={(e) => setEmail(e.target.value)} onFocus={() => setFocused('email')} onBlur={() => setFocused(null)} style={field('email')} autoComplete="email" />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-tertiary)', marginBottom: '8px' }}>Topic</label>
              <select value={topic} onChange={(e) => setTopic(e.target.value)} style={{ ...field('topic'), appearance: 'auto' }}>
                {TOPICS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: '28px' }}>
              <textarea
                placeholder="How can we help?"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onFocus={() => setFocused('message')}
                onBlur={() => setFocused(null)}
                rows={5}
                style={{ ...field('message'), resize: 'vertical', minHeight: '110px', lineHeight: 1.5 }}
              />
            </div>

            {error && <p style={{ fontSize: '13px', color: '#c0392b', marginBottom: '16px', lineHeight: 1.5 }}>{error}</p>}

            <button
              type="submit"
              disabled={loading || !message.trim()}
              style={{
                width: '100%',
                height: '52px',
                backgroundColor: loading || !message.trim() ? 'var(--text-disabled)' : 'var(--brand-purple-light)',
                color: '#fff',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                fontFamily: 'var(--font-syne)',
                fontSize: '16px',
                fontWeight: 700,
                cursor: loading || !message.trim() ? 'default' : 'pointer',
                transition: 'background-color 150ms ease',
              }}
            >
              {loading ? 'Sending…' : 'Send message →'}
            </button>
          </form>
        )}
      </div>
    </main>
  )
}

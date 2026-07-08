'use client'

import Link from 'next/link'
import { ChevronUp, Globe2, LogOut } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

const footerLinks = [
  ['Home', '/'],
  ['About', '/about'],
  ['Contact', '/contact'],
  ['Search', '/search'],
] as const

export function EditableFooter() {
  const year = new Date().getFullYear()
  const { session, logout } = useEditableLocalAuthSession()

  return (
    <footer className="bg-[var(--editable-footer-bg)] text-[var(--editable-footer-text)]">
      <div className="mx-auto grid max-w-[var(--editable-container)] gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_1fr_1fr_0.45fr] lg:px-8">
        <div>
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-sm border border-white/35 bg-white">
              <img src="/favicon.png?v=20260413" alt={SITE_CONFIG.name} className="h-8 w-8 object-contain" />
            </span>
            <span>
              <span className="editable-display block text-2xl font-extrabold tracking-[0.01em]">{SITE_CONFIG.name}</span>
            </span>
          </Link>
        </div>

        <div>
          <h3 className="text-sm font-extrabold uppercase tracking-[0.08em] text-[#9cc4f8]">Links</h3>
          <div className="mt-4 grid gap-2">
            {footerLinks.map(([label, href]) => (
              <Link key={href} href={href} className="inline-flex items-center gap-2 text-sm font-bold text-white transition hover:text-white/75">
                {label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-extrabold uppercase tracking-[0.08em] text-[#9cc4f8]">Other</h3>
          <div className="mt-4 grid gap-2">
            {(session ? [] : [['Sign in', '/login'], ['Sign up', '/signup']] as const).map(([label, href]) => (
              <Link key={href} href={href} className="text-sm font-bold text-white transition hover:text-white/75">{label}</Link>
            ))}
            {session ? <button type="button" onClick={logout} className="inline-flex items-center gap-2 text-left text-sm font-bold text-white transition hover:text-white/75"><LogOut className="h-4 w-4" /> Logout</button> : null}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-extrabold uppercase tracking-[0.08em] text-[#9cc4f8]">Top</h3>
          <Link href="#" className="mt-5 inline-flex h-12 w-12 items-center justify-center rounded-md bg-white text-[#2f6fcc] shadow-[0_16px_32px_rgba(23,50,92,0.18)]">
            <ChevronUp className="h-5 w-5" />
          </Link>
        </div>
      </div>

      <div className="mx-auto flex max-w-[var(--editable-container)] flex-col items-center justify-between gap-4 border-t border-white/20 px-4 py-6 text-xs font-semibold tracking-[0.08em] text-white/85 sm:flex-row sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-5">
          {footerLinks.map(([label, href]) => <Link key={href} href={href} className="hover:text-white">{label}</Link>)}
          {!session ? <Link href="/login" className="hover:text-white">Sign in</Link> : null}
          {!session ? <Link href="/signup" className="hover:text-white">Sign up</Link> : null}
          {session ? <button type="button" onClick={logout} className="hover:text-white">Logout</button> : null}
        </div>
        <span className="inline-flex items-center gap-2 rounded-sm border border-white/25 px-4 py-2"><Globe2 className="h-4 w-4" /> English</span>
        <span>Copyright © {year} {SITE_CONFIG.name}. All rights reserved.</span>
      </div>
    </footer>
  )
}

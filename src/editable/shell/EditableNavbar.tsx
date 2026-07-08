'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, UserPlus, LogIn, X, LogOut, UserRound, PlusCircle } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'Search', href: '/search' },
]

export function EditableNavbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { session, logout } = useEditableLocalAuthSession()

  return (
    <header className="sticky top-0 z-50 bg-[rgba(27,41,53,0.88)] text-[var(--editable-nav-text)] shadow-[0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-md">
      <nav className="mx-auto flex min-h-[72px] w-full max-w-[var(--editable-container)] items-center gap-5 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex shrink-0 items-center gap-3 pr-5">
          <span className="flex h-10 w-10 items-center justify-center rounded-sm border border-white/30 bg-white transition group-hover:border-white">
            <img src="/favicon.png?v=20260413" alt={SITE_CONFIG.name} className="h-8 w-8 object-contain" />
          </span>
          <span className="hidden min-w-0 md:block">
            <span className="editable-display block max-w-[200px] truncate text-2xl font-extrabold leading-none tracking-[0.02em] text-white">{SITE_CONFIG.name}</span>
          </span>
        </Link>

        <div className="ml-auto hidden items-stretch gap-0 lg:flex">
          {navItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex items-center px-4 text-[11px] font-semibold uppercase tracking-[0.22em] transition ${
                  active ? 'text-white' : 'text-white/72 hover:text-white'
                }`}
              >
                {item.label}
                {active ? <span className="absolute inset-x-3 bottom-0 h-[2px] bg-white" /> : null}
              </Link>
            )
          })}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {session ? (
            <>
              <Link
                href="/create"
                className="hidden items-center gap-2 rounded-sm border border-white/40 bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#2f6fcc] transition hover:-translate-y-0.5 sm:inline-flex"
              >
                <PlusCircle className="h-3.5 w-3.5" /> Create
              </Link>
              <span className="hidden max-w-[160px] items-center gap-2 truncate rounded-sm border border-white/20 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/85 sm:inline-flex">
                <UserRound className="h-3.5 w-3.5" /> {session.name || session.email || 'Member'}
              </span>
              <button
                type="button"
                onClick={logout}
                className="hidden items-center gap-2 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/72 transition hover:text-white sm:inline-flex"
              >
                <LogOut className="h-3.5 w-3.5" /> Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden items-center gap-2 border border-white/25 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/75 transition hover:border-white/50 hover:text-white sm:inline-flex"
              >
                <LogIn className="h-3.5 w-3.5" /> Sign in
              </Link>
              <Link
                href="/signup"
                className="hidden items-center gap-2 rounded-sm border border-white bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#2f6fcc] transition hover:-translate-y-0.5 sm:inline-flex"
              >
                <UserPlus className="h-3.5 w-3.5" /> Sign up
              </Link>
            </>
          )}
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="border border-white/25 bg-white/10 p-2 text-white lg:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open ? (
        <div className="border-t border-white/10 bg-[#1b2935] px-4 py-5 lg:hidden">
          {session ? <p className="mb-3 truncate text-xs font-semibold uppercase tracking-[0.16em] text-white/70">{session.name || session.email || 'Member'}</p> : null}
          <div className="grid gap-1">
            {[...navItems, ...(session ? [{ label: 'Create', href: '/create' }] : [{ label: 'Sign in', href: '/login' }, { label: 'Sign up', href: '/signup' }])].map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`border-l-2 px-4 py-3 text-sm font-semibold uppercase tracking-[0.16em] ${
                    active
                      ? 'border-[var(--slot4-accent)] bg-[var(--slot4-surface-bg)] text-[var(--slot4-accent)]'
                      : 'border-transparent text-white/75 hover:border-white/40 hover:bg-white/10'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
            {session ? <button type="button" onClick={() => { logout(); setOpen(false) }} className="border-l-2 border-transparent px-4 py-3 text-left text-sm font-semibold uppercase tracking-[0.16em] text-white/75 hover:bg-white/10">Logout</button> : null}
          </div>
        </div>
      ) : null}
    </header>
  )
}

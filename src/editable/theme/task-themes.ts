import type { CSSProperties } from 'react'
import type { TaskKey } from '@/lib/site-config'

/*
  Directory-style task surfaces.
  Article, profile, and supporting pages share one blue public-directory identity.
*/

export type TaskTheme = {
  /** short flavour word shown as an eyebrow kicker */
  kicker: string
  /** one-line mood note for the page intro */
  note: string
  dark: boolean
  fontDisplay: string
  fontBody: string
  bg: string
  surface: string
  raised: string
  text: string
  muted: string
  line: string
  accent: string
  accentSoft: string
  onAccent: string
  glow: string
  radius: string
}

const DIRECTORY_FONT = "'Inter', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"

// Shared blue directory palette; only kicker/note differ.
const base = {
  dark: false,
  fontDisplay: DIRECTORY_FONT,
  fontBody: DIRECTORY_FONT,
  bg: '#f7fbff',
  surface: '#ffffff',
  raised: '#eef6ff',
  text: '#16325c',
  muted: '#6f8097',
  line: '#d8e0ea',
  accent: '#2f6fcc',
  accentSoft: '#e5f0ff',
  onAccent: '#ffffff',
  glow: 'rgba(65,125,204,0.16)',
  radius: '0.7rem',
} satisfies Omit<TaskTheme, 'kicker' | 'note'>

export const taskThemes: Record<TaskKey, TaskTheme> = {
  article: { ...base, kicker: 'Articles', note: 'Guides, essays, and research-friendly reads.' },
  listing: { ...base, kicker: 'Businesses', note: 'Find, compare and connect with local businesses.' },
  classified: { ...base, kicker: 'Marketplace', note: 'Fresh offers and listings, ready to act on.' },
  image: { ...base, kicker: 'Photos', note: 'A visual feed of standout images and galleries.' },
  sbm: { ...base, kicker: 'Bookmarks', note: 'Curated resources and links worth saving.' },
  pdf: { ...base, kicker: 'Documents', note: 'Downloadable guides, reports and references.' },
  profile: { ...base, kicker: 'Profiles', note: 'Professionals, creators, teams, and public profiles.' },
}

export function getTaskTheme(task: TaskKey): TaskTheme {
  return taskThemes[task] || taskThemes.article
}

/** All `--tk-*` tokens + font overrides for a task surface, ready for `style`. */
export function taskThemeStyle(task: TaskKey): CSSProperties {
  const t = getTaskTheme(task)
  return {
    '--tk-bg': t.bg,
    '--tk-surface': t.surface,
    '--tk-raised': t.raised,
    '--tk-text': t.text,
    '--tk-muted': t.muted,
    '--tk-line': t.line,
    '--tk-accent': t.accent,
    '--tk-accent-soft': t.accentSoft,
    '--tk-on-accent': t.onAccent,
    '--tk-glow': t.glow,
    '--tk-radius': t.radius,
    '--slot4-accent': t.accent,
    '--slot4-accent-fill': t.accent,
    '--editable-font-display': t.fontDisplay,
    '--editable-font-body': t.fontBody,
    fontFamily: t.fontBody,
  } as CSSProperties
}

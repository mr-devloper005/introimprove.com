import Link from 'next/link'
import type { ReactNode } from 'react'
import {
  ArrowRight, MapPin, MessageSquare, Search, Star,
} from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { getEditablePostImage, postHref } from '@/editable/cards/PostCards'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

const container = 'mx-auto w-full max-w-[var(--editable-container)] px-4 sm:px-6 lg:px-8'

function dedupePosts(posts: SitePost[]) {
  const seen = new Set<string>()
  const out: SitePost[] = []
  for (const post of posts) {
    const key = post.slug || post.id || post.title
    if (!key || seen.has(key)) continue
    seen.add(key)
    out.push(post)
  }
  return out
}

function contentOf(post?: SitePost | null) {
  return post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
}

function excerptOf(post?: SitePost | null, limit = 130) {
  const content = contentOf(post)
  const raw =
    (typeof content.description === 'string' && content.description) ||
    (typeof content.summary === 'string' && content.summary) ||
    (typeof content.excerpt === 'string' && content.excerpt) ||
    post?.summary ||
    ''
  const clean = raw.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  return clean.length > limit ? `${clean.slice(0, limit).trim()}...` : clean
}

function categoryOf(post?: SitePost | null, fallback = 'Featured') {
  const content = contentOf(post)
  return (typeof content.category === 'string' && content.category) || post?.tags?.[0] || fallback
}

function imageOf(post?: SitePost | null) {
  return post ? getEditablePostImage(post) : ''
}

function hashStr(value: string) {
  let h = 0
  for (let i = 0; i < value.length; i += 1) h = (h * 31 + value.charCodeAt(i)) >>> 0
  return h
}

function ratingOf(post: SitePost) {
  const real = Number(contentOf(post).rating)
  if (real >= 1 && real <= 5) return Math.round(real * 10) / 10
  return Math.round((3.8 + (hashStr(post.slug || post.id || post.title || 'x') % 11) / 10) * 10) / 10
}

function RatingRow({ post }: { post: SitePost }) {
  const rating = ratingOf(post)
  const filled = Math.round(rating)
  return (
    <span className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-[#5d6d84]">
      {[0, 1, 2, 3, 4].map((i) => <Star key={i} className={`h-3.5 w-3.5 ${i < filled ? 'fill-[#2f6fcc] text-[#2f6fcc]' : 'fill-[#d8e0ea] text-[#d8e0ea]'}`} />)}
      {rating.toFixed(1)}
    </span>
  )
}

export function EditableHomeHero({ primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = dedupePosts([...posts, ...timeSections.flatMap((section) => section.posts)])
  const heroPost = pool[0]
  const heroImage = imageOf(heroPost)
  const taskOptions = SITE_CONFIG.tasks.filter((task) => task.enabled)
  const heroTitle = pagesContent.home.hero.title?.join(' ') || `Explore ${SITE_CONFIG.name}`

  return (
    <section className="relative overflow-hidden bg-[#d8e8fb]">
      <div className="relative h-[650px] min-h-[70vh] overflow-hidden">
        {heroImage ? (
          <img src={heroImage} alt="" className="intro-hero-visual absolute inset-0 h-full w-full object-cover opacity-85" />
        ) : (
          <div className="intro-hero-visual absolute inset-0 bg-[radial-gradient(circle_at_50%_34%,#ffffff_0,#b9d8f8_30%,#7fa9d8_62%,#26394d_100%)]" />
        )}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,25,35,0.48)_0%,rgba(12,25,35,0.10)_38%,rgba(12,25,35,0.45)_100%)]" />
        <div className="absolute inset-x-0 top-0 h-16 bg-[rgba(22,32,39,0.42)]" />
        <div className={`${container} relative flex h-full items-center justify-center pt-10`}>
          <div className="w-full max-w-[1024px] rounded-md bg-black/48 px-4 py-7 text-white shadow-[0_24px_70px_rgba(7,18,32,0.3)] backdrop-blur-sm sm:px-6 lg:px-7">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/75">{pagesContent.home.hero.badge}</p>
            <h1 className="mt-3 text-center text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-[2.7rem]">{heroTitle}</h1>
            <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-6 text-white/90 sm:text-base">{pagesContent.home.hero.description}</p>
            <form action="/search" className="mx-auto mt-5 grid max-w-2xl gap-3 md:grid-cols-[1fr_76px]">
              <label className="flex h-14 items-center rounded-sm bg-white text-[#22456e]">
                <MapPin className="ml-4 h-5 w-5 text-[#2f6fcc]" />
                <input name="category" placeholder="Current category" className="min-w-0 flex-1 px-4 text-sm outline-none placeholder:text-[#6f8097]" />
              </label>
              <button className="inline-flex h-14 items-center justify-center rounded-sm bg-white text-[#2f6fcc] transition hover:bg-[#eaf4ff]" type="submit" aria-label="Search">
                <Search className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
      <div className="border-b border-[#d8e0ea] bg-white">
        <div className={`${container} flex flex-wrap items-center justify-center gap-x-7 gap-y-2 py-3 text-sm`}>
          <span className="font-semibold uppercase text-[#7b8796]">Browse:</span>
          {taskOptions.slice(0, 5).map((task) => <Link key={task.key} href={task.route} className="text-[#1f5eb8] hover:underline">{task.label}</Link>)}
          <Link href="/create" className="text-[#1f5eb8] hover:underline">Add a post</Link>
          <Link href={primaryRoute} className="inline-flex items-center gap-1 text-[#1f5eb8] hover:underline">Latest <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </div>
    </section>
  )
}

export function EditableStoryRail({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = dedupePosts([...posts, ...timeSections.flatMap((section) => section.posts)]).slice(0, 10)
  if (!pool.length) return null
  const rail = [...pool, ...pool]
  return (
    <section className="overflow-hidden bg-[#d8e8fb] py-20">
      <div className={`${container} grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]`}>
        <div className="rounded-md border border-white bg-white p-7 text-center shadow-[0_14px_38px_rgba(31,94,184,0.12)]">
          <h2 className="text-3xl font-extrabold leading-tight text-[#417dcc]">Article & Profile Intelligence</h2>
          <p className="mx-auto mt-4 max-w-md text-lg leading-8 text-[#1d2d44]">Access useful reads, public profiles, and structured discovery across {SITE_CONFIG.name}.</p>
          <Link href={primaryRoute} className="mt-5 inline-flex items-center gap-2 rounded-md border border-[#c8d5e5] bg-white px-5 py-2.5 text-lg font-bold text-[#417dcc] shadow-sm transition hover:-translate-y-0.5">
            <MessageSquare className="h-5 w-5" /> Ask {SITE_CONFIG.name}
          </Link>
        </div>
        <div className="intro-float rotate-[-2deg] overflow-hidden rounded-md border-4 border-[#417dcc] bg-white p-1 shadow-[0_24px_50px_rgba(31,94,184,0.20)]">
          {imageOf(pool[0]) ? <img src={imageOf(pool[0])} alt="" className="aspect-[16/9] w-full object-cover" /> : <div className="aspect-[16/9] bg-[#e5f0ff]" />}
        </div>
      </div>
      <div className="mt-16 overflow-hidden">
        <div className="intro-marquee flex w-max gap-5 px-4">
          {rail.map((post, index) => (
            <MiniRailCard key={`${post.id || post.slug}-${index}`} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

function MiniRailCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className="group flex w-[280px] shrink-0 items-center gap-3 rounded-md border border-[#d8e0ea] bg-white p-3 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <span className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-sm bg-[#e5f0ff]">
        <img src={imageOf(post)} alt="" className="h-full w-full object-cover transition group-hover:scale-105" />
      </span>
      <span className="min-w-0">
        <span className="block text-[11px] font-bold uppercase tracking-[0.14em] text-[#417dcc]">{index % 2 ? 'Profile' : categoryOf(post, 'Article')}</span>
        <span className="mt-1 line-clamp-2 text-sm font-bold leading-snug text-[#16325c]">{post.title}</span>
      </span>
    </Link>
  )
}

export function EditableMagazineSplit({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = dedupePosts([...posts, ...timeSections.flatMap((section) => section.posts)]).slice(0, 9)
  if (!pool.length) return null
  const [featured, ...rest] = pool
  return (
    <section className="bg-white py-20">
      <div className={container}>
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#417dcc]">Major topics</p>
            <h2 className="mt-2 text-3xl font-extrabold text-[#16325c]">Featured reading and profile signals</h2>
          </div>
          <Link href="/search" className="hidden rounded-md border border-[#d8e0ea] px-4 py-2 text-sm font-bold text-[#1f5eb8] hover:bg-[#f2f7fd] sm:inline-flex">Browse more</Link>
        </div>
        <div className="grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
          <FeaturedCard post={featured} href={postHref(primaryTask, featured, primaryRoute)} />
          <div className="grid gap-5">
            {rest.slice(0, 2).map((post, index) => <HorizontalCard key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />)}
          </div>
        </div>
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rest.slice(2, 8).map((post, index) => index % 3 === 0
            ? <ImageFirstCard key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} />
            : <CompactCard key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />)}
        </div>
      </div>
    </section>
  )
}

function FeaturedCard({ post, href }: { post: SitePost; href: string }) {
  return (
    <Link href={href} className="group relative min-h-[390px] overflow-hidden rounded-md border border-[#d8e0ea] bg-[#16325c] shadow-[0_24px_60px_rgba(22,50,92,0.18)]">
      <img src={imageOf(post)} alt="" className="absolute inset-0 h-full w-full object-cover opacity-70 transition duration-700 group-hover:scale-105" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,37,62,0.15),rgba(18,37,62,0.86))]" />
      <div className="absolute inset-x-0 bottom-0 p-7 text-white">
        <span className="rounded-sm bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.15em] text-[#2f6fcc]">Featured</span>
        <h3 className="mt-4 max-w-2xl text-3xl font-extrabold leading-tight sm:text-4xl">{post.title}</h3>
        <p className="mt-3 line-clamp-2 max-w-xl text-sm leading-6 text-white/85">{excerptOf(post, 170)}</p>
      </div>
    </Link>
  )
}

function HorizontalCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className="group grid min-h-[185px] grid-cols-[112px_1fr] overflow-hidden rounded-md border border-[#d8e0ea] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <img src={imageOf(post)} alt="" className="h-full w-full object-cover transition group-hover:scale-105" />
      <span className="p-5">
        <span className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#417dcc]">US {String(index + 1).padStart(2, '0')}</span>
        <span className="mt-2 block line-clamp-3 text-xl font-extrabold leading-tight text-[#16325c]">{post.title}</span>
        <span className="mt-2 block line-clamp-2 text-sm leading-6 text-[#6f8097]">{excerptOf(post, 95)}</span>
      </span>
    </Link>
  )
}

function CompactCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className="group rounded-md border border-[#d8e0ea] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <span className="flex items-start gap-4">
        <span className="text-2xl font-extrabold text-[#1f5eb8]">{index % 2 ? 'IN' : 'GB'}</span>
        <span className="min-w-0">
          <span className="block line-clamp-2 text-lg font-extrabold leading-tight text-[#16325c]">{post.title}</span>
          <span className="mt-1 block text-xs text-[#8b9bb1]">{categoryOf(post, 'Article')}</span>
          <RatingRow post={post} />
        </span>
      </span>
    </Link>
  )
}

function ImageFirstCard({ post, href }: { post: SitePost; href: string }) {
  return (
    <Link href={href} className="group overflow-hidden rounded-md border border-[#d8e0ea] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="aspect-[16/10] overflow-hidden bg-[#e5f0ff]">
        <img src={imageOf(post)} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
      </div>
      <div className="p-5">
        <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#417dcc]">{categoryOf(post, 'Featured')}</p>
        <h3 className="mt-2 line-clamp-2 text-xl font-extrabold leading-tight text-[#16325c]">{post.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#6f8097]">{excerptOf(post, 105)}</p>
      </div>
    </Link>
  )
}

export function EditableTimeCollections({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const source = timeSections.length ? timeSections : [{ key: 'latest', posts, href: primaryRoute }]
  const pool = dedupePosts(source.flatMap((section) => section.posts)).slice(0, 20)
  if (!pool.length) return null
  const cities = pool.slice(0, 20)
  return (
    <section className="bg-white py-20">
      <div className={container}>
        <BoxedDirectory title="Major Reads" icon={<MapPin className="h-9 w-9 text-[#417dcc]" />}>
          {cities.map((post, index) => (
            <DirectoryItem key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} code={['US', 'CA', 'IN', 'GB', 'PH', 'BR'][index % 6]} />
          ))}
        </BoxedDirectory>
      </div>
    </section>
  )
}

function BoxedDirectory({ title, icon, children }: { title: string; icon: ReactNode; children: ReactNode }) {
  return (
    <div className="relative rounded-md border-2 border-[#e5e8ec] bg-white px-5 pb-6 pt-9">
      <h2 className="absolute -top-7 left-8 flex items-center gap-2 bg-white px-3 text-2xl font-extrabold text-[#417dcc]">{icon} {title}</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">{children}</div>
    </div>
  )
}

function DirectoryItem({ post, href, code }: { post: SitePost; href: string; code: string }) {
  return (
    <Link href={href} className="rounded-sm border border-[#cfd8e5] bg-[#fbfcff] px-3 py-2 transition hover:border-[#417dcc] hover:bg-[#eef6ff]">
      <span className="flex items-center gap-2">
        <span className="text-2xl font-extrabold text-[#1f5eb8]">{code}</span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-semibold text-[#0b55b5]">{post.title}</span>
          <span className="block truncate text-xs text-[#8b9bb1]">{categoryOf(post, 'Article')}</span>
        </span>
      </span>
    </Link>
  )
}

export function EditableHomeCta() {
  return (
    <section className="bg-[#f2f7fd] py-20">
      <div className={`${container} grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]`}>
        <div className="intro-float order-2 rounded-md border-4 border-[#8a1f9b] bg-white p-2 shadow-[0_24px_50px_rgba(31,94,184,0.16)] lg:order-1">
          <div className="grid grid-cols-5 gap-2 p-5">
            {Array.from({ length: 15 }).map((_, index) => <span key={index} className="aspect-square rounded-full bg-[#d8e8fb]" />)}
          </div>
        </div>
        <div className="order-1 rounded-[1.5rem] bg-[#d8e8fb] p-8 text-center lg:order-2">
          <h2 className="text-3xl font-extrabold text-[#417dcc]">Manage Your Free Listing!</h2>
          <p className="mx-auto mt-4 max-w-lg text-lg leading-8 text-[#1d2d44]">Create articles, publish profiles, and keep your public information easier to discover on {SITE_CONFIG.name}.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/create" className="rounded-md bg-[#417dcc] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5">Create</Link>
            <Link href="/contact" className="rounded-md border border-[#417dcc] bg-white px-6 py-3 text-sm font-bold text-[#417dcc] transition hover:-translate-y-0.5">Contact</Link>
          </div>
        </div>
      </div>
    </section>
  )
}

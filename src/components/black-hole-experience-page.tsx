import { useEffect, useState } from 'react'
import { BlackHoleHeroSection } from './ui/blackhole-hero-section'
import { TestimonialCarousel, type Testimonial } from './ui/testimonial'
import johnMichellPortrait from '../assets/scientists/john-michell.svg'
import karlSchwarzschildPortrait from '../assets/scientists/karl-schwarzschild.svg'
import rogerPenrosePortrait from '../assets/scientists/roger-penrose.svg'
import stephenHawkingPortrait from '../assets/scientists/stephen-hawking.svg'
import kipThornePortrait from '../assets/scientists/kip-thorne.svg'
import andreaGhezPortrait from '../assets/scientists/andrea-ghez.svg'

const BLACK_HOLE_FACTS: Testimonial[] = [
  {
    id: 1,
    name: 'جان میچل',
    role: '«ستاره‌های تاریک» · ۱۷۸۳',
    avatar: johnMichellPortrait,
    description: 'پیش از تولد نسبیت، از اجرامی گفت آن‌قدر چگال که نور هم نمی‌تواند از گرانش آن‌ها فرار کند؛ او این اجرام را «ستاره‌های تاریک» نامید.',
    source: { label: 'انجمن فیزیک آمریکا', href: 'https://www.aps.org/apsnews/2009/11/1783-john-michell-black-holes' },
  },
  {
    id: 2,
    name: 'کارل شوارتزشیلد',
    role: 'نخستین جواب دقیق · ۱۹۱۵ / ۱۹۱۶',
    avatar: karlSchwarzschildPortrait,
    description: 'نخستین جواب دقیق معادلات اینشتین برای جرمی کروی و بدون چرخش را پیدا کرد؛ «شعاع شوارتزشیلد» از همین راه‌حل می‌آید.',
    source: { label: 'دانشنامهٔ اخترشناسی', href: 'https://commons.wikimedia.org/wiki/File:Karl_schwarzschild.portrait.jpg' },
  },
  {
    id: 3,
    name: 'راجر پنروز',
    role: 'قضیهٔ تکینگی · ۱۹۶۵',
    avatar: rogerPenrosePortrait,
    description: 'قضیهٔ تکینگی او نشان داد فروپاشی گرانشی می‌تواند به ناحیه‌ای برسد که توصیف کلاسیک فضاـزمان در آن از کار می‌افتد.',
    source: { label: 'نشریهٔ مرور فیزیک', href: 'https://journals.aps.org/prl/abstract/10.1103/PhysRevLett.14.57' },
  },
  {
    id: 4,
    name: 'استیفن هاوکینگ',
    role: 'تابش هاوکینگ · ۱۹۷۴',
    avatar: stephenHawkingPortrait,
    description: 'نشان داد سیاه‌چاله‌ها کاملاً سیاه نیستند: اثرهای کوانتومی تابشی بسیار ضعیف می‌سازند و در بلندمدت از جرم سیاه‌چاله کم می‌کنند.',
    source: { label: 'آثار استیفن هاوکینگ', href: 'https://www.hawking.org.uk/in-print' },
  },
  {
    id: 5,
    name: 'کیپ تورن',
    role: 'ادغام سیاه‌چاله‌ها · ۲۰۱۵',
    avatar: kipThornePortrait,
    description: 'مدل‌های نسبیت عددی برای ادغام سیاه‌چاله‌ها کمک کردند سیگنال نخستین برخورد ثبت‌شده توسط لایگو با پیش‌بینی‌ها تطبیق داده شود.',
    source: { label: 'رصدخانهٔ لایگو', href: 'https://ligo.org/detections/gw150914/' },
  },
  {
    id: 6,
    name: 'آندریا گِز',
    role: 'مرکز راه شیری · از ۱۹۹۰ تا امروز',
    avatar: andreaGhezPortrait,
    description: 'با دنبال‌کردن مدار ستاره‌های نزدیک مرکز راه شیری، شواهدی بسیار قوی برای وجود سیاه‌چالهٔ کلان‌جرم «کمان ای» فراهم کرد.',
    source: { label: 'مرکز کهکشان UCLA', href: 'https://www.astro.ucla.edu/~ghezgroup/gc_edit/currentMay22/about.html' },
  },
]

const BLACK_HOLE_PARTS = [
  { number: '۰۱', title: 'افق رویداد', description: 'مرزی نامرئی که بعد از عبور از آن، هیچ پیام یا نوری نمی‌تواند به بیرون برگردد.', icon: 'horizon' },
  { number: '۰۲', title: 'قرص برافزایشی', description: 'حلقه‌ای از گاز و غبار داغ که هنگام چرخش به دور سیاه‌چاله می‌درخشد و خم می‌شود.', icon: 'disk' },
  { number: '۰۳', title: 'سایه', description: 'ناحیهٔ تاریک مرکزی؛ تصویری از مسیرهایی که گرانش شدید، نور را از آن‌ها دور کرده است.', icon: 'shadow' },
]

function PartIcon({ type }: { type: string }) {
  if (type === 'disk') {
    return (
      <svg aria-hidden="true" viewBox="0 0 32 32" className="h-7 w-7" fill="none">
        <ellipse cx="16" cy="16" rx="12" ry="5" stroke="currentColor" strokeWidth="1.5" />
        <ellipse cx="16" cy="16" rx="5" ry="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M4 16c2 6 8 9 12 9s10-3 12-9" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    )
  }

  if (type === 'shadow') {
    return (
      <svg aria-hidden="true" viewBox="0 0 32 32" className="h-7 w-7" fill="none">
        <circle cx="16" cy="16" r="11" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 3" />
        <circle cx="16" cy="16" r="5" fill="currentColor" />
      </svg>
    )
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 32 32" className="h-7 w-7" fill="none">
      <circle cx="16" cy="16" r="10" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="16" cy="16" r="5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M16 3v5m0 16v5M3 16h5m16 0h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function useNarrow(query = '(max-width: 767px)') {
  const [narrow, setNarrow] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia(query)
    const sync = () => setNarrow(mediaQuery.matches)

    sync()
    mediaQuery.addEventListener('change', sync)

    return () => mediaQuery.removeEventListener('change', sync)
  }, [query])

  return narrow
}

function useIntroLoader() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 1250)
    return () => window.clearTimeout(timer)
  }, [])

  return loading
}

export default function BlackHoleExperiencePage() {
  const narrow = useNarrow()
  const loading = useIntroLoader()

  return (
    <main className={`experience-shell min-h-screen bg-black text-white ${loading ? 'is-loading' : 'is-ready'}`} dir="rtl">
      <div className="page-loader" aria-hidden={!loading} aria-live="polite">
        <div className="page-loader__orbit" />
        <p>در حال گشودن پنجره‌ای به کیهان</p>
      </div>

      <a href="#experience" className="sr-only focus:not-sr-only focus:fixed focus:right-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-black">
        رفتن به محتوای اصلی
      </a>

      <section className="relative min-h-[92svh] w-full md:min-h-[720px]" aria-label="معرفی سیاه‌چاله">
        <BlackHoleHeroSection
          focus={narrow ? [0.5, 0.58] : [0.72, 0.46]}
          scrim={narrow ? 'top' : 'right'}
          scrimStrength={0.9}
          distance={narrow ? 28 : 24}
          elevation={narrow ? -10 : -5.5}
          fov={narrow ? 70 : 42}
          glow={narrow ? 0.85 : 1}
          steps={narrow ? 200 : 300}
          resolution={narrow ? 0.6 : 0.7}
          maxDpr={narrow ? 1.25 : 1.5}
        >
          <div className="flex h-full min-h-[92svh] items-start px-6 pt-14 sm:px-10 md:min-h-[720px] md:items-center md:pt-0 lg:px-20">
            <div className="max-w-[34rem] text-right">
              <p className="mb-5 font-mono text-[0.65rem] tracking-[0.22em] text-orange-200/65 sm:text-xs">سیاه‌چاله / فصل ۰۱</p>
              <h1 className="text-[2.55rem] font-light leading-[1.12] tracking-[-0.03em] text-white sm:text-6xl lg:text-[4.25rem]">
                جایی که نور،
                <br />
                راه بازگشت ندارد
              </h1>
              <p className="mt-6 max-w-md text-[0.98rem] leading-8 text-white/65 md:mt-7">
                سیاه‌چاله فقط یک تاریکی خالی نیست؛ آزمایشگاهی کیهانی است که در آن گرانش، زمان و نور شکل دیگری پیدا می‌کنند.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3 md:mt-10">
                <a href="#experience" className="cursor-pointer rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition-colors duration-200 hover:bg-orange-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black">سیاه‌چاله را بشناسید</a>
                <a href="#facts" className="cursor-pointer rounded-full border border-white/20 px-6 py-3 text-sm text-white/80 transition-colors duration-200 hover:border-orange-200/60 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black">حقایق جالب</a>
              </div>
            </div>
          </div>
        </BlackHoleHeroSection>
      </section>

      <section id="experience" aria-labelledby="experience-title" className="border-t border-white/10 px-6 py-20 sm:px-10 lg:px-20">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[0.7fr_1.3fr] md:gap-20">
          <div>
            <p className="font-mono text-xs tracking-[0.18em] text-orange-200/60">شناخت / ۰۲</p>
            <p className="mt-5 max-w-xs text-sm leading-7 text-white/45">هر سیاه‌چاله داستانی از فروپاشی، چرخش و خم‌شدن فضاـزمان است.</p>
          </div>
          <div>
            <h2 id="experience-title" className="max-w-3xl text-3xl font-light leading-[1.35] tracking-tight text-white sm:text-5xl">
              سیاه‌چاله چیست؟
              <br />
              <span className="text-white/55">جرمی فشرده با گرانشی فراتر از تصور.</span>
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/55">سیاه‌چاله زمانی شکل می‌گیرد که جرم بسیار زیادی در ناحیه‌ای کوچک فشرده شود. گرانش آن‌قدر قوی می‌شود که مسیر نور را خم می‌کند و یک مرز یک‌طرفه به نام افق رویداد می‌سازد. ما خود سیاه‌چاله را نمی‌بینیم؛ اثرش بر نور، گاز و ستاره‌های اطراف را می‌بینیم.</p>
          </div>
        </div>

        <div className="mx-auto mt-14 grid max-w-7xl gap-4 md:grid-cols-3">
          {BLACK_HOLE_PARTS.map((part) => (
            <article key={part.number} className="info-card rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-6 sm:p-7">
              <div className="flex items-center justify-between text-orange-200/75"><span className="text-xs tracking-[0.2em]">{part.number}</span><PartIcon type={part.icon} /></div>
              <h3 className="mt-12 text-xl font-medium text-white">{part.title}</h3>
              <p className="mt-4 text-sm leading-7 text-white/50">{part.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="facts" lang="fa" aria-labelledby="facts-title" className="relative overflow-hidden border-t border-white/10 bg-[#08070b] px-6 py-20 sm:px-10 lg:px-20">
        <div className="pointer-events-none absolute -left-32 top-16 h-72 w-72 rounded-full bg-orange-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl gap-12 md:grid-cols-[0.85fr_1.15fr] md:items-center md:gap-20">
          <div>
            <p className="mb-5 font-mono text-xs tracking-[0.2em] text-orange-200/60">آرشیو کشف‌ها / ۰۶</p>
            <h2 id="facts-title" className="max-w-md text-3xl font-light leading-[1.35] tracking-tight text-white sm:text-5xl">شش نکتهٔ کوتاه،<br />پشت یک تاریکی عمیق</h2>
            <p className="mt-6 max-w-md text-base leading-8 text-white/50">از «ستارهٔ تاریک» تا نخستین صدای برخورد دو سیاه‌چاله؛ این کشف‌ها نگاه ما به گرانش را عوض کردند.</p>
          </div>
          <TestimonialCarousel testimonials={BLACK_HOLE_FACTS} className="mx-auto w-full max-w-[31rem]" />
        </div>
      </section>

      <footer className="border-t border-white/10 px-6 py-8 text-center text-xs text-white/35 sm:px-10">یک تجربهٔ تعاملی برای نزدیک‌تر شدن به دورترین رازهای کیهان</footer>
    </main>
  )
}

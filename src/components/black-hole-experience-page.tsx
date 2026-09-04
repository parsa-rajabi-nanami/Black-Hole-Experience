import { useEffect, useState } from 'react'
import { BlackHoleHeroSection } from './ui/blackhole-hero-section'
import { TestimonialCarousel, type Testimonial } from './ui/testimonial'

const BLACK_HOLE_FACTS: Testimonial[] = [
  {
    id: 1,
    name: 'جان میچل',
    role: '«ستاره‌های تاریک» · ۱۷۸۳',
    avatar:
      'https://commons.wikimedia.org/wiki/Special:FilePath/John%20Michell%2C%20portrait%20bust%20LCCN2014680670.jpg',
    description:
      'پیش از تولد نسبیت، از اجرامی گفت آن‌قدر چگال که نور هم نمی‌تواند از گرانش آن‌ها فرار کند؛ او این اجرام را «ستاره‌های تاریک» نامید.',
    source: {
      label: 'APS',
      href: 'https://www.aps.org/apsnews/2009/11/1783-john-michell-black-holes',
    },
  },
  {
    id: 2,
    name: 'کارل شوارتزشیلد',
    role: 'اولین جواب دقیق · ۱۹۱۵ / ۱۹۱۶',
    avatar:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Karl%20schwarzschild.portrait.jpg',
    description:
      'نخستین جواب دقیق معادلات اینشتین برای یک جرم کروی و بدون چرخش را پیدا کرد؛ «شعاع شوارتزشیلد» از همین راه‌حل می‌آید.',
    source: {
      label: 'Wikimedia',
      href: 'https://commons.wikimedia.org/wiki/File:Karl_schwarzschild.portrait.jpg',
    },
  },
  {
    id: 3,
    name: 'راجر پنروز',
    role: 'قضیه‌ی تکینگی · ۱۹۶۵',
    avatar:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Roger%20Penrose%201978.jpg',
    description:
      'قضیه‌ی تکینگی او نشان داد فروپاشی گرانشی می‌تواند به ناحیه‌ای برسد که توصیف کلاسیک فضاـزمان در آن از کار می‌افتد.',
    source: {
      label: 'Physical Review Letters',
      href: 'https://journals.aps.org/prl/abstract/10.1103/PhysRevLett.14.57',
    },
  },
  {
    id: 4,
    name: 'استیفن هاوکینگ',
    role: 'تابش هاوکینگ · ۱۹۷۴',
    avatar:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Stephen%20Hawking.StarChild.jpg',
    description:
      'نشان داد سیاه‌چاله‌ها کاملاً سیاه نیستند: اثرهای کوانتومی باعث تابشی بسیار ضعیف می‌شوند و در بلندمدت از جرم سیاه‌چاله کم می‌کنند.',
    source: {
      label: 'Hawking Estate',
      href: 'https://www.hawking.org.uk/in-print',
    },
  },
  {
    id: 5,
    name: 'کیپ تورن',
    role: 'ادغام سیاه‌چاله‌ها · ۲۰۱۵',
    avatar:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Kip%20Thorne%20%2827678302394%29.jpg',
    description:
      'مدل‌های نسبیت عددی برای ادغام سیاه‌چاله‌ها کمک کردند سیگنال نخستین برخوردِ ثبت‌شده توسط LIGO با پیش‌بینی‌ها تطبیق داده شود.',
    source: {
      label: 'LIGO',
      href: 'https://ligo.org/detections/gw150914/',
    },
  },
  {
    id: 6,
    name: 'آندریا گِز',
    role: 'مرکز راه شیری · ۱۹۹۰ تا امروز',
    avatar:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Andrea%20Ghez%20%28cropped%203x4%29.jpg',
    description:
      'با دنبال‌کردن مدار ستاره‌های نزدیک مرکز راه شیری، شواهدی بسیار قوی برای وجود سیاه‌چاله‌ی کلان‌جرمِ Sagittarius A* فراهم کرد.',
    source: {
      label: 'UCLA Galactic Center',
      href: 'https://www.astro.ucla.edu/~ghezgroup/gc_edit/currentMay22/about.html',
    },
  },
]

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

export default function BlackHoleExperiencePage() {
  const narrow = useNarrow()

  return (
    <main className="min-h-screen bg-black text-white">
      <a
        href="#experience"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-black"
      >
        Skip to the experience
      </a>

      <section
        className="relative min-h-[92svh] w-full md:min-h-[720px]"
        aria-label="Black hole introduction"
      >
        <BlackHoleHeroSection
          focus={narrow ? [0.5, 0.76] : [0.72, 0.46]}
          scrim={narrow ? 'top' : 'left'}
          scrimStrength={0.9}
          distance={24}
          elevation={narrow ? -7 : -5.5}
          fov={narrow ? 58 : 42}
          glow={narrow ? 0.85 : 1}
          steps={narrow ? 200 : 300}
          resolution={narrow ? 0.6 : 0.7}
          maxDpr={narrow ? 1.25 : 1.5}
        >
          <div className="flex h-full min-h-[92svh] items-start px-6 pt-14 sm:px-10 md:min-h-[720px] md:items-center md:pt-0 lg:px-20">
            <div className="max-w-[34rem]">
              <p className="mb-5 font-mono text-[0.65rem] uppercase tracking-[0.28em] text-orange-200/65 sm:text-xs">
                Schwarzschild / 01
              </p>
              <h1 className="text-[2.5rem] font-light leading-[1.05] tracking-[-0.03em] text-white sm:text-6xl lg:text-[4.25rem]">
                Light does not
                <br />
                leave here
              </h1>
              <p className="mt-6 max-w-md text-[0.95rem] leading-relaxed text-white/60 md:mt-7">
                The ring above the shadow is the far side of the disc, bent over
                the top. Nothing put it there but gravity.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3 md:mt-10">
                <a
                  href="#experience"
                  className="cursor-pointer rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition-colors duration-200 hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                >
                  Explore the lens
                </a>
                <a
                  href="#maths"
                  className="cursor-pointer rounded-full border border-white/20 px-6 py-3 text-sm text-white/80 transition-colors duration-200 hover:border-white/40 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                >
                  Read the maths
                </a>
              </div>
            </div>
          </div>
        </BlackHoleHeroSection>
      </section>

      <section
        id="experience"
        aria-labelledby="maths"
        className="border-t border-white/10 px-6 py-20 sm:px-10 lg:px-20"
      >
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1fr_2fr] md:gap-20">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-orange-200/60">
            The observable
          </p>
          <div>
            <h2 id="maths" className="max-w-2xl text-3xl font-light tracking-tight text-white sm:text-5xl">
              Gravity turns a flat disc into a story about depth.
            </h2>
            <p className="mt-6 max-w-xl text-base leading-8 text-white/50">
              Every pixel is traced backward through curved space. The halo, the
              hard inner ring, and the shadow are all the same disc seen from
              different paths around the hole.
            </p>
          </div>
        </div>
      </section>

      <section
        id="facts"
        lang="fa"
        dir="rtl"
        aria-labelledby="facts-title"
        className="relative overflow-hidden border-t border-white/10 bg-[#08070b] px-6 py-20 sm:px-10 lg:px-20"
      >
        <div className="pointer-events-none absolute -left-32 top-16 h-72 w-72 rounded-full bg-orange-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="relative mx-auto grid max-w-6xl gap-12 md:grid-cols-[0.85fr_1.15fr] md:items-center md:gap-20">
          <div>
            <p className="mb-5 font-mono text-xs uppercase tracking-[0.24em] text-orange-200/60">
              ARCHIVE / 06
            </p>
            <h2 id="facts-title" className="max-w-md text-3xl font-light leading-tight tracking-tight text-white sm:text-5xl">
              شش نکته‌ی کوتاه،<br />
              پشت یک تاریکی عمیق
            </h2>
            <p className="mt-6 max-w-md text-base leading-8 text-white/50">
              از «ستاره‌ی تاریک» تا نخستین صدای برخورد دو سیاه‌چاله؛ این کشف‌ها نگاه ما به گرانش را عوض کردند.
            </p>
          </div>
          <TestimonialCarousel
            testimonials={BLACK_HOLE_FACTS}
            className="mx-auto max-w-[27rem]"
          />
        </div>
      </section>
    </main>
  )
}

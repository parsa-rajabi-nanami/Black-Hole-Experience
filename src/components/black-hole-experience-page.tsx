import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { useEffect, useRef, useState } from 'react'
import { createHeroEntrance, createScrollStory } from '../animations/black-hole-motion'
import { BlackHoleHeroSection } from './ui/blackhole-hero-section'
import { TestimonialCarousel, type Testimonial } from './ui/testimonial'

gsap.registerPlugin(useGSAP)

const SCIENTIST_IMAGES = {
  andreaGhez: `${import.meta.env.BASE_URL}scientists/andrea-ghez.jpg`,
  johnMichell: `${import.meta.env.BASE_URL}scientists/john-mitchell.jpg`,
  karlSchwarzschild: `${import.meta.env.BASE_URL}scientists/karl-schwarzschild.jpg`,
  kipThorne: `${import.meta.env.BASE_URL}scientists/cape-thorn.jpg`,
  rogerPenrose: `${import.meta.env.BASE_URL}scientists/roger-penrose.jpg`,
  stephenHawking: `${import.meta.env.BASE_URL}scientists/stephen-hawking.jpg`,
} as const

const BLACK_HOLE_FACTS: Testimonial[] = [
  {
    id: 1,
    name: 'John Michell',
    role: '“Dark stars” · 1783',
    avatar: SCIENTIST_IMAGES.johnMichell,
    description: 'Before relativity, he described objects so dense that even light could not escape their gravity. He called them “dark stars.”',
    source: { label: 'American Physical Society', href: 'https://www.aps.org/apsnews/2009/11/1783-john-michell-black-holes' },
  },
  {
    id: 2,
    name: 'Karl Schwarzschild',
    role: 'First exact solution · 1915 / 1916',
    avatar: SCIENTIST_IMAGES.karlSchwarzschild,
    description: 'He found the first exact solution to Einstein’s equations for a spherical, non-rotating body. The Schwarzschild radius comes from this solution.',
    source: { label: 'Astronomy Encyclopedia', href: 'https://commons.wikimedia.org/wiki/File:Karl_schwarzschild.portrait.jpg' },
  },
  {
    id: 3,
    name: 'Roger Penrose',
    role: 'Singularity theorem · 1965',
    avatar: SCIENTIST_IMAGES.rogerPenrose,
    description: 'His singularity theorem showed that gravitational collapse can reach a region where the classical description of spacetime breaks down.',
    source: { label: 'Physical Review Letters', href: 'https://journals.aps.org/prl/abstract/10.1103/PhysRevLett.14.57' },
  },
  {
    id: 4,
    name: 'Stephen Hawking',
    role: 'Hawking radiation · 1974',
    avatar: SCIENTIST_IMAGES.stephenHawking,
    description: 'He showed that black holes are not completely black: quantum effects create faint radiation and gradually reduce their mass over time.',
    source: { label: 'Stephen Hawking Foundation', href: 'https://www.hawking.org.uk/in-print' },
  },
  {
    id: 5,
    name: 'Kip Thorne',
    role: 'Black-hole merger · 2015',
    avatar: SCIENTIST_IMAGES.kipThorne,
    description: 'Numerical-relativity models helped match the first detected black-hole collision recorded by LIGO with theoretical predictions.',
    source: { label: 'LIGO Observatory', href: 'https://ligo.org/detections/gw150914/' },
  },
  {
    id: 6,
    name: 'Andrea Ghez',
    role: 'Milky Way center · 1990–present',
    avatar: SCIENTIST_IMAGES.andreaGhez,
    description: 'By tracking stars orbiting the center of the Milky Way, she provided strong evidence for the supermassive black hole Sagittarius A*.',
    source: { label: 'UCLA Galactic Center', href: 'https://www.astro.ucla.edu/~ghezgroup/gc_edit/currentMay22/about.html' },
  },
]

const BLACK_HOLE_PARTS = [
  { number: '01', title: 'Event horizon', description: 'An invisible boundary beyond which no signal or light can return.', icon: 'horizon' },
  { number: '02', title: 'Accretion disk', description: 'A ring of hot gas and dust that glows and bends as it circles the black hole.', icon: 'disk' },
  { number: '03', title: 'Shadow', description: 'The dark central region shaped by paths from which intense gravity has diverted light.', icon: 'shadow' },
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
    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', sync)
    } else {
      mediaQuery.addListener(sync)
    }

    return () => {
      if (typeof mediaQuery.removeEventListener === 'function') {
        mediaQuery.removeEventListener('change', sync)
      } else {
        mediaQuery.removeListener(sync)
      }
    }
  }, [query])

  return narrow
}

export default function BlackHoleExperiencePage() {
  const narrow = useNarrow()
  const motionScope = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const root = document.documentElement
    let frame = 0
    let pointerX = 0
    let pointerY = 0
    const getCursorTarget = (value: EventTarget | null) => (
      value instanceof Element ? value.closest('a, button, [data-cursor-target]') : null
    )

    const paintCursor = () => {
      root.style.setProperty('--cursor-x', `${pointerX}px`)
      root.style.setProperty('--cursor-y', `${pointerY}px`)
      frame = 0
    }

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType && event.pointerType !== 'mouse') return

      pointerX = event.clientX
      pointerY = event.clientY
      if (!frame) frame = requestAnimationFrame(paintCursor)
    }

    const onPointerOver = (event: PointerEvent) => {
      const target = getCursorTarget(event.target)
      if (target) motionScope.current?.classList.add('has-cursor-target')
    }

    const onPointerOut = (event: PointerEvent) => {
      const nextTarget = getCursorTarget(event.relatedTarget)
      if (!nextTarget) motionScope.current?.classList.remove('has-cursor-target')
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('pointerover', onPointerOver, { passive: true })
    window.addEventListener('pointerout', onPointerOut, { passive: true })

    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerover', onPointerOver)
      window.removeEventListener('pointerout', onPointerOut)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  useEffect(() => {
    const root = document.documentElement
    let frame = 0

    const updateProgress = () => {
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0
      root.style.setProperty('--scroll-progress', `${Math.min(1, Math.max(0, progress))}`)
      frame = 0
    }

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(updateProgress)
    }

    updateProgress()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  useGSAP(() => {
    const scope = motionScope.current
    if (!scope) return undefined

    const media = gsap.matchMedia()
    media.add(
      {
        reduce: '(prefers-reduced-motion: reduce)',
        mobile: '(max-width: 767px)',
      },
      ({ conditions }) => {
        if (conditions?.reduce) return

        createHeroEntrance(scope)
        createScrollStory(scope, Boolean(conditions?.mobile))
      },
    )

    return () => media.revert()
  }, { scope: motionScope })

  return (
    <main ref={motionScope} className="experience-shell min-h-screen bg-black text-white" dir="ltr">
      <div className="scroll-progress" aria-hidden="true"><span /></div>
      <div className="custom-cursor" aria-hidden="true">
        <span className="custom-cursor__ring" />
        <span className="custom-cursor__dot" />
      </div>
      <section className="hero-stage relative min-h-[94svh] w-full md:min-h-[720px]" aria-label="Black hole introduction">
        <BlackHoleHeroSection
          focus={narrow ? [0.5, 0.36] : [0.77, 0.46]}
          scrim={narrow ? 'bottom' : 'left'}
          scrimStrength={0.9}
          distance={narrow ? 30 : 24}
          elevation={narrow ? -8 : -5.5}
          fov={narrow ? 68 : 42}
          glow={narrow ? 0.85 : 1}
          steps={narrow ? 180 : 300}
          resolution={narrow ? 0.56 : 0.7}
          maxDpr={narrow ? 1.25 : 1.5}
        >
          <div className="hero-content absolute inset-y-0 left-0 z-10 flex w-full items-center">
            <div className="hero-content__inner max-w-[35rem] text-left">
              <p className="hero-kicker mb-5 font-mono text-[0.65rem] tracking-[0.22em] text-orange-200/65 sm:text-xs">BLACK HOLE / CHAPTER 01</p>
              <h1 className="hero-title text-left text-[2.55rem] font-light leading-[1.12] tracking-[-0.03em] text-white sm:text-6xl lg:text-[4.25rem]">
                Where light
                <br />
                finds no way back
              </h1>
              <p className="hero-description mt-6 max-w-md text-[0.98rem] leading-8 text-white/65 md:mt-7">
                A black hole is more than empty darkness. It is a cosmic laboratory where gravity, time, and light take on a different form.
              </p>
              <div className="hero-actions mt-8 flex flex-wrap items-center gap-3 md:mt-10">
                <a href="#experience" className="cursor-pointer rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition-colors duration-200 hover:bg-orange-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black">Explore the black hole</a>
                <a href="#facts" className="cursor-pointer rounded-full border border-white/20 px-6 py-3 text-sm text-white/80 transition-colors duration-200 hover:border-orange-200/60 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black">Discover the facts</a>
              </div>
            </div>
          </div>
          <a href="#experience" className="hero-scroll-cue absolute bottom-7 left-6 z-10 hidden items-center gap-3 text-[0.65rem] tracking-[0.16em] text-white/45 transition-colors duration-300 hover:text-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-200 sm:flex sm:left-10 lg:left-20" aria-label="Scroll to continue">
            <span className="h-px w-10 bg-white/25" />
            Continue the experience
          </a>
        </BlackHoleHeroSection>
      </section>

      <section id="experience" aria-labelledby="experience-title" className="story-section border-t border-white/10 px-6 py-24 sm:px-10 lg:px-20 lg:py-32">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[0.7fr_1.3fr] md:gap-20">
          <div data-reveal>
            <p className="font-mono text-xs tracking-[0.18em] text-orange-200/60">UNDERSTANDING / 02</p>
            <p className="mt-5 max-w-xs text-sm leading-7 text-white/45">Every black hole is a story of collapse, rotation, and curved spacetime.</p>
          </div>
          <div data-reveal>
            <h2 id="experience-title" className="max-w-3xl text-3xl font-light leading-[1.35] tracking-tight text-white sm:text-5xl">
              What is a black hole?
              <br />
              <span className="text-white/55">A compact object with gravity beyond imagination.</span>
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/55">A black hole forms when a great deal of mass is compressed into a small region. Its gravity becomes so strong that it bends light and creates a one-way boundary called the event horizon. We cannot see the black hole itself; we see its effect on nearby light, gas, and stars.</p>
          </div>
        </div>

        <div className="mx-auto mt-14 grid max-w-7xl gap-4 md:grid-cols-3">
          {BLACK_HOLE_PARTS.map((part) => (
            <article key={part.number} data-reveal className="info-card rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-6 sm:p-7">
              <div className="info-card__icon flex items-center justify-between text-orange-200/75"><span className="text-xs tracking-[0.2em]">{part.number}</span><PartIcon type={part.icon} /></div>
              <h3 className="mt-12 text-xl font-medium text-white">{part.title}</h3>
              <p className="mt-4 text-sm leading-7 text-white/50">{part.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="facts" lang="en" aria-labelledby="facts-title" className="story-section relative overflow-hidden border-t border-white/10 bg-[#08070b] px-6 py-24 sm:px-10 lg:px-20 lg:py-32">
        <div className="facts-ambient pointer-events-none absolute -left-32 top-16 h-72 w-72 rounded-full bg-orange-500/10 blur-3xl" aria-hidden="true" />
        <div className="facts-ambient pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-violet-500/10 blur-3xl" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl">
          <div data-reveal className="mx-auto mb-8 max-w-[31rem]">
            <p className="font-mono text-xs tracking-[0.18em] text-orange-200/60">ARCHIVE / 03</p>
            <h2 id="facts-title" className="mt-4 text-3xl font-light tracking-tight text-white sm:text-5xl">The minds behind the mystery</h2>
            <p className="mt-4 text-sm leading-7 text-white/50">A short archive of the people who changed what we know about black holes.</p>
          </div>
          <div data-reveal className="flex justify-center">
            <TestimonialCarousel
              testimonials={BLACK_HOLE_FACTS}
              ariaLabel="Scientific fact archive"
              itemLabel="Archive item"
              className="w-full max-w-[31rem]"
            />
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 px-6 py-8 text-center text-xs text-white/35 sm:px-10">An interactive experience for getting closer to the universe’s most distant mysteries.</footer>
    </main>
  )
}

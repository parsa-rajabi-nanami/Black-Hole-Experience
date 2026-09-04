import * as React from 'react'

export interface Testimonial {
  id: number | string
  name: string
  avatar: string
  description: string
  role?: string
  source?: {
    label: string
    href: string
  }
}

interface TestimonialCarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  testimonials: Testimonial[]
  showDots?: boolean
}

function useReducedMotion() {
  const [reduced, setReduced] = React.useState(false)

  React.useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduced(query.matches)

    sync()
    query.addEventListener('change', sync)

    return () => query.removeEventListener('change', sync)
  }, [])

  return reduced
}

function Avatar({ name, src }: { name: string; src: string }) {
  const [failed, setFailed] = React.useState(false)

  if (failed) {
    return (
      <span
        className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-orange-200/10 text-xl text-orange-100"
        role="img"
        aria-label={`پرتره ${name}`}
      >
        {name.slice(0, 1)}
      </span>
    )
  }

  return (
    <img
      src={src}
      alt={`پرتره ${name}`}
      width="64"
      height="64"
      className="h-16 w-16 shrink-0 rounded-2xl border border-white/20 object-cover grayscale-[0.15]"
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
    />
  )
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value))

const TestimonialCarousel = React.forwardRef<
  HTMLDivElement,
  TestimonialCarouselProps
>(
  (
      {
        className = '',
        testimonials,
        showDots = true,
        ...props
    },
    ref,
  ) => {
    const [currentIndex, setCurrentIndex] = React.useState(0)
    const [dragX, setDragX] = React.useState(0)
    const [exitX, setExitX] = React.useState(0)
    const [isDragging, setIsDragging] = React.useState(false)
    const [isExiting, setIsExiting] = React.useState(false)
    const transitionTimer = React.useRef<number | null>(null)
    const pointerStart = React.useRef<number | null>(null)
    const dragOffset = React.useRef(0)
    const shouldReduceMotion = useReducedMotion()

    React.useEffect(() => {
      return () => {
        if (transitionTimer.current) window.clearTimeout(transitionTimer.current)
      }
    }, [])

    if (!testimonials.length) return null

    const clearTransition = () => {
      if (transitionTimer.current) {
        window.clearTimeout(transitionTimer.current)
        transitionTimer.current = null
      }
    }

    const moveTo = (nextIndex: number, direction: number) => {
      if (isExiting) return

      clearTransition()
      setExitX(direction * 360)
      setIsExiting(true)

      const finish = () => {
        setCurrentIndex((nextIndex + testimonials.length) % testimonials.length)
        setExitX(0)
        setDragX(0)
        dragOffset.current = 0
        setIsExiting(false)
      }

      if (shouldReduceMotion) {
        finish()
      } else {
        transitionTimer.current = window.setTimeout(finish, 180)
      }
    }

    const handlePointerDown = (event: React.PointerEvent<HTMLElement>) => {
      if (isExiting) return

      pointerStart.current = event.clientX
      dragOffset.current = 0
      setDragX(0)
      setIsDragging(true)
      event.currentTarget.setPointerCapture(event.pointerId)
    }

    const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
      if (pointerStart.current === null || isExiting) return

      const offset = clamp(event.clientX - pointerStart.current, -180, 180)
      dragOffset.current = offset
      setDragX(offset)
    }

    const handlePointerEnd = (event: React.PointerEvent<HTMLElement>) => {
      if (pointerStart.current === null) return

      const offset = dragOffset.current
      pointerStart.current = null
      setIsDragging(false)

      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId)
      }

      if (Math.abs(offset) >= 80) {
        moveTo(currentIndex + (offset < 0 ? 1 : -1), offset < 0 ? -1 : 1)
      } else {
        dragOffset.current = 0
        setDragX(0)
      }
    }

    const handleTabKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
      let nextIndex: number | null = null

      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = index - 1
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = index + 1
      if (event.key === 'Home') nextIndex = 0
      if (event.key === 'End') nextIndex = testimonials.length - 1

      if (nextIndex === null) return

      event.preventDefault()
      const normalized = (nextIndex + testimonials.length) % testimonials.length
      const button = event.currentTarget.parentElement?.querySelector<HTMLButtonElement>(
        `[data-fact-index="${normalized}"]`,
      )
      button?.focus()
      if (normalized !== currentIndex) {
        moveTo(normalized, normalized > currentIndex ? -1 : 1)
      }
    }

    return (
      <div
        ref={ref}
        className={`flex w-full flex-col items-center justify-center ${className}`}
        role="region"
        aria-roledescription="چرخ‌وفلک"
        aria-label="آرشیو نکته‌های علمی"
        {...props}
      >
        <div className="relative h-[28rem] w-full max-w-[31rem] sm:h-[29rem]">
          {testimonials.map((testimonial, index) => {
            const isCurrentCard = index === currentIndex
            const isPrevCard = index === (currentIndex + 1) % testimonials.length
            const isNextCard = index === (currentIndex + 2) % testimonials.length

            if (!isCurrentCard && !isPrevCard && !isNextCard) return null

            const transform = isCurrentCard
              ? `translate3d(${isExiting ? exitX : dragX}px, 0, 0) rotate(${(isExiting ? exitX : dragX) / 24}deg)`
              : `translate3d(0, ${isPrevCard ? 10 : 20}px, 0) rotate(${isPrevCard ? -2 : -4}deg) scale(${isPrevCard ? 0.95 : 0.9})`
            const opacity = isCurrentCard ? 1 : isPrevCard ? 0.58 : 0.28

            return (
              <article
                key={`${testimonial.id}-${isCurrentCard ? 'current' : index}`}
                id={isCurrentCard ? 'facts-carousel-panel' : undefined}
                role={isCurrentCard ? 'tabpanel' : undefined}
                aria-labelledby={isCurrentCard ? `fact-tab-${testimonial.id}` : undefined}
                aria-hidden={!isCurrentCard}
                aria-live={isCurrentCard ? 'polite' : 'off'}
                className="absolute inset-0 flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#111016] text-right shadow-[0_24px_80px_rgba(0,0,0,0.45)]"
                style={{
                  zIndex: isCurrentCard ? 3 : isPrevCard ? 2 : 1,
                  transform,
                  opacity,
                  transition: isDragging || shouldReduceMotion ? 'none' : 'transform 180ms ease, opacity 180ms ease',
                  touchAction: isCurrentCard ? 'pan-y' : undefined,
                }}
                onPointerDown={isCurrentCard ? handlePointerDown : undefined}
                onPointerMove={isCurrentCard ? handlePointerMove : undefined}
                onPointerUp={isCurrentCard ? handlePointerEnd : undefined}
                onPointerCancel={isCurrentCard ? handlePointerEnd : undefined}
              >
                <div className="absolute inset-x-0 top-0 h-32 bg-[radial-gradient(circle_at_82%_10%,rgba(248,134,65,0.28),transparent_68%)]" />

                <div className="relative flex h-full flex-col p-5 sm:p-8">
                  <div className="mb-7 flex items-center justify-between gap-4 text-[0.65rem] font-medium tracking-[0.2em] text-orange-200/60">
                    <span>نکته {String(index + 1).padStart(2, '0')}</span>
                    <span className="h-px flex-1 bg-white/10" />
                    <span aria-hidden="true" className="h-2 w-2 rounded-full bg-orange-300 shadow-[0_0_16px_rgba(253,186,116,0.9)]" />
                  </div>

                  <div className="flex items-center gap-4">
                    <Avatar name={testimonial.name} src={testimonial.avatar} />
                    <div>
                      <p className="mb-1 text-xs text-orange-200/60">{testimonial.role}</p>
                      <h3 className="text-xl font-medium tracking-tight text-white">{testimonial.name}</h3>
                    </div>
                  </div>

                  <p className="mt-7 text-[1.04rem] leading-8 text-white/80 sm:text-[1.1rem] sm:leading-9">{testimonial.description}</p>

                  <div className="mt-auto flex items-end justify-between gap-4 border-t border-white/10 pt-5 text-xs text-white/35">
                    <span>سیاه‌چاله‌ها، از زاویه‌ی علم</span>
                    {isCurrentCard && testimonial.source && (
                      <a
                        href={testimonial.source.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 text-orange-200/70 underline decoration-orange-200/30 underline-offset-4 transition-colors duration-200 hover:text-orange-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-200"
                      >
                        {testimonial.source.label}
                      </a>
                    )}
                  </div>
                </div>

              </article>
            )
          })}
        </div>

        {showDots && (
          <div
            className="mt-6 flex items-center justify-center gap-2"
            role="tablist"
            aria-label="انتخاب نکته علمی"
            aria-orientation="horizontal"
          >
            {testimonials.map((testimonial, index) => (
              <button
                key={testimonial.id}
                id={`fact-tab-${testimonial.id}`}
                type="button"
                role="tab"
                data-fact-index={index}
                aria-label={`نمایش نکته ${index + 1}`}
                aria-controls="facts-carousel-panel"
                aria-selected={index === currentIndex}
                tabIndex={index === currentIndex ? 0 : -1}
                onClick={() => {
                  if (index !== currentIndex) moveTo(index, index > currentIndex ? -1 : 1)
                }}
                onKeyDown={(event) => handleTabKeyDown(event, index)}
                className={`h-2 cursor-pointer rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-200 ${
                  index === currentIndex ? 'w-7 bg-orange-300' : 'w-2 bg-white/20 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    )
  },
)

TestimonialCarousel.displayName = 'TestimonialCarousel'

export { TestimonialCarousel }

import * as React from 'react'
import { motion, useReducedMotion, type PanInfo } from 'framer-motion'
import { cn } from '@/lib/utils'

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

interface TestimonialCarouselProps
  extends React.HTMLAttributes<HTMLDivElement> {
  testimonials: Testimonial[]
  showArrows?: boolean
  showDots?: boolean
  ariaLabel?: string
  itemLabel?: string
}

const CARD_EXIT_DISTANCE = 360

const TestimonialCarousel = React.forwardRef<
  HTMLDivElement,
  TestimonialCarouselProps
>(
  (
    {
      className,
      testimonials,
      showArrows = true,
      showDots = true,
      ariaLabel = 'Testimonials',
      itemLabel = 'Testimonial',
      ...props
    },
    ref,
  ) => {
    const shouldReduceMotion = useReducedMotion()
    const [currentIndex, setCurrentIndex] = React.useState(0)
    const [exitX, setExitX] = React.useState(0)
    const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)
    const activeIndex = Math.min(currentIndex, Math.max(0, testimonials.length - 1))
    const accessibleItemLabel = itemLabel.toLowerCase()

    React.useEffect(() => {
      if (currentIndex >= testimonials.length && testimonials.length > 0) {
        setCurrentIndex(0)
      }
    }, [currentIndex, testimonials.length])

    React.useEffect(() => () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }, [])

    const moveTo = React.useCallback(
      (
        direction: 1 | -1,
        exitDistance = direction === 1 ? -CARD_EXIT_DISTANCE : CARD_EXIT_DISTANCE,
        targetIndex?: number,
      ) => {
        if (!testimonials.length || timerRef.current) return

        setExitX(exitDistance)
        timerRef.current = setTimeout(() => {
          setCurrentIndex((previous) =>
            targetIndex ??
              ((previous + direction + testimonials.length) % testimonials.length),
          )
          setExitX(0)
          timerRef.current = null
        }, 200)
      },
      [testimonials.length],
    )

    const handleDragEnd = (
      _event: MouseEvent | TouchEvent | PointerEvent,
      info: PanInfo,
    ) => {
      if (Math.abs(info.offset.x) <= 100) return

      const direction = info.offset.x < 0 ? 1 : -1
      moveTo(direction, info.offset.x)
    }

    if (!testimonials.length) return null

    return (
      <div
        ref={ref}
        className={cn(
          'flex h-[28rem] w-full items-center justify-center',
          className,
        )}
        {...props}
      >
        <div
          className="relative h-full w-full max-w-[31rem]"
          role="region"
          aria-roledescription="carousel"
          aria-label={ariaLabel}
        >
          <p className="sr-only" aria-live="polite">
            Showing {testimonials[activeIndex].name}, item {activeIndex + 1} of {testimonials.length}
          </p>
          {testimonials.map((testimonial, index) => {
            const isCurrentCard = index === activeIndex
            const isPrevCard =
              index === (activeIndex + 1) % testimonials.length
            const isNextCard =
              index === (activeIndex + 2) % testimonials.length

            if (!isCurrentCard && !isPrevCard && !isNextCard) return null

            return (
              <motion.article
                key={testimonial.id}
                className={cn(
                  'absolute h-full w-full cursor-grab overflow-hidden rounded-[1.75rem] border border-white/10 active:cursor-grabbing',
                  'bg-[#111016] text-white shadow-[0_24px_80px_rgba(0,0,0,0.45)]',
                  isCurrentCard && 'z-30',
                )}
                style={{
                  zIndex: isCurrentCard ? 3 : isPrevCard ? 2 : 1,
                  touchAction: isCurrentCard ? 'pan-y' : 'auto',
                }}
                drag={isCurrentCard ? 'x' : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.7}
                onDragEnd={isCurrentCard ? handleDragEnd : undefined}
                initial={{
                  scale: 0.95,
                  opacity: 0,
                  y: isCurrentCard ? 0 : isPrevCard ? 12 : 23,
                  rotate: isCurrentCard ? 0 : isPrevCard ? -2 : -4,
                }}
                animate={{
                  scale: isCurrentCard ? 1 : isPrevCard ? 0.96 : 0.91,
                  opacity: isCurrentCard ? 1 : isPrevCard ? 0.62 : 0.3,
                  x: isCurrentCard ? exitX : 0,
                  y: isCurrentCard ? 0 : isPrevCard ? 12 : 23,
                  rotate: isCurrentCard ? exitX / 20 : isPrevCard ? -2 : -4,
                }}
                transition={{
                  ...(shouldReduceMotion
                    ? { duration: 0 }
                    : { type: 'spring', stiffness: 300, damping: 20 }),
                }}
                aria-hidden={!isCurrentCard}
              >
                {showArrows && isCurrentCard && (
                  <div className="absolute inset-x-0 top-4 z-10 flex justify-between px-4">
                    <button
                      type="button"
                      aria-label={`Previous ${accessibleItemLabel}`}
                      onClick={() => moveTo(-1)}
                      className="flex h-11 min-w-11 items-center justify-center rounded-full px-2 text-2xl leading-none text-white/30 transition-colors hover:text-orange-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-200"
                    >
                      &larr;
                    </button>
                    <button
                      type="button"
                      aria-label={`Next ${accessibleItemLabel}`}
                      onClick={() => moveTo(1)}
                      className="flex h-11 min-w-11 items-center justify-center rounded-full px-2 text-2xl leading-none text-white/30 transition-colors hover:text-orange-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-200"
                    >
                      &rarr;
                    </button>
                  </div>
                )}

                <div className="relative flex h-full flex-col p-5 sm:p-8">
                  <div className="mt-7 mb-7 flex items-center justify-between gap-4 text-[0.65rem] font-medium tracking-[0.2em] text-orange-200/60">
                    <span>{itemLabel} {String(index + 1).padStart(2, '0')}</span>
                    <span className="h-px flex-1 bg-white/10" />
                    <span
                      aria-hidden="true"
                      className="h-2 w-2 rounded-full bg-orange-300 shadow-[0_0_16px_rgba(253,186,116,0.9)]"
                    />
                  </div>

                  <div className="flex items-center gap-4">
                    <img
                      src={testimonial.avatar}
                      alt={`Portrait of ${testimonial.name}`}
                      width="64"
                      height="64"
                      className="h-16 w-16 shrink-0 rounded-2xl border border-white/20 object-cover grayscale"
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      {testimonial.role && (
                        <p className="mb-1 text-xs text-orange-200/60">
                          {testimonial.role}
                        </p>
                      )}
                      <h3 className="text-xl font-medium tracking-tight text-white">
                        {testimonial.name}
                      </h3>
                    </div>
                  </div>

                  <p className="mt-7 text-[1.04rem] leading-8 text-white/80 sm:text-[1.1rem] sm:leading-9">
                    {testimonial.description}
                  </p>

                  <div className="mt-auto flex items-end justify-between gap-4 border-t border-white/10 pt-5 text-xs text-white/35">
                    <span>Shared experience</span>
                    {isCurrentCard && testimonial.source && (
                      <a
                        href={testimonial.source.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 text-orange-200/70 underline decoration-orange-200/30 underline-offset-4 transition-colors hover:text-orange-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-200"
                      >
                        {testimonial.source.label}
                      </a>
                    )}
                  </div>
                </div>
              </motion.article>
            )
          })}

          {showDots && (
            <div className="absolute -bottom-8 left-0 right-0 flex justify-center gap-2">
              {testimonials.map((testimonial, index) => (
                <button
                  key={testimonial.id}
                  type="button"
                  aria-label={`Show ${accessibleItemLabel} ${index + 1}`}
                  aria-pressed={index === activeIndex}
                  onClick={() => {
                    const difference = index - activeIndex
                    if (difference === 0) return

                    const direction = difference > 0 ? 1 : -1
                    moveTo(direction, undefined, index)
                  }}
                  className="flex h-11 min-w-11 cursor-pointer items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-200"
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      'block rounded-full transition-all',
                      index === activeIndex
                        ? 'h-2 w-7 bg-orange-300'
                        : 'h-2 w-2 bg-white/20 hover:bg-white/50',
                    )}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  },
)

TestimonialCarousel.displayName = 'TestimonialCarousel'

export { TestimonialCarousel }

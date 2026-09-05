import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import * as React from 'react'

gsap.registerPlugin(useGSAP)

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

interface PointerSession {
  id: number
  startX: number
  startY: number
  lastX: number
  lastTime: number
  active: boolean
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
        aria-label={`Portrait of ${name}`}
      >
        {name.slice(0, 1)}
      </span>
    )
  }

  return (
    <img
      src={src}
      alt={`Portrait of ${name}`}
      width="64"
      height="64"
      className="h-16 w-16 shrink-0 rounded-2xl border border-white/20 object-cover grayscale"
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
    />
  )
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value))

const normalizeIndex = (index: number, length: number) =>
  (index + length) % length

function getCardPosition(index: number, currentIndex: number, length: number) {
  const distance = normalizeIndex(index - currentIndex, length)

  if (distance === 0) {
    return { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1, zIndex: 3, visible: true }
  }

  if (distance === 1) {
    return { x: 0, y: 12, scale: 0.96, rotation: -2, opacity: 0.62, zIndex: 2, visible: true }
  }

  if (distance === 2) {
    return { x: 0, y: 23, scale: 0.91, rotation: -4, opacity: 0.3, zIndex: 1, visible: true }
  }

  return { x: 0, y: 28, scale: 0.88, rotation: -5, opacity: 0, zIndex: 0, visible: false }
}

const cardStyle = (position: ReturnType<typeof getCardPosition>) => ({
  '--card-x': `${position.x}px`,
  '--card-y': `${position.y}px`,
  '--card-scale': position.scale,
  '--card-rotation': `${position.rotation}deg`,
  zIndex: position.zIndex,
  opacity: position.opacity,
  visibility: position.visible ? 'visible' : 'hidden',
  pointerEvents: position.visible ? 'auto' : 'none',
} as React.CSSProperties)

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
    const [isDragging, setIsDragging] = React.useState(false)
    const shouldReduceMotion = useReducedMotion()
    const carouselRef = React.useRef<HTMLDivElement | null>(null)
    const cardRefs = React.useRef(new Map<Testimonial['id'], HTMLElement>())
    const currentIndexRef = React.useRef(0)
    const pointerSession = React.useRef<PointerSession | null>(null)
    const dragOffsetRef = React.useRef(0)
    const activeTweenRef = React.useRef<gsap.core.Timeline | null>(null)
    const isAnimatingRef = React.useRef(false)
    useGSAP(() => () => {
      activeTweenRef.current?.kill()
      activeTweenRef.current = null
      isAnimatingRef.current = false
    }, { scope: carouselRef })

    React.useEffect(() => {
      currentIndexRef.current = currentIndex
    }, [currentIndex])

    React.useEffect(() => {
      if (!testimonials.length) return

      const normalized = normalizeIndex(currentIndexRef.current, testimonials.length)
      if (normalized !== currentIndexRef.current) {
        currentIndexRef.current = normalized
        setCurrentIndex(normalized)
      }
    }, [testimonials.length])

    const snapBack = () => {
      const currentCard = cardRefs.current.get(testimonials[currentIndexRef.current]?.id)
      if (!currentCard) return

      gsap.killTweensOf(currentCard)
      gsap.to(currentCard, {
        x: 0,
        rotation: 0,
        duration: shouldReduceMotion ? 0 : 0.32,
        ease: 'power3.out',
        overwrite: true,
        onComplete: () => {
          currentCard.style.setProperty('--card-x', '0px')
          currentCard.style.setProperty('--card-rotation', '0deg')
          currentCard.style.removeProperty('transform')
        },
      })
      dragOffsetRef.current = 0
    }

    const snapTo = (requestedIndex: number, exitSign: number) => {
      if (!testimonials.length || isAnimatingRef.current) return

      const fromIndex = currentIndexRef.current
      const nextIndex = normalizeIndex(requestedIndex, testimonials.length)
      if (nextIndex === fromIndex) {
        snapBack()
        return
      }

      const currentCard = cardRefs.current.get(testimonials[fromIndex]?.id)
      const nextCard = cardRefs.current.get(testimonials[nextIndex]?.id)
      if (!currentCard || !nextCard) {
        snapBack()
        return
      }

      activeTweenRef.current?.kill()
      gsap.killTweensOf([currentCard, nextCard])
      isAnimatingRef.current = true
      currentIndexRef.current = nextIndex

      const distance = Math.max(320, carouselRef.current?.getBoundingClientRect().width ?? 420)
      const incomingStartX = exitSign < 0 ? distance * 0.09 : -distance * 0.09

      gsap.set(currentCard, {
        x: dragOffsetRef.current,
        y: 0,
        scale: 1,
        rotation: dragOffsetRef.current / 24,
        autoAlpha: 1,
        visibility: 'visible',
      })
      gsap.set(nextCard, {
        x: incomingStartX,
        y: 12,
        scale: 0.96,
        rotation: exitSign < 0 ? 2 : -2,
        autoAlpha: 0.62,
        visibility: 'visible',
      })

      if (shouldReduceMotion) {
        setCurrentIndex(nextIndex)
        gsap.set([currentCard, nextCard], { clearProps: 'transform' })
        isAnimatingRef.current = false
        dragOffsetRef.current = 0
        return
      }

      activeTweenRef.current = gsap.timeline({
        defaults: { overwrite: 'auto' },
        onComplete: () => {
          setCurrentIndex(nextIndex)
          gsap.set([currentCard, nextCard], { clearProps: 'transform' })
          activeTweenRef.current = null
          isAnimatingRef.current = false
          dragOffsetRef.current = 0
        },
      })
        .to(currentCard, {
          x: exitSign * distance,
          rotation: exitSign * 11,
          autoAlpha: 0,
          duration: 0.34,
          ease: 'power3.in',
        }, 0)
        .to(nextCard, {
          x: 0,
          y: 0,
          scale: 1,
          rotation: 0,
          autoAlpha: 1,
          duration: 0.42,
          ease: 'power3.out',
        }, 0.03)
    }

    const releasePointer = (event: React.PointerEvent<HTMLElement>) => {
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId)
      }
    }

    const cancelPointer = (event: React.PointerEvent<HTMLElement>) => {
      releasePointer(event)
      pointerSession.current = null
      dragOffsetRef.current = 0
      setIsDragging(false)
    }

    const handlePointerDown = (event: React.PointerEvent<HTMLElement>) => {
      if (isAnimatingRef.current) return
      if (event.target instanceof HTMLElement && event.target.closest('a, button')) return

      pointerSession.current = {
        id: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        lastX: event.clientX,
        lastTime: event.timeStamp,
        active: false,
      }
    }

    const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
      const session = pointerSession.current
      if (!session || session.id !== event.pointerId || isAnimatingRef.current) return

      const deltaX = event.clientX - session.startX
      const deltaY = event.clientY - session.startY
      if (!session.active && Math.abs(deltaY) > 8 && Math.abs(deltaY) > Math.abs(deltaX) * 1.1) {
        cancelPointer(event)
        return
      }

      if (!session.active && Math.abs(deltaX) < 6) return

      if (!session.active) {
        session.active = true
        event.currentTarget.setPointerCapture(event.pointerId)
        setIsDragging(true)
      }

      event.preventDefault()
      const now = event.timeStamp
      const previousX = session.lastX
      const elapsed = Math.max(1, now - session.lastTime)
      session.lastX = event.clientX
      session.lastTime = now
      const velocity = (event.clientX - previousX) / elapsed
      const currentCard = cardRefs.current.get(testimonials[currentIndexRef.current]?.id)
      if (!currentCard) return

      const width = carouselRef.current?.getBoundingClientRect().width ?? 420
      const offset = clamp(deltaX, -width * 0.92, width * 0.92)
      dragOffsetRef.current = offset
      currentCard.style.setProperty('--card-x', `${offset}px`)
      currentCard.style.setProperty('--card-rotation', `${offset / 24}deg`)
      currentCard.dataset.velocity = String(velocity)
    }

    const handlePointerEnd = (event: React.PointerEvent<HTMLElement>) => {
      const session = pointerSession.current
      if (!session || session.id !== event.pointerId) return

      const offset = dragOffsetRef.current
      const velocity = Number(event.currentTarget.dataset.velocity || 0)
      releasePointer(event)
      pointerSession.current = null
      setIsDragging(false)

      if (!session.active) return

      const width = carouselRef.current?.getBoundingClientRect().width ?? 420
      const passedThreshold = Math.abs(offset) > Math.max(64, width * 0.18)
      const flicked = Math.abs(velocity) > 0.45 && Math.abs(offset) > 24
      if (!passedThreshold && !flicked) {
        snapBack()
        return
      }

      const nextIndex = currentIndexRef.current + (offset < 0 ? 1 : -1)
      snapTo(nextIndex, offset < 0 ? -1 : 1)
    }

    const handleTabKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
      let nextIndex: number | null = null
      let exitSign = -1

      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
        nextIndex = index - 1
        exitSign = 1
      }
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
        nextIndex = index + 1
        exitSign = -1
      }
      if (event.key === 'Home') {
        nextIndex = 0
        exitSign = index === 0 ? -1 : 1
      }
      if (event.key === 'End') {
        nextIndex = testimonials.length - 1
        exitSign = -1
      }

      if (nextIndex === null) return

      event.preventDefault()
      const normalized = normalizeIndex(nextIndex, testimonials.length)
      const button = event.currentTarget.parentElement?.querySelector<HTMLButtonElement>(
        `[data-fact-index="${normalized}"]`,
      )
      button?.focus()
      if (normalized !== currentIndexRef.current) snapTo(normalized, exitSign)
    }

    if (!testimonials.length) return null

    return (
      <div
        ref={(element) => {
          carouselRef.current = element
          if (typeof ref === 'function') ref(element)
          else if (ref) ref.current = element
        }}
        className={`flex w-full flex-col items-center justify-center ${className}`}
        role="region"
        aria-roledescription="carousel"
        aria-label="Scientific fact archive"
        {...props}
      >
        <p className="sr-only" id="facts-carousel-instructions">
          Drag the active fact horizontally to move between cards. Vertical swipes continue page scrolling. Use the fact buttons below for keyboard navigation.
        </p>
        <div className="relative h-[28rem] w-full max-w-[31rem] sm:h-[29rem]">
          {testimonials.map((testimonial, index) => {
            const isCurrentCard = index === currentIndex
            const position = getCardPosition(index, currentIndex, testimonials.length)

            return (
              <article
                key={testimonial.id}
                ref={(element) => {
                  if (element) cardRefs.current.set(testimonial.id, element)
                  else cardRefs.current.delete(testimonial.id)
                }}
                id={isCurrentCard ? 'facts-carousel-panel' : undefined}
                role={isCurrentCard ? 'tabpanel' : undefined}
                aria-labelledby={isCurrentCard ? `fact-tab-${testimonial.id}` : undefined}
                aria-describedby={isCurrentCard ? 'facts-carousel-instructions' : undefined}
                aria-hidden={!isCurrentCard}
                aria-live={isCurrentCard ? 'polite' : 'off'}
                tabIndex={isCurrentCard ? 0 : -1}
                className={`fact-card absolute inset-0 flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#111016] text-left shadow-[0_24px_80px_rgba(0,0,0,0.45)]${isDragging && isCurrentCard ? ' fact-card--dragging' : ''}`}
                style={{ ...cardStyle(position), touchAction: isCurrentCard ? 'pan-y' : undefined }}
                onPointerDown={isCurrentCard ? handlePointerDown : undefined}
                onPointerMove={isCurrentCard ? handlePointerMove : undefined}
                onPointerUp={isCurrentCard ? handlePointerEnd : undefined}
                onPointerCancel={isCurrentCard ? handlePointerEnd : undefined}
              >
                <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-[radial-gradient(circle_at_82%_10%,rgba(248,134,65,0.28),transparent_68%)]" />

                <div className="relative flex h-full flex-col p-5 sm:p-8">
                  <div className="mb-7 flex items-center justify-between gap-4 text-[0.65rem] font-medium tracking-[0.2em] text-orange-200/60">
                    <span>Fact {String(index + 1).padStart(2, '0')}</span>
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
                    <span>Black holes, through the lens of science</span>
                    {isCurrentCard && testimonial.source && (
                      <a
                        href={testimonial.source.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative z-20 shrink-0 cursor-pointer text-orange-200/70 underline decoration-orange-200/30 underline-offset-4 transition-colors duration-200 hover:text-orange-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-200"
                        tabIndex={isCurrentCard ? 0 : -1}
                        onPointerDown={(event) => event.stopPropagation()}
                        onClick={(event) => event.stopPropagation()}
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
            aria-label="Choose a scientific fact"
            aria-orientation="horizontal"
          >
            {testimonials.map((testimonial, index) => (
              <button
                key={testimonial.id}
                id={`fact-tab-${testimonial.id}`}
                type="button"
                role="tab"
                data-fact-index={index}
                aria-label={`Show fact ${index + 1}`}
                aria-controls="facts-carousel-panel"
                aria-selected={index === currentIndex}
                tabIndex={index === currentIndex ? 0 : -1}
                onClick={() => {
                  if (index !== currentIndexRef.current) {
                    snapTo(index, index > currentIndexRef.current ? -1 : 1)
                  }
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

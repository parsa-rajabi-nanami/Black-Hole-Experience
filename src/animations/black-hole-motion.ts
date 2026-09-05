import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const EASE = {
  cinematic: 'power3.out',
  soft: 'power2.out',
  reveal: 'expo.out',
}

export function createHeroEntrance(scope: HTMLElement) {
  const select = <T extends Element>(selector: string) => gsap.utils.toArray<T>(selector, scope)
  const timeline = gsap.timeline({
    defaults: { ease: EASE.cinematic },
  })

  timeline
    .fromTo(
      select('.hero-ambient'),
      { autoAlpha: 0, scale: 1.08 },
      { autoAlpha: 1, scale: 1, duration: 1.4, ease: EASE.soft },
    )
    .fromTo(
      select('.hero-black-hole-layer'),
      { autoAlpha: 0, scale: 1.035, y: 18 },
      { autoAlpha: 1, scale: 1, y: 0, duration: 1.35, ease: EASE.reveal },
      '-=1.05',
    )
    .fromTo(
      select('.hero-kicker, .hero-title, .hero-description, .hero-actions, .hero-scroll-cue'),
      { autoAlpha: 0, y: 22, filter: 'blur(8px)' },
      {
        autoAlpha: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 0.85,
        stagger: 0.075,
        ease: EASE.reveal,
      },
      '-=0.8',
    )

  return timeline
}

export function createScrollStory(scope: HTMLElement, mobile: boolean) {
  gsap.utils.toArray<HTMLElement>('[data-reveal]', scope).forEach((element) => {
    gsap.fromTo(
      element,
      { autoAlpha: 0, y: mobile ? 18 : 28 },
      {
        autoAlpha: 1,
        y: 0,
        duration: mobile ? 0.75 : 0.95,
        ease: EASE.reveal,
        scrollTrigger: {
          trigger: element,
          start: 'top 84%',
          end: 'bottom 18%',
          toggleActions: 'play none none reverse',
        },
      },
    )
  })

  const heroStage = scope.querySelector<HTMLElement>('.hero-stage')
  const blackHoleParallax = scope.querySelector<HTMLElement>('.hero-black-hole-parallax')
  if (heroStage && blackHoleParallax) {
    gsap.to(blackHoleParallax, {
      yPercent: mobile ? 3 : 7,
      scale: mobile ? 1.025 : 1.055,
      ease: 'none',
      scrollTrigger: {
        trigger: heroStage,
        start: 'top top',
        end: 'bottom top',
        scrub: 1.1,
      },
    })
  }

  if (heroStage) {
    gsap.utils.toArray<HTMLElement>('.hero-ambient', scope).forEach((element) => {
      gsap.to(element, {
        yPercent: mobile ? -3 : -8,
        rotation: mobile ? 1 : 2,
        ease: 'none',
        scrollTrigger: {
          trigger: heroStage,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.4,
        },
      })
    })
  }

  const factsSection = scope.querySelector<HTMLElement>('#facts')
  if (factsSection) {
    gsap.utils.toArray<HTMLElement>('.facts-ambient', scope).forEach((element, index) => {
      gsap.to(element, {
        xPercent: index === 0 ? (mobile ? 3 : 7) : (mobile ? -3 : -7),
        yPercent: index === 0 ? -4 : 4,
        ease: 'none',
        scrollTrigger: {
          trigger: factsSection,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.8,
        },
      })
    })
  }
}

export { EASE }

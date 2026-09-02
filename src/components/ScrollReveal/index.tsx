'use client'

import React, { useEffect, useRef, useState } from 'react'

type Props = {
  children: React.ReactNode
}

/**
 * Fades + lifts its content into place the first time it scrolls into view.
 * Used sparingly (Testimonials, StatRow) per the site's one motion language —
 * not on every section. Callers nest their own layout wrapper (e.g. the
 * grid) as children rather than passing a className here, so this
 * component's own output stays two fully-static class strings (no
 * interpolation) for static analysis.
 *
 * Renders fully visible by default (server render, no-JS, or JS not yet
 * hydrated) and only opts into the hidden starting state once mounted in a
 * browser that supports IntersectionObserver — content is never at risk of
 * staying invisible. motion-safe: gates the actual transition/translate, so
 * prefers-reduced-motion users get an instant, non-animated appearance.
 */
export const ScrollReveal: React.FC<Props> = ({ children }) => {
  const ref = useRef<HTMLDivElement | null>(null)
  const [canAnimate, setCanAnimate] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return
    setCanAnimate(true)

    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -80px 0px' },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  if (canAnimate && !isVisible) {
    return (
      <div
        ref={ref}
        className="opacity-0 motion-safe:translate-y-6 motion-safe:transition-all motion-safe:duration-700 motion-safe:ease-out"
      >
        {children}
      </div>
    )
  }

  return (
    <div
      ref={ref}
      className="opacity-100 motion-safe:translate-y-0 motion-safe:transition-all motion-safe:duration-700 motion-safe:ease-out"
    >
      {children}
    </div>
  )
}

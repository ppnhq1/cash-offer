'use client'

import React, { useEffect, useRef } from 'react'

const PIXELS_PER_SECOND = 32

/**
 * Scrolls its children continuously to the left via requestAnimationFrame,
 * looping seamlessly once the (duplicated) content has scrolled exactly
 * half its own width. Pausing on hover/focus is handled here rather than
 * with a CSS animation so the whole effect is driven by imperative style
 * writes, not authored CSS.
 */
export const MarqueeTrack: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const trackRef = useRef<HTMLDivElement>(null)
  const pausedRef = useRef(false)
  const offsetRef = useRef(0)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let frameId: number
    let lastTimestamp: number | null = null

    const tick = (timestamp: number) => {
      if (lastTimestamp === null) lastTimestamp = timestamp
      const deltaSeconds = (timestamp - lastTimestamp) / 1000
      lastTimestamp = timestamp

      if (!pausedRef.current) {
        const halfWidth = track.scrollWidth / 2
        offsetRef.current += PIXELS_PER_SECOND * deltaSeconds
        if (offsetRef.current >= halfWidth) offsetRef.current -= halfWidth
        track.style.transform = `translateX(-${offsetRef.current}px)`
      }

      frameId = requestAnimationFrame(tick)
    }

    frameId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameId)
  }, [])

  return (
    <div
      ref={trackRef}
      className="flex w-max gap-6"
      onMouseEnter={() => {
        pausedRef.current = true
      }}
      onMouseLeave={() => {
        pausedRef.current = false
      }}
    >
      {children}
    </div>
  )
}

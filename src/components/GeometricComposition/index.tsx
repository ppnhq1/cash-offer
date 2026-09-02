import React from 'react'
import { cn } from '@/utilities/ui'

type Props = {
  className?: string
}

/**
 * Abstract geometric shape cluster (circle / diamond / square / triangle) in
 * the theme's primary/secondary/accent/neutral colors — a stand-in for
 * photography we don't have real assets for, in the "Geometric Abstract"
 * style requested for this brand (circles, polygons, bold color blocks).
 */
export const GeometricComposition: React.FC<Props> = ({ className }) => {
  return (
    <div
      aria-hidden="true"
      className={cn('relative grid aspect-square w-full max-w-md grid-cols-3 grid-rows-3 gap-3', className)}
    >
      <div className="col-span-1 row-span-2 rounded-[2rem] bg-secondary" />
      <div className="relative col-span-1 row-span-1 flex items-center justify-center">
        <div className="size-16 rotate-45 rounded-lg bg-primary" />
      </div>
      <div className="col-span-1 row-span-2 rounded-[2rem] bg-accent" />
      <div className="col-span-1 row-span-1 rounded-3xl border-4 border-neutral" />
      <div className="col-span-1 row-span-1 rounded-full bg-neutral" />
      <div className="col-span-1 row-span-1 flex items-center justify-center">
        <div className="mask mask-triangle size-14 bg-primary" />
      </div>
      <div className="col-span-1 row-span-1 rounded-[2rem] bg-secondary" />
    </div>
  )
}

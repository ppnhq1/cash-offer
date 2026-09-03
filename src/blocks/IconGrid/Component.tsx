import React from 'react'
import { cn } from '@/utilities/ui'
import { MarqueeTrack } from './MarqueeTrack'
import {
  AlertTriangle,
  Ban,
  Briefcase,
  Building2,
  CalendarCheck2,
  CalendarClock,
  CalendarDays,
  ClipboardCheck,
  ClipboardList,
  Clock,
  DollarSign,
  FileCheck2,
  Frown,
  HandCoins,
  Handshake,
  HeartCrack,
  Home,
  Key,
  MapPin,
  PhoneCall,
  ShieldAlert,
  ShieldCheck,
  TrendingDown,
  UserX,
  Users,
  Wallet,
  Wrench,
  type LucideIcon,
} from 'lucide-react'

import type { IconGridBlock as IconGridBlockProps } from '@/payload-types'

const icons: Record<string, LucideIcon> = {
  AlertTriangle,
  Ban,
  Briefcase,
  Building2,
  CalendarCheck2,
  CalendarClock,
  CalendarDays,
  ClipboardCheck,
  ClipboardList,
  Clock,
  DollarSign,
  FileCheck2,
  Frown,
  HandCoins,
  Handshake,
  HeartCrack,
  Home,
  Key,
  MapPin,
  PhoneCall,
  ShieldAlert,
  ShieldCheck,
  TrendingDown,
  UserX,
  Users,
  Wallet,
  Wrench,
}

const swatches = [
  'bg-primary/15 text-primary',
  'bg-secondary/15 text-secondary',
  'bg-accent/15 text-accent',
]

type Item = NonNullable<IconGridBlockProps['items']>[number]

const GridLayout: React.FC<{ items: Item[]; columns?: IconGridBlockProps['columns'] }> = ({
  items,
  columns,
}) => (
  <div
    className={
      columns === '2'
        ? 'grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2'
        : 'grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3'
    }
  >
    {items.map((item, index) => {
      const Icon = item.icon ? icons[item.icon] : null

      return (
        <div
          key={index}
          className="group card border border-base-300 bg-base-100 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-xl motion-reduce:transition-none motion-reduce:hover:translate-y-0"
        >
          <div className="card-body">
            {Icon && (
              <div
                className={cn(
                  'mb-2 flex size-12 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100',
                  swatches[index % swatches.length],
                )}
              >
                <Icon className="size-6" aria-hidden="true" />
              </div>
            )}
            <h3 className="card-title text-lg">{item.title}</h3>
            {item.description && <p className="text-base-content/80">{item.description}</p>}
          </div>
        </div>
      )
    })}
  </div>
)

const LoopLayout: React.FC<{ items: Item[]; columns?: IconGridBlockProps['columns'] }> = ({
  items,
  columns,
}) => {
  const track = [...items, ...items]

  return (
    <div className="relative">
      <div className="relative overflow-hidden motion-reduce:hidden">
        <MarqueeTrack>
          {track.map((item, index) => {
            const Icon = item.icon ? icons[item.icon] : null
            const swatch = swatches[index % items.length % swatches.length]
            const isDuplicate = index >= items.length

            return (
              <div key={index} aria-hidden={isDuplicate} className="hover-3d my-2 shrink-0">
                <div className="card w-72 border border-base-300 bg-base-100 sm:w-80">
                  <div className="card-body">
                    {Icon && (
                      <div
                        className={cn(
                          'mb-2 flex size-12 items-center justify-center rounded-full',
                          swatch,
                        )}
                      >
                        <Icon className="size-6" aria-hidden="true" />
                      </div>
                    )}
                    <h3 className="card-title text-lg">{item.title}</h3>
                    {item.description && (
                      <p className="text-base-content/80">{item.description}</p>
                    )}
                  </div>
                </div>
                {/* 8 empty divs required by daisyUI's hover-3d effect */}
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
            )
          })}
        </MarqueeTrack>
      </div>

      {/* Static fallback for prefers-reduced-motion: no duplicated items, no animation. */}
      <div className="hidden motion-reduce:block">
        <GridLayout items={items} columns={columns} />
      </div>
    </div>
  )
}

export const IconGridBlock: React.FC<IconGridBlockProps> = ({
  layout,
  eyebrow,
  heading,
  subheading,
  columns,
  items,
}) => {
  const safeItems = items || []

  return (
    <div className="container">
      <div className="mx-auto mb-10 max-w-2xl text-center">
        {eyebrow && (
          <span className="badge badge-soft badge-primary badge-lg mb-3 font-bold tracking-wide uppercase">
            {eyebrow}
          </span>
        )}
        <h2 className="text-3xl font-bold md:text-4xl">{heading}</h2>
        {subheading && <p className="mt-4 text-lg text-base-content/80">{subheading}</p>}
      </div>

      {layout === 'carousel' ? (
        <LoopLayout items={safeItems} columns={columns} />
      ) : (
        <GridLayout items={safeItems} columns={columns} />
      )}
    </div>
  )
}

import React from 'react'
import { Icon } from '@iconify/react'
import { cn } from '@/utilities/ui'
import { MarqueeTrack } from './MarqueeTrack'

import type { IconGridBlock as IconGridBlockProps } from '@/payload-types'

const icons: Record<string, string> = {
  AlertTriangle: 'lucide:alert-triangle',
  Ban: 'lucide:ban',
  Briefcase: 'lucide:briefcase',
  Building2: 'lucide:building-2',
  CalendarCheck2: 'lucide:calendar-check-2',
  CalendarClock: 'lucide:calendar-clock',
  CalendarDays: 'lucide:calendar-days',
  ClipboardCheck: 'lucide:clipboard-check',
  ClipboardList: 'lucide:clipboard-list',
  Clock: 'lucide:clock',
  DollarSign: 'lucide:dollar-sign',
  FileCheck2: 'lucide:file-check-2',
  Frown: 'lucide:frown',
  HandCoins: 'lucide:hand-coins',
  Handshake: 'lucide:handshake',
  HeartCrack: 'lucide:heart-crack',
  Home: 'lucide:home',
  Key: 'lucide:key',
  MapPin: 'lucide:map-pin',
  PhoneCall: 'lucide:phone-call',
  ShieldAlert: 'lucide:shield-alert',
  ShieldCheck: 'lucide:shield-check',
  TrendingDown: 'lucide:trending-down',
  UserX: 'lucide:user-x',
  Users: 'lucide:users',
  Wallet: 'lucide:wallet',
  Wrench: 'lucide:wrench',
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
      const iconName = item.icon ? icons[item.icon] : null

      return (
        <div
          key={index}
          className="group card border border-base-300 bg-base-100 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-xl motion-reduce:transition-none motion-reduce:hover:translate-y-0"
        >
          <div className="card-body">
            {iconName && (
              <div
                className={cn(
                  'mb-2 flex size-12 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100',
                  swatches[index % swatches.length],
                )}
              >
                <Icon icon={iconName} className="size-6" aria-hidden="true" />
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
            const iconName = item.icon ? icons[item.icon] : null
            const swatch = swatches[index % items.length % swatches.length]
            const isDuplicate = index >= items.length

            return (
              <div key={index} aria-hidden={isDuplicate} className="hover-3d my-2 shrink-0">
                <div className="card w-72 border border-base-300 bg-base-100 sm:w-80">
                  <div className="card-body">
                    {iconName && (
                      <div
                        className={cn(
                          'mb-2 flex size-12 items-center justify-center rounded-full',
                          swatch,
                        )}
                      >
                        <Icon icon={iconName} className="size-6" aria-hidden="true" />
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

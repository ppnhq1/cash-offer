import clsx from 'clsx'
import React from 'react'

interface Props {
  businessName?: string | null
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
}

export const Logo = (props: Props) => {
  const { businessName, className } = props

  // TODO: swap for a real logo image/SVG asset before launch.
  return (
    <span className={clsx('max-w-[9.375rem] w-full text-lg font-bold tracking-tight', className)}>
      {businessName || 'RVA Cash Home Buyers'}
    </span>
  )
}

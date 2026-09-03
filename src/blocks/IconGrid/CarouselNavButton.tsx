'use client'

import React from 'react'

export const CarouselNavButton: React.FC<{
  targetId: string
  label: string
  icon: React.ReactNode
}> = ({ targetId, label, icon }) => {
  return (
    <button
      type="button"
      className="btn btn-circle btn-sm"
      aria-label={label}
      onClick={() => {
        document
          .getElementById(targetId)
          ?.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' })
      }}
    >
      {icon}
    </button>
  )
}

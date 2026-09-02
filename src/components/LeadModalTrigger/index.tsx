'use client'

import React from 'react'

import { openLeadCaptureModal } from '@/utilities/leadCaptureModal'

/**
 * Renders like the CTA link it replaces, but opens the global lead-capture
 * modal (#lead-capture-modal) instead of navigating. Used anywhere a link
 * would otherwise point at the LEAD_MODAL_URL sentinel. Forwards its ref and
 * spreads unknown props so it works as a Radix `Slot` / `Button asChild` child.
 */
export const LeadModalTrigger = React.forwardRef<HTMLButtonElement, React.ComponentProps<'button'>>(
  ({ onClick, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      onClick={(e) => {
        onClick?.(e)
        openLeadCaptureModal()
      }}
      {...props}
    />
  ),
)

LeadModalTrigger.displayName = 'LeadModalTrigger'

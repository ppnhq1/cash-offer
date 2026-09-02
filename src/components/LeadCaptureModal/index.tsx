import React from 'react'

import { LeadCaptureCard } from '@/components/LeadCaptureCard'
import { LEAD_CAPTURE_MODAL_ID } from '@/utilities/leadCaptureModal'

type Props = {
  formID?: number | null
}

/**
 * Rendered once, globally (see the frontend layout), so every CTA button on
 * the site — header, location pages, CMS-authored CallToAction/SplitContent
 * links using the "#lead-modal" URL — can open the exact same form via
 * openLeadCaptureModal() instead of duplicating a form instance per page.
 */
export const LeadCaptureModal: React.FC<Props> = ({ formID }) => {
  return (
    <dialog id={LEAD_CAPTURE_MODAL_ID} className="modal modal-bottom sm:modal-middle">
      <div className="modal-box">
        <form method="dialog">
          <button
            className="btn btn-circle btn-ghost btn-sm absolute right-3 top-3"
            aria-label="Close"
          >
            ✕
          </button>
        </form>
        <LeadCaptureCard formID={formID} instanceId="modal" variant="plain" />
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  )
}

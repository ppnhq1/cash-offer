/**
 * Sentinel link URL any CMS-authored link (CallToAction, SplitContent, nav items, etc.)
 * can use to open the global lead-capture modal instead of navigating.
 */
export const LEAD_MODAL_URL = '#lead-modal'

export const LEAD_CAPTURE_MODAL_ID = 'lead-capture-modal'

export function openLeadCaptureModal() {
  if (typeof document === 'undefined') return
  const modal = document.getElementById(LEAD_CAPTURE_MODAL_ID)
  if (modal && 'showModal' in modal) {
    ;(modal as HTMLDialogElement).showModal()
  }
}

/**
 * Phone numbers are held in form state as up to 10 raw digits (no country
 * code), displayed to the user as (XXX) XXX-XXXX, and normalized to
 * 1XXXXXXXXXX only at submission time — for both the Payload form
 * submission record and the BulkVS SMS API, which both expect that format.
 */

/** Strips a pasted/typed value down to at most 10 local-number digits, dropping a leading US country code if present. */
export function normalizePhoneDigits(value: string): string {
  let digits = value.replace(/\D/g, '')
  if (digits.length === 11 && digits.startsWith('1')) {
    digits = digits.slice(1)
  }
  return digits.slice(0, 10)
}

/** Formats up to 10 raw digits as (XXX) XXX-XXXX, progressively while typing. */
export function formatPhoneDisplay(digits: string): string {
  const d = digits.slice(0, 10)
  if (d.length === 0) return ''
  if (d.length < 4) return `(${d}`
  if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`
}

/** Converts 10 raw digits to the 1XXXXXXXXXX format used for storage and the SMS API. Returns null if incomplete. */
export function phoneDigitsToStored(digits: string): string | null {
  return digits.length === 10 ? `1${digits}` : null
}

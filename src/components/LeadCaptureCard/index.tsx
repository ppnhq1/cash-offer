'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { MapPin, ShieldCheck } from 'lucide-react'

import { formatPhoneDisplay, normalizePhoneDigits, phoneDigitsToStored } from '@/utilities/formatPhone'
import { getClientSideURL } from '@/utilities/getURL'
import { loadGooglePlaces } from '@/utilities/loadGooglePlaces'

const SMS_CONSENT_LABEL =
  'I agree to receive text messages from VA Cash Offer regarding my inquiry, including follow-up messages about buying or selling my property. Message frequency varies. Message and data rates may apply. Reply STOP to opt out or HELP for help. Consent is not a condition of purchase.'

type InstanceId = 'inline' | 'modal'

/**
 * Plain, unstyled-by-daisyUI listbox (not the daisyUI `dropdown` popover
 * component) — this is a live, keystroke-driven suggestion list, not a
 * click-to-toggle popover, so it doesn't fit that component's interaction
 * model. mousedown + preventDefault keeps the address input focused so a
 * suggestion click never races the input's onBlur.
 */
const AddressSuggestions: React.FC<{
  suggestions: google.maps.places.AutocompleteSuggestion[]
  onSelect: (suggestion: google.maps.places.AutocompleteSuggestion) => void
}> = ({ suggestions, onSelect }) => {
  if (suggestions.length === 0) return null

  return (
    <ul className="absolute z-20 mt-1 w-full overflow-hidden rounded-box border border-base-300 bg-base-100 shadow-lg">
      {suggestions.map((suggestion) => (
        <li key={suggestion.placePrediction?.placeId}>
          <button
            type="button"
            className="flex w-full items-start gap-2 px-4 py-3 text-left text-base hover:bg-base-200"
            onMouseDown={(e) => {
              e.preventDefault()
              onSelect(suggestion)
            }}
          >
            <MapPin className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
            {suggestion.placePrediction?.text.text}
          </button>
        </li>
      ))}
    </ul>
  )
}

/**
 * Each field below renders one of two fully-literal branches by instance —
 * never an interpolated id — so label/input pairing stays statically
 * verifiable even though the same field type is used in both the hero card
 * and the modal on the same page.
 */
const AddressField: React.FC<{
  instanceId: InstanceId
  inputRef: React.RefObject<HTMLInputElement | null>
  value: string
  onChange: (value: string) => void
  onBlur: () => void
  error: string | null
  suggestions: google.maps.places.AutocompleteSuggestion[]
  onSelectSuggestion: (suggestion: google.maps.places.AutocompleteSuggestion) => void
}> = ({ instanceId, inputRef, value, onChange, onBlur, error, suggestions, onSelectSuggestion }) => {
  if (instanceId === 'modal') {
    return (
      <>
        <label className="label" htmlFor="lead-modal-address">
          Property address
        </label>
        <div className="relative">
          <input
            ref={inputRef}
            id="lead-modal-address"
            type="text"
            required
            autoComplete="off"
            className="input input-lg validator w-full"
            placeholder="123 Main St, Richmond, VA"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
          />
          <AddressSuggestions suggestions={suggestions} onSelect={onSelectSuggestion} />
        </div>
        {error && (
          <p role="alert" className="validator-hint text-error">
            {error}
          </p>
        )}
      </>
    )
  }

  return (
    <>
      <label className="label" htmlFor="lead-inline-address">
        Property address
      </label>
      <div className="relative">
        <input
          ref={inputRef}
          id="lead-inline-address"
          type="text"
          required
          autoComplete="off"
          className="input input-lg w-full"
          placeholder="123 Main St, Richmond, VA"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
        />
        <AddressSuggestions suggestions={suggestions} onSelect={onSelectSuggestion} />
      </div>
      {error && (
        <p role="alert" className="validator-hint text-error">
          {error}
        </p>
      )}
    </>
  )
}

const PhoneField: React.FC<{
  instanceId: InstanceId
  value: string
  onChange: (value: string) => void
  error: string | null
}> = ({ instanceId, value, onChange, error }) => {
  if (instanceId === 'modal') {
    return (
      <>
        <label className="label" htmlFor="lead-modal-phone">
          Phone number
        </label>
        <input
          id="lead-modal-phone"
          type="tel"
          inputMode="numeric"
          required
          className="input input-lg w-full"
          placeholder="(804) 555-0100"
          value={formatPhoneDisplay(value)}
          onChange={(e) => onChange(normalizePhoneDigits(e.target.value))}
        />
        {error && (
          <p role="alert" className="validator-hint text-error">
            {error}
          </p>
        )}
      </>
    )
  }

  return (
    <>
      <label className="label" htmlFor="lead-inline-phone">
        Phone number
      </label>
      <input
        id="lead-inline-phone"
        type="tel"
        inputMode="numeric"
        required
        className="input input-lg w-full"
        placeholder="(804) 555-0100"
        value={formatPhoneDisplay(value)}
        onChange={(e) => onChange(normalizePhoneDigits(e.target.value))}
      />
      {error && (
        <p role="alert" className="validator-hint text-error">
          {error}
        </p>
      )}
    </>
  )
}

const EmailField: React.FC<{
  instanceId: InstanceId
  value: string
  onChange: (value: string) => void
}> = ({ instanceId, value, onChange }) => {
  if (instanceId === 'modal') {
    return (
      <>
        <label className="label" htmlFor="lead-modal-email">
          Email address
        </label>
        <input
          id="lead-modal-email"
          type="email"
          required
          className="input input-lg w-full"
          placeholder="you@example.com"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </>
    )
  }

  return (
    <>
      <label className="label" htmlFor="lead-inline-email">
        Email address
      </label>
      <input
        id="lead-inline-email"
        type="email"
        required
        className="input input-lg w-full"
        placeholder="you@example.com"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </>
  )
}

const SmsConsentField: React.FC<{
  instanceId: InstanceId
  checked: boolean
  onChange: (checked: boolean) => void
}> = ({ instanceId, checked, onChange }) => {
  if (instanceId === 'modal') {
    return (
      <label className="label mt-3 items-start gap-2" htmlFor="lead-modal-sms-consent">
        <input
          id="lead-modal-sms-consent"
          type="checkbox"
          required
          className="checkbox mt-0.5 shrink-0"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span className="min-w-0 flex-1 whitespace-normal text-sm text-base-content/70">
          {SMS_CONSENT_LABEL}
        </span>
      </label>
    )
  }

  return (
    <label className="label mt-3 items-start gap-2" htmlFor="lead-inline-sms-consent">
      <input
        id="lead-inline-sms-consent"
        type="checkbox"
        required
        className="checkbox mt-0.5 shrink-0"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="min-w-0 flex-1 whitespace-normal text-sm text-base-content/70">
        {SMS_CONSENT_LABEL}
      </span>
    </label>
  )
}

/**
 * daisyUI's `aura` effect is limited to one instance per page. LeadCaptureCard
 * renders twice on every page (the always-visible hero card, plus the global
 * modal's copy hidden until opened) so the aura only goes on the 'inline'
 * (hero) instance's submit button — the modal's stays plain — keeping the
 * whole page's aura count at exactly one regardless of which page you're on.
 */
const SubmitButton: React.FC<{
  instanceId: InstanceId
  isLoading: boolean
  disabled: boolean
}> = ({ instanceId, isLoading, disabled }) => {
  if (instanceId === 'inline') {
    return (
      <div className="aura aura-rainbow mt-5 w-full">
        <button
          type="submit"
          className="btn btn-primary btn-lg w-full transition-transform duration-200 hover:scale-[1.02] active:scale-[0.97] motion-reduce:transition-none motion-reduce:hover:scale-100 motion-reduce:active:scale-100"
          disabled={disabled}
        >
          {isLoading ? <span className="loading loading-spinner" /> : 'Get My Fair Cash Offer'}
        </button>
      </div>
    )
  }

  return (
    <button
      type="submit"
      className="btn btn-primary btn-lg mt-5 w-full transition-transform duration-200 hover:scale-[1.02] active:scale-[0.97] motion-reduce:transition-none motion-reduce:hover:scale-100 motion-reduce:active:scale-100"
      disabled={disabled}
    >
      {isLoading ? <span className="loading loading-spinner" /> : 'Get My Fair Cash Offer'}
    </button>
  )
}

type Props = {
  formID?: number | null
  title?: string
  /** Distinct per rendered instance (hero card vs. modal) so field ids never collide across the page. */
  instanceId?: InstanceId
  /** 'card' (default) renders its own bordered/shadowed container; 'plain' renders just the form, for use inside a modal-box that already supplies the chrome. */
  variant?: 'card' | 'plain'
}

const ADDRESS_TYPES = ['street_address', 'premise', 'subpremise']

export const LeadCaptureCard: React.FC<Props> = ({
  formID,
  title = 'Get Your Cash Offer',
  instanceId = 'inline',
  variant = 'card',
}) => {
  const [values, setValues] = useState({ address: '', phone: '', email: '' })
  const [smsConsent, setSmsConsent] = useState(false)
  const [addressVerified, setAddressVerified] = useState(false)
  const [addressError, setAddressError] = useState<string | null>(null)
  const [phoneError, setPhoneError] = useState<string | null>(null)
  const [suggestions, setSuggestions] = useState<google.maps.places.AutocompleteSuggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const addressInputRef = useRef<HTMLInputElement | null>(null)
  const sessionTokenRef = useRef<google.maps.places.AutocompleteSessionToken | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const requestIdRef = useRef(0)

  useEffect(() => {
    // Kick off loading in the background so the first keystroke isn't blocked on it.
    loadGooglePlaces().catch(() => {
      // Address verification is a progressive enhancement — if Google Maps
      // fails to load, the address field still works as plain text below.
    })
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  const fetchSuggestions = useCallback((input: string) => {
    const requestId = ++requestIdRef.current

    const run = async () => {
      try {
        await loadGooglePlaces()
        if (!sessionTokenRef.current) {
          sessionTokenRef.current = new window.google!.maps.places.AutocompleteSessionToken()
        }

        const { suggestions: results } =
          await window.google!.maps.places.AutocompleteSuggestion.fetchAutocompleteSuggestions({
            input,
            sessionToken: sessionTokenRef.current,
            includedRegionCodes: ['us'],
            includedPrimaryTypes: ADDRESS_TYPES,
          })

        if (requestId !== requestIdRef.current) return
        setSuggestions(results)
      } catch {
        if (requestId !== requestIdRef.current) return
        setSuggestions([])
      }
    }

    void run()
  }, [])

  const onAddressChange = (value: string) => {
    setValues((v) => ({ ...v, address: value }))
    setAddressVerified(false)

    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (value.trim().length < 3) {
      requestIdRef.current += 1
      setSuggestions([])
      return
    }

    debounceRef.current = setTimeout(() => fetchSuggestions(value), 250)
  }

  const onSelectSuggestion = useCallback((suggestion: google.maps.places.AutocompleteSuggestion) => {
    const placePrediction = suggestion.placePrediction
    if (!placePrediction) return

    const applySelection = async () => {
      const place = placePrediction.toPlace()
      await place.fetchFields({ fields: ['formattedAddress'] })
      setValues((v) => ({ ...v, address: place.formattedAddress || v.address }))
      setAddressVerified(true)
      setAddressError(null)
      setSuggestions([])
      sessionTokenRef.current = null
    }

    void applySelection()
  }, [])

  const onAddressBlur = () => {
    setSuggestions([])
  }

  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      if (!formID) return

      if (!addressVerified) {
        setAddressError('Please select your address from the suggestions.')
        addressInputRef.current?.focus()
        return
      }

      const storedPhone = phoneDigitsToStored(values.phone)
      if (!storedPhone) {
        setPhoneError('Please enter a 10-digit phone number.')
        return
      }

      setError(null)
      setAddressError(null)
      setPhoneError(null)
      setIsLoading(true)

      const submissionData = [
        { field: 'address', value: values.address },
        { field: 'phone', value: storedPhone },
        { field: 'email', value: values.email },
        { field: 'smsConsent', value: smsConsent },
        { field: 'sourcePage', value: window.location.href },
      ]

      const submitForm = async () => {
        try {
          const req = await fetch(`${getClientSideURL()}/api/form-submissions`, {
            body: JSON.stringify({ form: formID, submissionData }),
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
          })
          if (req.status >= 400) {
            const res = await req.json()
            setError(res.errors?.[0]?.message || 'Something went wrong. Please call us instead.')
            setIsLoading(false)
            return
          }
          // The confirmation SMS and welcome/notification emails are sent
          // server-side by a Payload hook once this submission is saved —
          // see src/hooks/notifyLead.ts. There's nothing more to trigger here.
          setHasSubmitted(true)
          setIsLoading(false)
        } catch {
          setError('Something went wrong. Please call us instead.')
          setIsLoading(false)
        }
      }
      void submitForm()
    },
    [formID, values, smsConsent, addressVerified],
  )

  const formBody = hasSubmitted ? (
    <div className="py-6 text-center">
      <ShieldCheck className="mx-auto mb-3 size-10 text-success" aria-hidden="true" />
      <h2 className="text-xl font-bold">Thank you!</h2>
      <p className="mt-2 text-base-content/80">
        We received your info and will call you within 24 hours with your cash offer.
      </p>
    </div>
  ) : (
    <form onSubmit={onSubmit}>
      <fieldset className="fieldset">
        <legend className="fieldset-legend text-lg">{title}</legend>

        <AddressField
          instanceId={instanceId}
          inputRef={addressInputRef}
          value={values.address}
          onChange={onAddressChange}
          onBlur={onAddressBlur}
          error={addressError}
          suggestions={suggestions}
          onSelectSuggestion={onSelectSuggestion}
        />

        <PhoneField
          instanceId={instanceId}
          value={values.phone}
          onChange={(value) => {
            setValues((v) => ({ ...v, phone: value }))
            setPhoneError(null)
          }}
          error={phoneError}
        />

        <EmailField
          instanceId={instanceId}
          value={values.email}
          onChange={(value) => setValues((v) => ({ ...v, email: value }))}
        />

        <SmsConsentField instanceId={instanceId} checked={smsConsent} onChange={setSmsConsent} />

        {error && (
          <p role="alert" className="mt-2 text-error">
            {error}
          </p>
        )}

        <SubmitButton instanceId={instanceId} isLoading={isLoading} disabled={isLoading || !formID} />
        <p className="label mt-2">No obligation. We respond within 24 hours.</p>
      </fieldset>
    </form>
  )

  if (variant === 'plain') {
    return formBody
  }

  return (
    <div className="card w-full max-w-md shrink-0 bg-base-100 text-base-content shadow-2xl">
      <div className="card-body">{formBody}</div>
    </div>
  )
}

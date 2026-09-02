'use client'

declare global {
  interface Window {
    google?: typeof google
    __initGoogleMapsPlaces?: () => void
  }
}

let placesLoadPromise: Promise<void> | null = null

/**
 * Loads the Google Maps JavaScript API with the Places library (Places API
 * (New)) exactly once, no matter how many address inputs on the page ask
 * for it (hero form, modal form, future forms). Uses the classic
 * `libraries=places` + global callback pattern to populate
 * `google.maps.places` — the newer `importLibrary()` helper is only
 * injected by Google's separate bootstrap-loader snippet, not by a plain
 * script tag like this one.
 */
export function loadGooglePlaces(): Promise<void> {
  if (placesLoadPromise) return placesLoadPromise

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  if (!apiKey) {
    return Promise.reject(new Error('NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is not configured.'))
  }

  placesLoadPromise = new Promise((resolve, reject) => {
    if (window.google?.maps?.places) {
      resolve()
      return
    }

    if (document.getElementById('google-maps-js')) {
      window.__initGoogleMapsPlaces = resolve
      return
    }

    window.__initGoogleMapsPlaces = resolve

    const script = document.createElement('script')
    script.id = 'google-maps-js'
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&libraries=places&loading=async&callback=__initGoogleMapsPlaces`
    script.async = true
    script.addEventListener('error', () => reject(new Error('Failed to load Google Maps.')), {
      once: true,
    })
    document.head.appendChild(script)
  })

  return placesLoadPromise
}

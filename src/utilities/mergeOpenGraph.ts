import type { Metadata } from 'next'

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  description: 'We buy houses for cash in Richmond, VA — any condition, no repairs, no fees.',
  // TODO: replace with a real branded share image (1200x630) before launch.
  images: [],
  siteName: 'RVA Cash Home Buyers',
  title: 'RVA Cash Home Buyers',
}

export const mergeOpenGraph = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}

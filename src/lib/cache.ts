export const CACHE_TAGS = {
  products: 'products',
  blog: 'blog',
  settings: 'settings',
} as const

export const REVALIDATE = {
  /** 1 minute - For highly dynamic content */
  SHORT: 60,
  /** 1 hour - For standard content */
  MEDIUM: 3600,
  /** 24 hours - For static content */
  LONG: 86400,
  /** Never revalidate automatically */
  INFINITE: false,
} as const

export function getCacheConfig(tag: keyof typeof CACHE_TAGS, duration: keyof typeof REVALIDATE = 'MEDIUM') {
  return {
    next: {
      tags: [CACHE_TAGS[tag]],
      revalidate: REVALIDATE[duration],
    },
  }
}

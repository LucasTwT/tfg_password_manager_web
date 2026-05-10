import type { SearchableItem, SearchEngine, SearchOptions } from '../types'
import { filterBy } from './filters'

/**
 * Case-insensitive substring search across name, siteName, username, notes, tags.
 * Best for short queries or queries with spaces.
 */
export const fullTextSearch: SearchEngine = (
  items: SearchableItem[],
  options: SearchOptions,
) => {
  const start = performance.now()
  const { query, filters, limit, offset } = options

  // Apply filters first (reduces search space)
  const filtered = filters ? filterBy(items, filters) : items

  const lowerQuery = query.toLowerCase().trim()

  const matched = filtered.filter((item) => {
    if (lowerQuery === '') return true

    // Search across all text fields
    if (item.name.toLowerCase().includes(lowerQuery)) return true
    if (item.siteName?.toLowerCase().includes(lowerQuery)) return true
    if (item.username?.toLowerCase().includes(lowerQuery)) return true
    if (item.notes?.toLowerCase().includes(lowerQuery)) return true

    // Search in tags
    if (item.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))) {
      return true
    }

    return false
  })

  const total = matched.length
  const paged = matched.slice(offset ?? 0, (offset ?? 0) + (limit ?? total))

  return {
    items: paged,
    total,
    query,
    tookMs: performance.now() - start,
  }
}

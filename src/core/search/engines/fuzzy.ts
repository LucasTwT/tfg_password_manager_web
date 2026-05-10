import Fuse from 'fuse.js'
import type { SearchableItem, SearchEngine, SearchOptions } from '../types'
import { filterBy } from './filters'

const fuseOptions: Fuse.IFuseOptions<SearchableItem> = {
  keys: ['name', 'siteName', 'username', 'notes', 'tags'],
  threshold: 0.3,
  includeScore: true,
  minMatchCharLength: 2,
}

/**
 * Fuzzy search using Fuse.js.
 * Tolerates typos and partial matches.
 * Best for longer queries without spaces.
 */
export const fuzzySearch: SearchEngine = (
  items: SearchableItem[],
  options: SearchOptions,
) => {
  const start = performance.now()
  const { query, filters, limit, offset } = options

  // Apply filters first (reduces search space)
  const filtered = filters ? filterBy(items, filters) : items

  const fuse = new Fuse(filtered, fuseOptions)
  const fuseResults = fuse.search(query)

  const matched = fuseResults.map((result) => result.item)
  const total = matched.length
  const paged = matched.slice(offset ?? 0, (offset ?? 0) + (limit ?? total))

  return {
    items: paged,
    total,
    query,
    tookMs: performance.now() - start,
  }
}

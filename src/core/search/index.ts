import type { SearchableItem, SearchEngine, SearchOptions, SearchResult } from './types'
import { fullTextSearch } from './engines/fullText'
import { fuzzySearch } from './engines/fuzzy'

export type { SearchableItem, SearchFilters, SearchOptions, SearchResult, SearchEngine } from './types'
export { fullTextSearch } from './engines/fullText'
export { fuzzySearch } from './engines/fuzzy'
export { filterBy, createFilterEngine } from './engines/filters'

/**
 * Auto-select search engine based on query heuristics:
 * - Short queries or queries with spaces → fullText (substring matching)
 * - Longer queries without spaces → fuzzy (handles typos)
 *
 * Override by calling an engine directly.
 */
export function search(
  items: SearchableItem[],
  options: SearchOptions,
  engineOverride?: SearchEngine,
): SearchResult {
  if (engineOverride) {
    return engineOverride(items, options)
  }

  const { query } = options
  const trimmed = query.trim()

  // Heuristic: if query has spaces or is short (≤3 chars), use fullText
  // Otherwise use fuzzy for typo tolerance
  const useFuzzy = !trimmed.includes(' ') && trimmed.length > 3

  const engine: SearchEngine = useFuzzy ? fuzzySearch : fullTextSearch
  return engine(items, options)
}

import type { SearchableItem, SearchFilters } from '../types'

/**
 * Apply search filters to a list of items.
 * Standalone function for direct use or composition.
 */
export function filterBy(
  items: SearchableItem[],
  filters: SearchFilters,
): SearchableItem[] {
  return items.filter((item) => {
    if (filters.type && item.type !== filters.type) {
      return false
    }

    if (filters.vaultId && item.type === 'login') {
      // Login items can be filtered by vaultId if the field exists
      // This is a structural filter — items without matching vaultId are excluded
      if ('vaultId' in item && (item as Record<string, unknown>).vaultId !== filters.vaultId) {
        return false
      }
    }

    if (filters.tags && filters.tags.length > 0) {
      const itemTags = item.tags ?? []
      const hasMatch = filters.tags.some((tag) => itemTags.includes(tag))
      if (!hasMatch) {
        return false
      }
    }

    if (filters.dateFrom && item.updatedAt < filters.dateFrom) {
      return false
    }

    if (filters.dateTo && item.updatedAt > filters.dateTo) {
      return false
    }

    return true
  })
}

interface FilterChain {
  /** Add a type filter */
  byType(type: 'vault' | 'login'): FilterChain
  /** Add a vault ID filter */
  byVault(vaultId: string): FilterChain
  /** Add a tags filter (items matching ANY tag pass) */
  byTags(tags: string[]): FilterChain
  /** Add a date range filter */
  byDateRange(from?: Date, to?: Date): FilterChain
  /** Execute the filter chain against items */
  apply(items: SearchableItem[]): SearchableItem[]
}

/**
 * Create a chainable filter engine.
 * Collects filters then applies them all at once via `apply()`.
 */
export function createFilterEngine(): FilterChain {
  const filters: SearchFilters = {}

  const chain: FilterChain = {
    byType(type) {
      filters.type = type
      return chain
    },
    byVault(vaultId) {
      filters.vaultId = vaultId
      return chain
    },
    byTags(tags) {
      filters.tags = tags
      return chain
    },
    byDateRange(from, to) {
      filters.dateFrom = from
      filters.dateTo = to
      return chain
    },
    apply(items) {
      return filterBy(items, filters)
    },
  }

  return chain
}

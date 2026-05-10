export interface SearchableItem {
  id: string
  name: string
  type: 'vault' | 'login'
  siteName?: string
  username?: string
  notes?: string
  tags?: string[]
  createdAt: Date
  updatedAt: Date
}

export interface SearchFilters {
  type?: 'vault' | 'login'
  vaultId?: string
  tags?: string[]
  dateFrom?: Date
  dateTo?: Date
  isFavorite?: boolean
}

export interface SearchOptions {
  query: string
  filters?: SearchFilters
  limit?: number
  offset?: number
}

export interface SearchResult {
  items: SearchableItem[]
  total: number
  query: string
  tookMs: number
}

export type SearchEngine = (
  items: SearchableItem[],
  options: SearchOptions,
) => SearchResult

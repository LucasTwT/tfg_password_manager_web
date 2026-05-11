import type { Vault } from "@/core/types/vault"

/**
 * Filter vaults by search query (matches vault name).
 * Case-insensitive, accent-insensitive.
 */
export function filterVaultsByQuery(vaults: Vault[], query: string): Vault[] {
  if (!query.trim()) return vaults
  const q = normalize(query)
  return vaults.filter((v) => normalize(v.name).includes(q))
}

const normalize = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()

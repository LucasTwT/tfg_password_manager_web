import { isTauri } from '@/platform'
import type { StorageAPI } from './types'

/**
 * Lazy-initialized storage adapter.
 *
 * Resolves to the Tauri Store plugin when running inside the Tauri shell,
 * and falls back to IndexedDB (webStorage) for browser environments.
 *
 * The first call lazily loads the appropriate implementation;
 * subsequent calls reuse the cached instance.
 */
let _impl: StorageAPI | null = null

async function getImpl(): Promise<StorageAPI> {
  if (_impl) return _impl

  if (isTauri()) {
    const mod = await import('./tauriStorage')
    _impl = mod.tauriStorage
  } else {
    const mod = await import('./webStorage')
    _impl = mod.webStorage
  }

  return _impl
}

export const storage: StorageAPI = {
  async get<T>(key: string): Promise<T | null> {
    return (await getImpl()).get<T>(key)
  },

  async set<T>(key: string, value: T): Promise<void> {
    return (await getImpl()).set<T>(key, value)
  },

  async delete(key: string): Promise<void> {
    return (await getImpl()).delete(key)
  },
}

export type { StorageAPI } from './types'
import { Store } from '@tauri-apps/plugin-store'
import type { StorageAPI } from './types'

const STORE_FILE = 'darkvault-store.json'

let storeInstance: Store | null = null

async function getStore(): Promise<Store> {
  if (!storeInstance) {
    storeInstance = await Store.load(STORE_FILE, { autoSave: false })
  }
  return storeInstance
}

export const tauriStorage: StorageAPI = {
  async get<T>(key: string): Promise<T | null> {
    const store = await getStore()
    const value: T | undefined = await store.get<T>(key)
    return value ?? null
  },

  async set<T>(key: string, value: T): Promise<void> {
    const store = await getStore()
    await store.set(key, value)
    await store.save()
  },

  async delete(key: string): Promise<void> {
    const store = await getStore()
    await store.delete(key)
    await store.save()
  },
}
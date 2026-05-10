import { openDB, type IDBPDatabase } from 'idb'
import type { StorageAPI } from './types'

const DB_NAME = 'darkvault-secure-db'
const STORE_NAME = 'vault'

async function getDB(): Promise<IDBPDatabase> {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      db.createObjectStore(STORE_NAME)
    },
  })
}

export const webStorage: StorageAPI = {
  async get<T>(key: string): Promise<T | null> {
    const db = await getDB()
    const value: T | undefined = await db.get(STORE_NAME, key)
    return value ?? null
  },

  async set<T>(key: string, value: T): Promise<void> {
    const db = await getDB()
    await db.put(STORE_NAME, value, key)
  },

  async delete(key: string): Promise<void> {
    const db = await getDB()
    await db.delete(STORE_NAME, key)
  },
}

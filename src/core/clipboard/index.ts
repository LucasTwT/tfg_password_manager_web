import { isTauri } from '@/platform'
import type { ClipboardAPI } from './types'

export async function copyToClipboard(text: string): Promise<boolean> {
  const clipboard: ClipboardAPI = isTauri()
    ? await import('./tauriClipboard').then(m => m.tauriClipboard)
    : await import('./webClipboard').then(m => m.webClipboard)

  try {
    await clipboard.write(text)
    return true
  } catch {
    return false
  }
}

export type { ClipboardAPI } from './types'

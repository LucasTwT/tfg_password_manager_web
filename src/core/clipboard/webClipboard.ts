import type { ClipboardAPI } from './types'

export const webClipboard: ClipboardAPI = {
  async write(text: string): Promise<void> {
    await navigator.clipboard.writeText(text)
  },

  async read(): Promise<string> {
    return navigator.clipboard.readText()
  },
}

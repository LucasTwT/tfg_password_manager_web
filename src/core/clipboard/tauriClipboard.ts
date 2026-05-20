import { writeText, readText } from '@tauri-apps/plugin-clipboard-manager'
import type { ClipboardAPI } from './types'

export const tauriClipboard: ClipboardAPI = {
  async write(text: string): Promise<void> {
    await writeText(text)
  },

  async read(): Promise<string> {
    return readText()
  },
}
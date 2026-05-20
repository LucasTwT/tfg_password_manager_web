import { useCallback } from "react"
import { copyToClipboard } from "@/core/clipboard"
import { useGlobalStore } from "@/core/store/useGlobalStore"

export function useClipboardClear() {
  const clipboardCleaning = useGlobalStore(
    (s) => s.settings.clipboard_cleaning
  )

  const copyWithClear = useCallback(
    async (text: string): Promise<boolean> => {
      const ok = await copyToClipboard(text)
      if (ok && clipboardCleaning) {
        setTimeout(() => {
          copyToClipboard("")
        }, clipboardCleaning * 1000)
      }
      return ok
    },
    [clipboardCleaning]
  )

  return { copyWithClear }
}

import { useAppState } from "@/app/context/AppContext"
import { EmptyState } from "./EmptyState"
import { LoginDetail } from "./LoginDetail"
import { FileDetail } from "./FileDetail"
import type { Login } from "@/core/types/login"
import type { VaultFile } from "@/core/types/file"

export function ContentArea() {
  const { openTabs, activeTabId } = useAppState()

  const activeTab = openTabs.find((t) => t.id === activeTabId)

  if (!activeTab) {
    return <EmptyState />
  }

  if (activeTab.type === "login") {
    const login = activeTab.data as Login
    return <LoginDetail login={login} />
  }

  if (activeTab.type === "file") {
    const file = activeTab.data as VaultFile
    return <FileDetail file={file} />
  }

  return <EmptyState />
}

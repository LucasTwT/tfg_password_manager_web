import { useAppState } from "@/app/context/AppContext"
import { EmptyState } from "./EmptyState"
import { LoginDetail } from "./LoginDetail"
import type { Login } from "@/core/types/login"

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

  return <EmptyState />
}

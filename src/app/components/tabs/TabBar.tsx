import { useAppState, useAppDispatch } from "@/app/context/AppContext"
import { Tab } from "./Tab"

export function TabBar() {
  const { openTabs, activeTabId } = useAppState()
  const dispatch = useAppDispatch()

  if (openTabs.length === 0) return null

  return (
    <div className="flex items-center border-b border-[var(--border)] bg-[var(--card)] overflow-x-auto">
      {openTabs.map((tab) => (
        <Tab
          key={tab.id}
          tab={tab}
          isActive={tab.id === activeTabId}
          onSelect={() => dispatch({ type: "SELECT_TAB", tabId: tab.id })}
          onClose={() => dispatch({ type: "CLOSE_TAB", tabId: tab.id })}
        />
      ))}
    </div>
  )
}

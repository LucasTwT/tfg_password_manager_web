import { useAppState } from "@/app/context/AppContext"
import { cn } from "@/utils/cn"
import { SidebarHeader } from "./SidebarHeader"
import { VaultList } from "./VaultList"
import { SidebarFooter } from "./SidebarFooter"

export function Sidebar() {
  const { sidebarOpen } = useAppState()

  return (
    <aside
      className={cn(
        "flex flex-col h-full border-r border-[var(--border)] bg-[var(--card)] transition-[width] duration-200 ease-in-out overflow-hidden",
        sidebarOpen ? "w-[280px] min-w-[280px]" : "w-0 min-w-0"
      )}
    >
      <div className="flex flex-col h-full w-[280px]">
        <SidebarHeader />
        <VaultList />
        <SidebarFooter />
      </div>
    </aside>
  )
}

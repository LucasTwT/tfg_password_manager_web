import { useAppDispatch, useAppState } from "@/app/context/AppContext"
import { cn } from "@/utils/cn"
import { PanelLeftClose, PanelLeft } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { Sidebar } from "@/app/components/sidebar/Sidebar"
import { TabBar } from "@/app/components/tabs/TabBar"
import { ContentArea } from "@/app/components/content/ContentArea"
import { SettingsModal } from "@/app/components/settings/SettingsModal"

export function AppLayout() {
  const { sidebarOpen } = useAppState()
  const dispatch = useAppDispatch()

  const toggleSidebar = () => {
    dispatch({ type: "TOGGLE_SIDEBAR" })
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--background)]">
      <Sidebar />

      <div className="flex flex-col flex-1 min-w-0">
        {/* Top bar with sidebar toggle */}
        <div className="flex items-center h-10 px-2 border-b border-[var(--border)] bg-[var(--card)]">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={toggleSidebar}
            aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {sidebarOpen ? (
              <PanelLeftClose className="h-4 w-4" />
            ) : (
              <PanelLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        <TabBar />

        <main className="flex-1 overflow-hidden flex flex-col">
          <ContentArea />
        </main>
      </div>

      <SettingsModal />
    </div>
  )
}

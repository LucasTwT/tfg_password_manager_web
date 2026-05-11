import { AppProvider } from "@/app/context/AppContext"
import { AppLayout } from "@/app/layouts/AppLayout"

export default function AppView() {
  return (
    <AppProvider>
      <AppLayout />
    </AppProvider>
  )
}

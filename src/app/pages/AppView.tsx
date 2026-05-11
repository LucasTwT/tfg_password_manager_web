import { AppProvider } from "@/app/context/AppContext"
import { AppLayout } from "@/app/layouts/AppLayout"
import { useAppInit } from "@/core/hooks/useAppInit"
import { SplashScreen } from "@/app/components/ui/SplashScreen"

function AppContent() {
  const { ready } = useAppInit()

  if (!ready) {
    return <SplashScreen />
  }

  return <AppLayout />
}

export default function AppView() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}

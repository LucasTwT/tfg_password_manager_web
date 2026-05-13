import { useEffect } from "react"
import { AppProvider } from "@/app/context/AppContext"
import { AppLayout } from "@/app/layouts/AppLayout"
import { useAppInit } from "@/core/hooks/useAppInit"
import { useCryptoGuard } from "@/core/hooks/useCryptoGuard"
import { SplashScreen } from "@/app/components/ui/SplashScreen"

function AppContent() {
  const { ready } = useAppInit()
  const { ready: cryptoReady, requestUnlock, PasswordDialog } = useCryptoGuard()

  // After app init, check if crypto context exists
  useEffect(() => {
    if (ready && !cryptoReady) {
      requestUnlock() // Show password dialog immediately
    }
  }, [ready, cryptoReady, requestUnlock])

  if (!ready) {
    return <SplashScreen />
  }

  // Block rendering until crypto context is ready
  if (!cryptoReady) {
    return (
      <>
        <SplashScreen />
        {PasswordDialog}
      </>
    )
  }

  return (
    <>
      <AppLayout />
      {PasswordDialog}
    </>
  )
}

export default function AppView() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}

import { Outlet } from "react-router-dom"
import { useTheme } from "@/app/providers/ThemeProvider"
import { useAutoLogin } from "@/core/hooks/Auth/useAutoLogin"
import { SplashScreen } from "@/app/components/ui/SplashScreen"
import { Moon, Sun } from "lucide-react"

export default function AuthLayout() {
  const { theme, toggleTheme } = useTheme()
  const { checking } = useAutoLogin()

  if (checking) {
    return <SplashScreen />
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] p-4">
      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 p-2 rounded-lg bg-[var(--card)] border border-[var(--border)] hover:bg-[var(--accent)] transition-colors cursor-pointer"
        aria-label="Toggle theme"
      >
        {theme === "dark" ? (
          <Sun className="w-5 h-5 text-[var(--foreground)]" />
        ) : (
          <Moon className="w-5 h-5 text-[var(--foreground)]" />
        )}
      </button>

      {/* Auth card */}
      <div className="w-full max-w-[420px]">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[var(--foreground)]">
            DarkVault
          </h1>
          <p className="text-[var(--muted-foreground)] mt-2">
            Secure Password Manager
          </p>
        </div>

        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 shadow-lg shadow-[var(--primary)]/5">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

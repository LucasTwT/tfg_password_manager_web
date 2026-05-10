import { Shield } from "lucide-react"

export function SplashScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
      <div className="flex flex-col items-center gap-6 animate-in fade-in duration-500">
        <div className="relative">
          <div className="absolute inset-0 bg-[var(--primary)]/20 blur-2xl rounded-full" />
          <Shield className="h-16 w-16 text-[var(--primary)] relative" />
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[var(--foreground)]">DarkVault</h1>
          <p className="text-[var(--muted-foreground)] text-sm mt-1">Loading...</p>
        </div>
        <div className="flex gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[var(--primary)] animate-bounce [animation-delay:-0.3s]" />
          <span className="h-2 w-2 rounded-full bg-[var(--primary)] animate-bounce [animation-delay:-0.15s]" />
          <span className="h-2 w-2 rounded-full bg-[var(--primary)] animate-bounce" />
        </div>
      </div>
    </div>
  )
}

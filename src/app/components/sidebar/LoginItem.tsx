import { KeyRound } from "lucide-react"
import { useAppDispatch } from "@/app/context/AppContext"
import { cn } from "@/utils/cn"
import type { Login } from "@/core/types/login"

interface LoginItemProps {
  login: Login
}

export function LoginItem({ login }: LoginItemProps) {
  const dispatch = useAppDispatch()

  const handleClick = () => {
    dispatch({
      type: "OPEN_TAB",
      tab: {
        id: login.id,
        type: "login",
        title: login.title || login.username || login.email || "Untitled",
        data: login,
      },
    })
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        "w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors cursor-pointer",
        "hover:bg-[var(--accent)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
      )}
    >
      <KeyRound className="h-3.5 w-3.5 shrink-0" />
      <span className="truncate">{login.title || login.username || login.email}</span>
    </button>
  )
}

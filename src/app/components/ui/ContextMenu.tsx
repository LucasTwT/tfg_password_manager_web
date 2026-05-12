import { useEffect, useRef, useCallback, type ReactNode } from "react"
import { createPortal } from "react-dom"
import { cn } from "@/utils/cn"

export interface ContextMenuItem {
  label: string
  icon: ReactNode
  onClick: () => void
  destructive?: boolean
}

interface ContextMenuProps {
  items: ContextMenuItem[]
  x: number
  y: number
  onClose: () => void
}

export function ContextMenu({ items, x, y, onClose }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)

  const handleClickOutside = useCallback(
    (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose()
      }
    },
    [onClose]
  )

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    },
    [onClose]
  )

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleEscape)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [handleClickOutside, handleEscape])

  // Clamp position so the menu stays on screen
  useEffect(() => {
    if (!menuRef.current) return
    const rect = menuRef.current.getBoundingClientRect()
    const vw = window.innerWidth
    const vh = window.innerHeight

    if (rect.right > vw) {
      menuRef.current.style.left = `${vw - rect.width - 4}px`
    }
    if (rect.bottom > vh) {
      menuRef.current.style.top = `${vh - rect.height - 4}px`
    }
  }, [x, y])

  return createPortal(
    <div
      ref={menuRef}
      className="fixed z-[9999] min-w-[160px] rounded-md border border-[var(--border)] bg-[var(--popover)] p-1 shadow-lg"
      style={{ left: x, top: y }}
    >
      {items.map((item) => (
        <button
          key={item.label}
          onClick={() => {
            item.onClick()
            onClose()
          }}
          className={cn(
            "flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm cursor-pointer",
            "transition-colors outline-none",
            item.destructive
              ? "text-red-500 hover:bg-red-500/10 focus:bg-red-500/10"
              : "text-[var(--foreground)] hover:bg-[var(--accent)] focus:bg-[var(--accent)]"
          )}
        >
          {item.icon}
          {item.label}
        </button>
      ))}
    </div>,
    document.body
  )
}

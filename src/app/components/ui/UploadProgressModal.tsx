import { Loader2, X } from "lucide-react"
import { Button } from "@/app/components/ui/button"

interface UploadProgressModalProps {
  open: boolean
  fileName: string | null
  percent: number
  onClose: () => void
}

export function UploadProgressModal({ open, fileName, percent, onClose }: UploadProgressModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-lg w-full max-w-sm mx-4">
        <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <h3 className="text-sm font-medium text-[var(--foreground)]">Uploading file</h3>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-4 space-y-3">
          <div className="text-sm text-[var(--foreground)] truncate">
            {fileName || "Uploading..."}
          </div>
          <div className="w-full h-2 bg-[var(--muted)] rounded">
            <div
              className="h-2 bg-[var(--primary)] rounded"
              style={{ width: `${percent}%` }}
            />
          </div>
          <div className="text-xs text-[var(--muted-foreground)]">
            {percent}%
          </div>
        </div>
      </div>
    </div>
  )
}

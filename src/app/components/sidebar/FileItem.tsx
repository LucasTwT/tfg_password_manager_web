import { File, Loader2 } from "lucide-react"
import { useAppDispatch } from "@/app/context/AppContext"
import { cn } from "@/utils/cn"
import type { VaultFile } from "@/core/types/file"

interface FileItemProps {
  file: VaultFile
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function FileItem({ file }: FileItemProps) {
  const dispatch = useAppDispatch()

  const handleClick = () => {
    dispatch({
      type: "OPEN_TAB",
      tab: {
        id: file.id,
        type: "file",
        title: file.fileName || "File",
        data: file,
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
      {file.status === "uploading" ? (
        <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin" />
      ) : (
        <File className="h-3.5 w-3.5 shrink-0" />
      )}
      <span className="truncate">{file.fileName || "File"}</span>
      <span className="ml-auto text-xs text-[var(--muted-foreground)]">{formatFileSize(file.size)}</span>
    </button>
  )
}

import type { FileData } from "@/core/services/crypto/types"

/**
 * Web file picker using the File API.
 * Returns a function that opens a file input dialog and resolves to selected files.
 */
export function usePickFile() {
    async function pickFile(): Promise<{ selectedFiles: FileData[]; selectedUris: File[] } | null> {
        return new Promise((resolve) => {
            const input = document.createElement("input")
            input.type = "file"
            input.multiple = true

            input.onchange = () => {
                const fileList = input.files
                if (!fileList || fileList.length === 0) {
                    resolve(null)
                    return
                }

                const files: FileData[] = []
                const fileObjects: File[] = []

                Array.from(fileList).forEach((file, idx) => {
                    files[idx] = { fileName: file.name, note: "", tags: "", chunks: [] }
                    fileObjects.push(file)
                })

                resolve({ selectedFiles: files, selectedUris: fileObjects })
            }

            input.oncancel = () => resolve(null)
            input.click()
        })
    }

    return { pickFile }
}

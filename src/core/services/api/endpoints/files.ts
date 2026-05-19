import { API_URL } from "../constants"
import { apiFetch } from "../httpClient"

export async function initFileUpload(
  vaultId: string,
  metadata: { cipher_metadata: string; metadata_nonce: string; size: number }
): Promise<{ response: any; status: boolean; error?: string }> {
  console.log("[apiInitFileUpload] Request started", { vaultId, size: metadata.size })

  try {
    const response = await apiFetch(`${API_URL}/file/upload/init?vault_id=${vaultId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(metadata),
    })

    console.log("[apiInitFileUpload] HTTP response status", response.status)

    if (!response.ok) {
      const errorData = await response.json()
      console.error("[apiInitFileUpload] FAIL", { status: response.status, errorData })
      return {
        response: errorData,
        status: false,
        error: errorData.detail || errorData.message || `HTTP ${response.status}`,
      }
    }

    const responseData = await response.json()
    console.log("[apiInitFileUpload] SUCCESS", responseData)
    return { response: responseData, status: true }
  } catch (error) {
    console.error("[apiInitFileUpload] FAIL: Exception", error)
    return { response: error, status: false, error: error instanceof Error ? error.message : "Network error" }
  }
}

export async function uploadFileChunk(
  uploadId: string,
  chunk: { seq: number; offset: number; length: number; nonce: string; ciphertext: string }
): Promise<{ response: any; status: boolean; error?: string }> {
  console.log("[apiUploadFileChunk] Request started", { uploadId, seq: chunk.seq })

  try {
    const response = await apiFetch(`${API_URL}/file/upload/${uploadId}/chunk`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(chunk),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("[apiUploadFileChunk] FAIL", { status: response.status, errorData })
      return {
        response: errorData,
        status: false,
        error: errorData.detail || errorData.message || `HTTP ${response.status}`,
      }
    }

    const responseData = await response.json()
    return { response: responseData, status: true }
  } catch (error) {
    console.error("[apiUploadFileChunk] FAIL: Exception", error)
    return { response: error, status: false, error: error instanceof Error ? error.message : "Network error" }
  }
}

export async function completeFileUpload(
  uploadId: string
): Promise<{ response: any; status: boolean; error?: string }> {
  console.log("[apiCompleteFileUpload] Request started", { uploadId })

  try {
    const response = await apiFetch(`${API_URL}/file/upload/${uploadId}/complete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("[apiCompleteFileUpload] FAIL", { status: response.status, errorData })
      return {
        response: errorData,
        status: false,
        error: errorData.detail || errorData.message || `HTTP ${response.status}`,
      }
    }

    const responseData = await response.json()
    console.log("[apiCompleteFileUpload] SUCCESS", responseData)
    return { response: responseData, status: true }
  } catch (error) {
    console.error("[apiCompleteFileUpload] FAIL: Exception", error)
    return { response: error, status: false, error: error instanceof Error ? error.message : "Network error" }
  }
}

export async function getFileMetadata(
  fileId: string
): Promise<{ response: any; status: boolean; error?: string }> {
  console.log("[apiGetFileMetadata] Request started", { fileId })

  try {
    const response = await apiFetch(`${API_URL}/file/${fileId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("[apiGetFileMetadata] FAIL", { status: response.status, errorData })
      return {
        response: errorData,
        status: false,
        error: errorData.detail || errorData.message || `HTTP ${response.status}`,
      }
    }

    const responseData = await response.json()
    console.log("[apiGetFileMetadata] SUCCESS")
    return { response: responseData, status: true }
  } catch (error) {
    console.error("[apiGetFileMetadata] FAIL: Exception", error)
    return { response: error, status: false, error: error instanceof Error ? error.message : "Network error" }
  }
}

export async function getFileChunks(
  fileId: string
): Promise<{ response: any; status: boolean; error?: string }> {
  console.log("[apiGetFileChunks] Request started", { fileId })

  try {
    const response = await apiFetch(`${API_URL}/file/${fileId}/chunks`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("[apiGetFileChunks] FAIL", { status: response.status, errorData })
      return {
        response: errorData,
        status: false,
        error: errorData.detail || errorData.message || `HTTP ${response.status}`,
      }
    }

    const responseData = await response.json()
    console.log("[apiGetFileChunks] SUCCESS", { chunkCount: responseData.chunks?.length })
    return { response: responseData, status: true }
  } catch (error) {
    console.error("[apiGetFileChunks] FAIL: Exception", error)
    return { response: error, status: false, error: error instanceof Error ? error.message : "Network error" }
  }
}

export async function listFilesByVault(
  vaultId: string
): Promise<{ response: any; status: boolean; error?: string }> {
  console.log("[apiListFilesByVault] Request started", { vaultId })

  try {
    const response = await apiFetch(`${API_URL}/file/vault/${vaultId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("[apiListFilesByVault] FAIL", { status: response.status, errorData })
      return {
        response: errorData,
        status: false,
        error: errorData.detail || errorData.message || `HTTP ${response.status}`,
      }
    }

    const responseData = await response.json()
    console.log("[apiListFilesByVault] SUCCESS", { fileCount: responseData.files?.length })
    return { response: responseData, status: true }
  } catch (error) {
    console.error("[apiListFilesByVault] FAIL: Exception", error)
    return { response: error, status: false, error: error instanceof Error ? error.message : "Network error" }
  }
}

export async function startDeleteFile(): Promise<{ response: any; status: boolean; error?: string }> {
  console.log("[apiStartDeleteFile] Request started")

  try {
    const response = await apiFetch(`${API_URL}/file/start`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("[apiStartDeleteFile] FAIL", { status: response.status, errorData })
      return { response: errorData, status: false }
    }

    return { response: await response.json(), status: true }
  } catch (error) {
    console.error("[apiStartDeleteFile] FAIL: Exception", error)
    return { response: error, status: false }
  }
}

export async function finishDeleteFile(
  fileId: string,
  signature: string
): Promise<{ response: any; status: boolean; error?: string }> {
  console.log("[apiFinishDeleteFile] Request started", { fileId })

  try {
    const response = await apiFetch(`${API_URL}/file/${fileId}/finish`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ signature }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("[apiFinishDeleteFile] FAIL", { status: response.status, errorData })
      return { response: errorData, status: false }
    }

    return { response: await response.json(), status: true }
  } catch (error) {
    console.error("[apiFinishDeleteFile] FAIL: Exception", error)
    return { response: error, status: false }
  }
}

import { isTauri } from '@/platform'

/**
 * Platform-aware fetch that resolves to the Tauri HTTP plugin
 * when running inside the desktop shell, and falls back to
 * the browser's native fetch otherwise.
 */
export async function platformFetch(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  if (isTauri()) {
    const { fetch: tauriFetch } = await import('@tauri-apps/plugin-http')
    return tauriFetch(url, {
      method: options.method,
      headers: options.headers as Record<string, string>,
      body: options.body,
    })
  }

  // Browser: ensure cookies are sent with requests
  return fetch(url, {
    ...options,
    credentials: options.credentials ?? 'include',
  })
}
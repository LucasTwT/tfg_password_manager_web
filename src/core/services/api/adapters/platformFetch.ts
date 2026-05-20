import { isTauri } from '@/platform'

/**
 * Platform-aware fetch that delegates to the Tauri HTTP plugin
 * when running inside the desktop shell, and falls back to
 * the browser's native fetch otherwise.
 *
 * In Tauri: the HTTP plugin routes requests through the Rust layer,
 * bypassing CORS and handling cookies natively.
 *
 * In browser: native fetch with `credentials: "include"` for HttpOnly cookies.
 */
export async function platformFetch(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  if (isTauri()) {
    const { fetch: tauriFetch } = await import('@tauri-apps/plugin-http')
    return tauriFetch(url, options)
  }

  // Browser: send cookies with every request by default
  return fetch(url, {
    ...options,
    credentials: options.credentials ?? 'include',
  })
}
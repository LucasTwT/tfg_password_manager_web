/**
 * Platform detection for hybrid web/Tauri architecture.
 *
 * Tauri injects `__TAURI_INTERNALS__` on the window object when running
 * inside the desktop shell. We use that as the single source of truth.
 */
export const isTauri = (): boolean =>
  typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window
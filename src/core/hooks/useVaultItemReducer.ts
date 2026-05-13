import { useReducer, useCallback } from "react"
import type { Login } from "@/core/types/login"

/**
 * VaultItemReducer state management
 * Extracts all UI state logic from VaultItem component
 */

interface VaultItemState {
  /** Context menu position {x, y} or null if closed */
  contextMenu: { x: number; y: number } | null
  /** Whether edit modal is open */
  editModal: boolean
  /** Whether delete flow is active */
  deleteFlow: boolean
  /** List of logins loaded for this vault */
  logins: Login[]
  /** Whether logins are currently being loaded */
  loadingLogins: boolean
  /** Whether create login modal is open */
  createModal: boolean
}

type VaultItemAction =
  | { type: "SET_CONTEXT_MENU"; position: { x: number; y: number } | null }
  | { type: "SET_EDIT_MODAL"; open: boolean }
  | { type: "SET_DELETE_FLOW"; open: boolean }
  | { type: "SET_LOGINS"; logins: Login[] }
  | { type: "UPDATE_LOGIN"; loginId: string; updates: Partial<Login> }
  | { type: "SET_LOADING"; loading: boolean }
  | { type: "SET_CREATE_MODAL"; open: boolean }
  | { type: "RESET" }

const initialState: VaultItemState = {
  contextMenu: null,
  editModal: false,
  deleteFlow: false,
  logins: [],
  loadingLogins: false,
  createModal: false,
}

function vaultItemReducer(state: VaultItemState, action: VaultItemAction): VaultItemState {
  switch (action.type) {
    case "SET_CONTEXT_MENU":
      return { ...state, contextMenu: action.position }
    case "SET_EDIT_MODAL":
      return { ...state, editModal: action.open }
    case "SET_DELETE_FLOW":
      return { ...state, deleteFlow: action.open }
    case "SET_LOGINS":
      return { ...state, logins: action.logins }
    case "UPDATE_LOGIN":
      return {
        ...state,
        logins: state.logins.map((login) =>
          login.id === action.loginId ? { ...login, ...action.updates } : login
        ),
      }
    case "SET_LOADING":
      return { ...state, loadingLogins: action.loading }
    case "SET_CREATE_MODAL":
      return { ...state, createModal: action.open }
    case "RESET":
      return initialState
    default:
      return state
  }
}

export function useVaultItemReducer() {
  const [state, dispatch] = useReducer(vaultItemReducer, initialState)

  /** Open or close context menu at position */
  const setContextMenu = useCallback((position: { x: number; y: number } | null) => {
    dispatch({ type: "SET_CONTEXT_MENU", position })
  }, [])

  /** Open or close edit modal */
  const setEditModal = useCallback((open: boolean) => {
    dispatch({ type: "SET_EDIT_MODAL", open })
  }, [])

  /** Start or cancel delete flow */
  const setDeleteFlow = useCallback((open: boolean) => {
    dispatch({ type: "SET_DELETE_FLOW", open })
  }, [])

  /** Set loaded logins list */
  const setLogins = useCallback((logins: Login[]) => {
    dispatch({ type: "SET_LOGINS", logins })
  }, [])

  /** Update a specific login in the list */
  const updateLogin = useCallback((loginId: string, updates: Partial<Login>) => {
    dispatch({ type: "UPDATE_LOGIN", loginId, updates })
  }, [])

  /** Set loading state for logins */
  const setLoading = useCallback((loading: boolean) => {
    dispatch({ type: "SET_LOADING", loading })
  }, [])

  /** Open or close create login modal */
  const setCreateModal = useCallback((open: boolean) => {
    dispatch({ type: "SET_CREATE_MODAL", open })
  }, [])

  /** Reset all state to initial values */
  const reset = useCallback(() => {
    dispatch({ type: "RESET" })
  }, [])

  return {
    state,
    setContextMenu,
    setEditModal,
    setDeleteFlow,
    setLogins,
    updateLogin,
    setLoading,
    setCreateModal,
    reset,
  }
}

import { createContext, useContext, useReducer, type Dispatch, type ReactNode } from "react"
import type { Login } from "@/core/types/login"

// --- Types ---

export interface Tab {
  id: string
  type: "login" | "file"
  title: string
  data: Login | FileData
}

export interface FileData {
  id: string
  name: string
  vaultId: string
}

export interface AppState {
  sidebarOpen: boolean
  activeVaultId: string | null
  expandedVaultIds: Set<string>
  openTabs: Tab[]
  activeTabId: string | null
  searchQuery: string
  settingsOpen: boolean
}

export type AppAction =
  | { type: "TOGGLE_SIDEBAR" }
  | { type: "SELECT_VAULT"; vaultId: string }
  | { type: "TOGGLE_VAULT_EXPAND"; vaultId: string }
  | { type: "OPEN_TAB"; tab: Tab }
  | { type: "CLOSE_TAB"; tabId: string }
  | { type: "SELECT_TAB"; tabId: string }
  | { type: "SET_SEARCH_QUERY"; query: string }
  | { type: "TOGGLE_SETTINGS" }

// --- Reducer ---

const initialState: AppState = {
  sidebarOpen: true,
  activeVaultId: null,
  expandedVaultIds: new Set<string>(),
  openTabs: [],
  activeTabId: null,
  searchQuery: "",
  settingsOpen: false,
}

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "TOGGLE_SIDEBAR":
      return { ...state, sidebarOpen: !state.sidebarOpen }

    case "SELECT_VAULT":
      return { ...state, activeVaultId: action.vaultId }

    case "TOGGLE_VAULT_EXPAND": {
      const next = new Set(state.expandedVaultIds)
      if (next.has(action.vaultId)) {
        next.delete(action.vaultId)
      } else {
        next.add(action.vaultId)
      }
      return { ...state, expandedVaultIds: next }
    }

    case "OPEN_TAB": {
      const exists = state.openTabs.find((t) => t.id === action.tab.id)
      if (exists) {
        return { ...state, activeTabId: action.tab.id }
      }
      return {
        ...state,
        openTabs: [...state.openTabs, action.tab],
        activeTabId: action.tab.id,
      }
    }

    case "CLOSE_TAB": {
      const filtered = state.openTabs.filter((t) => t.id !== action.tabId)
      let nextActive = state.activeTabId
      if (state.activeTabId === action.tabId) {
        const idx = state.openTabs.findIndex((t) => t.id === action.tabId)
        nextActive = filtered[Math.min(idx, filtered.length - 1)]?.id ?? null
      }
      return { ...state, openTabs: filtered, activeTabId: nextActive }
    }

    case "SELECT_TAB":
      return { ...state, activeTabId: action.tabId }

    case "SET_SEARCH_QUERY":
      return { ...state, searchQuery: action.query }

    case "TOGGLE_SETTINGS":
      return { ...state, settingsOpen: !state.settingsOpen }

    default:
      return state
  }
}

// --- Context ---

const AppStateContext = createContext<AppState>(initialState)
const AppDispatchContext = createContext<Dispatch<AppAction>>(() => {})

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState)
  return (
    <AppStateContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>
        {children}
      </AppDispatchContext.Provider>
    </AppStateContext.Provider>
  )
}

export function useAppState(): AppState {
  return useContext(AppStateContext)
}

export function useAppDispatch(): Dispatch<AppAction> {
  return useContext(AppDispatchContext)
}

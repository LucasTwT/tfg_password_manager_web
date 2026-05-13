import { useReducer, useCallback } from "react"

/**
 * LoginFormReducer state management
 * Extracts all form state logic from LoginFormModal component
 */

interface LoginFormState {
  /** Form title - the name identifier for the login */
  title: string
  /** Username for the login */
  username: string
  /** Email address for the login */
  email: string
  /** Password for the login */
  password: string
  /** URL associated with the login */
  url: string
  /** Additional notes or comments */
  notes: string
  /** Whether save operation is in progress */
  saving: boolean
  /** Validation error message for title field */
  titleError: string
}

type LoginFormAction =
  | { type: "SET_FIELD"; field: keyof Omit<LoginFormState, "saving" | "titleError">; value: string }
  | { type: "SET_SAVING"; value: boolean }
  | { type: "SET_TITLE_ERROR"; value: string }
  | { type: "RESET"; initialValues?: Partial<LoginFormState> }
  | { type: "VALIDATE" }

const initialState: LoginFormState = {
  title: "",
  username: "",
  email: "",
  password: "",
  url: "",
  notes: "",
  saving: false,
  titleError: "",
}

function loginFormReducer(state: LoginFormState, action: LoginFormAction): LoginFormState {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value }
    case "SET_SAVING":
      return { ...state, saving: action.value }
    case "SET_TITLE_ERROR":
      return { ...state, titleError: action.value }
    case "RESET":
      return { ...initialState, ...action.initialValues }
    case "VALIDATE":
      return { ...state, titleError: state.title.trim() ? "" : "Title is required" }
    default:
      return state
  }
}

export function useLoginFormReducer(initialValues?: Partial<LoginFormState>) {
  const [state, dispatch] = useReducer(loginFormReducer, { ...initialState, ...initialValues })

  /** Set a specific form field value */
  const setField = useCallback((field: keyof Pick<LoginFormState, "title" | "username" | "email" | "password" | "url" | "notes">, value: string) => {
    dispatch({ type: "SET_FIELD", field, value })
  }, [])

  /** Set saving state */
  const setSaving = useCallback((value: boolean) => {
    dispatch({ type: "SET_SAVING", value })
  }, [])

  /** Set title validation error */
  const setTitleError = useCallback((value: string) => {
    dispatch({ type: "SET_TITLE_ERROR", value })
  }, [])

  /** Validate title field - returns true if valid */
  const validate = useCallback((): boolean => {
    const trimmed = state.title.trim()
    if (!trimmed) {
      dispatch({ type: "SET_TITLE_ERROR", value: "Title is required" })
      return false
    }
    dispatch({ type: "SET_TITLE_ERROR", value: "" })
    return true
  }, [state.title])

  /** Reset form to initial state */
  const reset = useCallback((newInitialValues?: Partial<LoginFormState>) => {
    dispatch({ type: "RESET", initialValues: newInitialValues })
  }, [])

  return {
    state,
    setField,
    setSaving,
    setTitleError,
    validate,
    reset,
  }
}

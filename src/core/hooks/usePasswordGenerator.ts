import { useReducer, useCallback, useMemo } from "react"
import {
  type PasswordGeneratorOptions,
  type GenerateKeyState,
  type UpdatePayload,
  PasswordType,
} from "@/core/reducers/Create/useGenerateKeyTypes"
import { generatePassword } from "@/core/services/crypto"
import {
  calculatePasswordStrength,
  getPasswordStrengthLabel,
} from "@/core/utils/passwordStrength"

const initialState: GenerateKeyState = {
  keyOptions: {
    type: PasswordType.random,
    length: 20,
    includeUppercase: true,
    includeNumbers: true,
    includeSymbols: true,
    avoidAmbiguous: true,
    allowRepeating: true,
    wordsCount: 4,
    excludeWeakWords: false,
  },
  password: "",
  regenerateBtn: false,
}

type Action =
  | { type: "SET_OPTION"; payload: UpdatePayload }
  | { type: "SET_TYPE"; payload: PasswordType }
  | { type: "REGENERATE" }

function reducer(state: GenerateKeyState, action: Action): GenerateKeyState {
  switch (action.type) {
    case "SET_OPTION":
      return {
        ...state,
        keyOptions: {
          ...state.keyOptions,
          [action.payload.field]: action.payload.value,
        },
      }
    case "SET_TYPE":
      return {
        ...state,
        keyOptions: { ...state.keyOptions, type: action.payload },
      }
    case "REGENERATE":
      return {
        ...state,
        password: generatePassword(state.keyOptions),
      }
    default:
      return state
  }
}

export function usePasswordGenerator() {
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    password: generatePassword(initialState.keyOptions),
  })

  const setOption = useCallback(
    (field: keyof PasswordGeneratorOptions, value: boolean | number) => {
      dispatch({
        type: "SET_OPTION",
        payload: { field, value } as UpdatePayload,
      })
    },
    []
  )

  const setType = useCallback((type: PasswordType) => {
    dispatch({ type: "SET_TYPE", payload: type })
  }, [])

  const regenerate = useCallback(() => {
    dispatch({ type: "REGENERATE" })
  }, [])

  const strength = useMemo(
    () => calculatePasswordStrength(state.password),
    [state.password]
  )

  const strengthLabel = getPasswordStrengthLabel(strength)

  return { state, setOption, setType, regenerate, strength, strengthLabel }
}

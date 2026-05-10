import type { ErrorLogindata, Logindata } from "@/core/reducers/Create/useCreateLogin.d"
import { loginValidators } from "@/core/utils/validations/Create"

export function validateLoginForm(
  data: Logindata,
  t: (key: string, opts?: Record<string, unknown>) => string,
): { isValid: boolean; errors: Partial<ErrorLogindata> } {
  const errors: Partial<ErrorLogindata> = {};

  (Object.keys(data) as (keyof Logindata)[]).forEach((field) => {
    const validator = loginValidators[field];
    const error = validator(data[field], t);

    if (error) {
      errors[field] = error;
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

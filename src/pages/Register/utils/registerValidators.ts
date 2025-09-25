import * as Yup from "yup";
import { RegisterCredentials } from "../types/registerTypes";

export const registerValidationSchema = Yup.object({
  email: Yup.string()
    .email("Please enter a valid email")
    .required("Please Enter Your Email"),
  username: Yup.string()
    .min(3, "Username must be at least 3 characters")
    .required("Please Enter Your Username"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Please Enter Your Password"),
});

export const validateRegisterForm = (values: RegisterCredentials) => {
  try {
    registerValidationSchema.validateSync(values, { abortEarly: false });
    return { isValid: true, errors: {} };
  } catch (error: any) {
    const errors: Record<string, string> = {};
    if (error.inner) {
      error.inner.forEach((err: any) => {
        errors[err.path] = err.message;
      });
    }
    return { isValid: false, errors };
  }
};

export const sanitizeRegisterInput = (input: RegisterCredentials): RegisterCredentials => ({
  email: input.email.toLowerCase().trim(),
  username: input.username.trim(),
  password: input.password,
});
import * as yup from "yup"
export const emailValidationSchema = yup.object().shape({
    email: yup
    .string()
    .trim()
    .required("Email is required")
    .email("Invalid email format"),
  });
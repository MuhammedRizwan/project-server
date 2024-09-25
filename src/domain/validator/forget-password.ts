import * as yup from "yup"
export const passwordValidationSchema = yup.object().shape({
    email: yup
    .string()
    .trim()
    .required("Email is required")
    .email("Invalid email format"),
    password: yup
    .string()
    .trim()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase character")
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must contain at least one special character"
    ),
    confirmPassword: yup
    .string()
    .trim()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm password is required")
  });
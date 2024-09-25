import * as yup from "yup";
const userLoginSchema = yup.object({
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
        .matches(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character"),
});
export default userLoginSchema

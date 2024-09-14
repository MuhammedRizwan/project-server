import * as yup from "yup";

// Signup Schema
export const userSignupSchema = yup.object({
    username: yup
        .string()
        .trim()
        .required("Username is required")
        .min(5, "Username must be at least 5 characters"),
    
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
    
    phone: yup
        .string()
        .trim()
        .required("Phone number is required")
        .matches(/^\d{10}$/, "Phone number must be exactly 10 digits"),
    
    confirmPassword: yup
        .string()
        .trim()
        .oneOf([yup.ref('password')], 'Passwords must match') 
        .required("Confirm password is required")
});

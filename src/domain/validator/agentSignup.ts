import * as yup from "yup";
const agentSignupSchema = yup.object({
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
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must contain at least one special character"
    ),

  phone: yup
    .string()
    .trim()
    .required("Phone number is required")
    .matches(/^\d{10}$/, "Phone number must be exactly 10 digits"),

  confirmPassword: yup
    .string()
    .trim()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
  location: yup
    .string()
    .trim()
    .required("Location is required")
    .matches(
      /^[a-zA-Z0-9- ]+$/,
      "Location can only contain alphabetic, numeric characters, hyphens, and spaces"
    ),
    document: yup
    .mixed()
    .required("Document is required")
    .test(
      "fileType",
      "Unsupported file format. Only images (JPG, PNG, GIF) and PDF files are allowed.",
      (value) => {
        if (!value) return false; 
        const file = value as File; 
        const supportedFormats = ["image/jpeg", "image/png", "image/gif", "application/pdf"];
        return supportedFormats.includes(file.type);
      }
    )
    .test(
      "fileSize",
      "File size is too large. Maximum allowed size is 5MB.",
      (value) => {
        if (!value) return false; 
        const file = value as File; 
        return file.size <= 5 * 1024 * 1024; 
      }
    ),
});
export default agentSignupSchema;

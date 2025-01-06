import * as yup from "yup";
export const userLoginSchema = yup.object({
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
});

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
});

export const profile_schema = yup.object().shape({
  username: yup.string().max(50, "Username cannot exceed 50 characters"),
  lastname: yup.string().max(50, "Last name cannot exceed 50 characters"),
  email: yup
    .string()
    .email("Invalid email address")
    .notRequired(),
  phone: yup
    .string()
    .matches(/^[0-9]{10}$/, "Phone number must be 10  digits") // Optional, must be numeric with length constraints
    .notRequired(),
  address: yup
    .string()
    .max(100, "Address cannot exceed 100 characters") // Optional, max length of 100
    .notRequired(),
});

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
    .required("Confirm password is required"),
});

export const emailValidationSchema = yup.object().shape({
  email: yup
    .string()
    .trim()
    .required("Email is required")
    .email("Invalid email format"),
});

export const password_validate = yup.object().shape({
  oldPassword: yup
    .string()
    .trim()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase character")
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must contain at least one special character"
    ),
});
export const password_reset_validate = yup.object().shape({
  newPassword: yup
    .string()
    .trim()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase character")
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must contain at least one special character"
    ),
});

export const booking_payload = yup.object().shape({
  bill_details: yup.object().shape({
    first_name: yup
      .string()
      .required("First name is required")
      .max(50, "First name cannot exceed 50 characters"),
    last_name: yup
      .string()
      .required("Last name is required")
      .max(50, "Last name cannot exceed 50 characters"),
    email: yup
      .string()
      .email("Invalid email address")
      .required("Email is required"),
    phone: yup
      .string()
      .matches(
        /^[0-9]{10,15}$/,
        "Phone number must be between 10 and 15 digits"
      )
      .required("Phone number is required"),
    address: yup
      .string()
      .max(100, "Address cannot exceed 100 characters")
      .required("Address is required"),
  }),
  members: yup
    .array()
    .of(
      yup.object().shape({
        name: yup.string().required("Member name is required"),
        age: yup
          .number()
          .required("Member age is required")
          .min(0, "Age must be a positive number"),
      })
    )
    .min(1, "At least one member is required"),
  package_id: yup.string().required("Package ID is required"),
  user_id: yup.string().required("User ID is required"),
  coupon_id: yup.string().nullable(), // Coupon ID is optional
  start_date: yup
    .date()
    .required("Start date is required")
    .min(new Date(), "Start date cannot be in the past"),
  payment_status: yup
    .string()
    .oneOf(
      ["pending", "paid"],
      'Payment status must be either "pending" or "paid"'
    )
    .required("Payment status is required"),
});

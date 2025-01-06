import * as yup from "yup";
export const admin_login = yup.object({
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


export const category_schema = yup.object().shape({
    category_name: yup.string().required("Category name is required."),
    createdAt: yup
        .date()
        .notRequired()
        .typeError("Invalid date format for createdAt."),
    updatedAt: yup
        .date()
        .notRequired()
        .typeError("Invalid date format for updatedAt."),
    description: yup.string().required("Description is required."),
    is_block: yup.boolean().notRequired(),
    __v: yup.number().notRequired(),
    _id: yup
        .string()
        .matches(/^[a-fA-F0-9]{24}$/, "_id must be a valid MongoDB ObjectId.")
        .notRequired(),
});


export const coupon_schema = yup.object().shape({
    coupon_code: yup
      .string()
      .min(3, "Coupon code must be at least 3 characters long")
      .max(10, "Coupon code cannot exceed 10 characters")
      .required("Coupon code is required"),
  
    description: yup
      .string()
      .max(255, "Description cannot exceed 255 characters")
      .required("Description is required"),
  
    is_active: yup
      .boolean()
      .required("Is_active is required"),
  
    max_amount: yup
      .number()
      .typeError("Max amount must be a number")
      .min(1, "Max amount must be at least 1")
      .required("Max amount is required"),
  
    min_amount: yup
      .number()
      .typeError("Min amount must be a number")
      .min(1, "Min amount must be at least 1")
      .required("Min amount is required"),
  
    percentage: yup
      .number()
      .typeError("Percentage must be a number")
      .min(1, "Percentage must be at least 1")
      .max(100, "Percentage cannot exceed 100")
      .required("Percentage is required"),
  
    valid_upto: yup
      .date()
      .min(new Date(), "Valid_upto must be a future date")
      .required("Valid_upto is required"),
  });
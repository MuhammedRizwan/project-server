import * as yup from "yup";
export const agent_signup = yup.object({
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
        const supportedFormats = [
          "image/jpeg",
          "image/png",
          "image/gif",
          "application/pdf",
        ];
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

export const agent_login = yup.object({
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

export const agent_passwordValidation = yup.object().shape({
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

export const agent_email_validationS = yup.object().shape({
  email: yup
    .string()
    .trim()
    .required("Email is required")
    .email("Invalid email format"),
});

export const agent_password_validate = yup.object().shape({
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

export const agent_password_reset_validate = yup.object().shape({
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

export const agent_profile = yup.object().shape({
  agency_name: yup
    .string()
    .min(3, "Agency name must be at least 3 characters long")
    .required("Agency name is required"),
  email: yup
    .string()
    .email("Email must be a valid email address")
    .required("Email is required"),

  location: yup.string().required("Location is required"),

  phone: yup
    .string()
    .matches(/^\d{10}$/, "Phone must be a valid 10-digit number")
    .required("Phone number is required"),
});

export const package_schema = yup.object().shape({
  category_id: yup
    .string()
    .length(24, "Category ID must be a 24-character string")
    .required("Category ID is required"),

  departure_place: yup
    .string()
    .min(3, "Departure place must be at least 3 characters long")
    .required("Departure place is required"),

  description: yup
    .string()
    .min(10, "Description must be at least 10 characters long")
    .required("Description is required"),

  destinations: yup
    .array()
    .of(yup.string().required("Each destination must be a string"))
    .min(1, "At least one destination is required")
    .required("Destinations are required"),

  excludedItems: yup
    .array()
    .of(yup.string().required("Each excluded item must be a string"))
    .min(1, "At least one excluded item is required")
    .required("Excluded items are required"),

  images: yup
    .array()
    .of(
      yup
        .string()
        .url("Each image must be a valid URL")
        .required("Image URL is required")
    )
    .min(1, "At least one image is required")
    .required("Images are required"),

  includedItems: yup
    .array()
    .of(yup.string().required("Each included item must be a string"))
    .min(1, "At least one included item is required")
    .required("Included items are required"),

  itineraries: yup
    .array()
    .of(
      yup.object().shape({
        day: yup
          .number()
          .integer("Day must be an integer")
          .positive("Day must be a positive number")
          .required("Day is required"),
        activities: yup
          .array()
          .of(
            yup.object().shape({
              time: yup
                .string()
                .matches(
                  /^([01]\d|2[0-3]):([0-5]\d)$/,
                  "Time must be in HH:mm format"
                )
                .required("Time is required"),
              activity: yup
                .string()
                .min(3, "Activity must be at least 3 characters long")
                .required("Activity description is required"),
            })
          )
          .min(1, "At least one activity is required")
          .required("Activities are required"),
      })
    )
    .min(1, "At least one itinerary is required")
    .required("Itineraries are required"),

  max_person: yup
    .number()
    .integer("Max person must be an integer")
    .positive("Max person must be a positive number")
    .required("Max person is required"),

  no_of_days: yup
    .number()
    .integer("Number of days must be an integer")
    .positive("Number of days must be a positive number")
    .required("Number of days is required"),

  no_of_nights: yup
    .number()
    .integer("Number of nights must be an integer")
    .positive("Number of nights must be a positive number")
    .required("Number of nights is required"),

  original_price: yup
    .number()
    .positive("Original price must be a positive number")
    .required("Original price is required"),

  package_name: yup
    .string()
    .min(3, "Package name must be at least 3 characters long")
    .required("Package name is required"),
});

export const offer_schema = yup.object().shape({
  agent_id: yup
    .string()
    .length(24, "Agent ID must be a 24-character string")
    .required("Agent ID is required"),

  description: yup
    .string()
    .min(10, "Description must be at least 10 characters long")
    .required("Description is required"),

  is_active: yup.boolean().required("Is Active status is required"),

  max_offer: yup
    .number()
    .positive("Max Offer must be a positive number")
    .required("Max Offer is required"),

  offer_name: yup
    .string()
    .min(3, "Offer Name must be at least 3 characters long")
    .required("Offer Name is required"),

  package_id: yup
    .array()
    .of(
      yup
        .string()
        .length(24, "Each Package ID must be a 24-character string")
        .required("Package ID is required")
    )
    .min(1, "At least one Package ID is required")
    .required("Package IDs are required"),

  percentage: yup
    .number()
    .positive("Percentage must be a positive number")
    .max(100, "Percentage cannot be greater than 100")
    .required("Percentage is required"),

  valid_from: yup.date().required("Valid From date is required"),

  valid_upto: yup
    .date()
    .min(
      yup.ref("valid_from"),
      "Valid Upto date must be later than Valid From date"
    )
    .required("Valid Upto date is required"),
});

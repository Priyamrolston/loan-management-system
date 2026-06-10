import { z } from "zod";

// ─── Personal Info Schema ────────────────────────────────────────────
export const personalSchema = z.object({
  fullName: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Enter a valid email address"),
  mobile: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  // preprocess trims + uppercases so that lowercase input like 'abcde1234f' still validates
  pan: z.preprocess(
    (val) => (typeof val === "string" ? val.trim().toUpperCase() : val),
    z
      .string()
      .min(1, "PAN number is required")
      .length(10, "PAN must be exactly 10 characters")
      .regex(
        /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
        "Invalid PAN format — must be like ABCDE1234F (5 letters, 4 digits, 1 letter)"
      )
  ),
  aadhaar: z.preprocess(
    (val) => (typeof val === "string" ? val.trim().replace(/\s/g, "") : val),
    z
      .string()
      .min(1, "Aadhaar number is required")
      .length(12, "Aadhaar must be exactly 12 digits")
      .regex(/^\d{12}$/, "Aadhaar must contain only digits")
  ),
});

// ─── Address Schema ───────────────────────────────────────────────────
export const addressSchema = z.object({
  address: z.string().min(5, "Address must be at least 5 characters"),
  pincode: z.string().regex(/^\d{6}$/, "Pincode must be 6 digits"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
});

// ─── Loan Details Schema ──────────────────────────────────────────────
export const loanDetailsSchema = z
  .object({
    loanType: z.enum(["personal", "home", "business"], {
      errorMap: () => ({ message: "Please select a loan type" }),
    }),
    loanAmount: z.coerce
      .number({ invalid_type_error: "Enter a valid amount" })
      .min(10000, "Minimum loan amount is ₹10,000"),
    salary: z.coerce.number().optional().nullable(),
    propertyValue: z.coerce.number().optional().nullable(),
    gstNumber: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.loanType === "personal") {
      if (!data.salary || data.salary < 10000) {
        ctx.addIssue({
          path: ["salary"],
          code: z.ZodIssueCode.custom,
          message: "Minimum salary of ₹10,000 required for personal loan",
        });
      }
    }
    if (data.loanType === "home") {
      if (!data.propertyValue || data.propertyValue <= 0) {
        ctx.addIssue({
          path: ["propertyValue"],
          code: z.ZodIssueCode.custom,
          message: "Property value is required for home loan",
        });
      }
    }
    if (data.loanType === "business") {
      if (!data.gstNumber || data.gstNumber.trim().length !== 15) {
        ctx.addIssue({
          path: ["gstNumber"],
          code: z.ZodIssueCode.custom,
          message: "A valid 15-character GST number is required",
        });
      }
    }
  });

// ─── Employment Schema ────────────────────────────────────────────────
export const employmentSchema = z.object({
  occupation: z.string().min(2, "Occupation is required"),
  companyName: z.string().min(2, "Company / business name is required"),
  yearsOfExperience: z.coerce.number().min(0).max(60).optional().nullable(),
});
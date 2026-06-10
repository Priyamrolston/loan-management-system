import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { loanDetailsSchema } from "../../validation/schemas";
import { useLoanStore } from "../../store/loanStore";

const LOAN_TYPES = [
  { value: "personal", label: "Personal Loan", icon: "👤", desc: "For personal needs" },
  { value: "home", label: "Home Loan", icon: "🏠", desc: "Buy or construct home" },
  { value: "business", label: "Business Loan", icon: "💼", desc: "Grow your business" },
];

export default function LoanDetails() {
  const { formData, updateForm, currentStep, setStep } = useLoanStore();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(loanDetailsSchema),
    defaultValues: {
      loanType: formData.loanType || "",
      loanAmount: formData.loanAmount || "",
      salary: formData.salary || "",
      propertyValue: formData.propertyValue || "",
      gstNumber: formData.gstNumber || "",
    },
    mode: "onChange",
  });

  const loanType = watch("loanType");

  // Bug fix: Clear ONLY the conditional field for the NEW type, not all of them.
  // Also re-trigger validation after type change so form validity updates immediately.
  useEffect(() => {
    if (!loanType) return;
    // Clear fields that belong to OTHER loan types
    if (loanType !== "personal") setValue("salary", "", { shouldValidate: false });
    if (loanType !== "home") setValue("propertyValue", "", { shouldValidate: false });
    if (loanType !== "business") setValue("gstNumber", "", { shouldValidate: false });
    // Re-run full form validation so Continue button state updates
    trigger();
  }, [loanType, setValue, trigger]);

  const onSubmit = (data) => {
    updateForm(data);
    setStep(currentStep + 1);
  };

  // Bug fix: uppercase GST at JS level (same issue as PAN)
  const handleGstChange = (e) => {
    setValue("gstNumber", e.target.value.toUpperCase(), { shouldValidate: true });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Loan Type Cards */}
      <p className="section-title">
        Select Loan Type <span style={{ color: "#dc2626" }}>*</span>
      </p>
      <div className="loan-type-cards">
        {LOAN_TYPES.map((lt) => (
          <label
            key={lt.value}
            className={`loan-type-card${loanType === lt.value ? " selected" : ""}`}
            style={{ cursor: "pointer" }}
          >
            <input
              type="radio"
              value={lt.value}
              style={{ display: "none" }}
              {...register("loanType")}
            />
            <div className="loan-type-card-icon">{lt.icon}</div>
            <div className="loan-type-card-label">{lt.label}</div>
            <div style={{ fontSize: "0.72rem", color: "#9ca3af", marginTop: "0.25rem" }}>
              {lt.desc}
            </div>
          </label>
        ))}
      </div>
      {errors.loanType && (
        <span
          className="error-msg"
          style={{ marginBottom: "1rem", display: "block" }}
        >
          ⚠ {errors.loanType.message}
        </span>
      )}

      <div className="form-group" style={{ marginTop: "0.5rem" }}>
        <label>
          Loan Amount (₹) <span className="required">*</span>
        </label>
        <input
          type="number"
          placeholder="Minimum ₹10,000"
          min={10000}
          step={1000}
          {...register("loanAmount")}
        />
        {errors.loanAmount && (
          <span className="error-msg">⚠ {errors.loanAmount.message}</span>
        )}
      </div>

      {/* Conditional Fields */}
      {loanType === "personal" && (
        <div className="form-group" style={{ animation: "fadeSlideIn 0.2s ease" }}>
          <label>
            Monthly Net Salary (₹) <span className="required">*</span>
          </label>
          <input
            type="number"
            placeholder="Your take-home monthly salary (min ₹10,000)"
            min={10000}
            step={1000}
            {...register("salary")}
          />
          {errors.salary && (
            <span className="error-msg">⚠ {errors.salary.message}</span>
          )}
        </div>
      )}

      {loanType === "home" && (
        <div className="form-group" style={{ animation: "fadeSlideIn 0.2s ease" }}>
          <label>
            Property Value (₹) <span className="required">*</span>
          </label>
          <input
            type="number"
            placeholder="Current market value of the property"
            min={100000}
            step={10000}
            {...register("propertyValue")}
          />
          {errors.propertyValue && (
            <span className="error-msg">⚠ {errors.propertyValue.message}</span>
          )}
        </div>
      )}

      {loanType === "business" && (
        <div className="form-group" style={{ animation: "fadeSlideIn 0.2s ease" }}>
          <label>
            GST Registration Number <span className="required">*</span>
          </label>
          <input
            type="text"
            placeholder="15-character GST number (e.g. 29ABCDE1234F1Z5)"
            maxLength={15}
            style={{ textTransform: "uppercase", letterSpacing: "0.04em" }}
            {...register("gstNumber")}
            onChange={handleGstChange}
          />
          {errors.gstNumber && (
            <span className="error-msg">⚠ {errors.gstNumber.message}</span>
          )}
          <span style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "0.25rem", display: "block" }}>
            Format: 2 digits + 10 PAN chars + 1 digit + 1 letter + 1 digit (e.g. 29ABCDE1234F1Z5)
          </span>
        </div>
      )}

      {loanType && (
        <div className="info-box info">
          <span className="info-box-icon">ℹ️</span>
          <span>
            {loanType === "personal" &&
              "Personal loan eligibility = 60× your monthly salary. E.g. ₹50,000 salary → ₹30,00,000 eligible."}
            {loanType === "home" &&
              "Home loan eligibility = up to 80% of property value (LTV ratio). E.g. ₹50L property → ₹40L eligible."}
            {loanType === "business" &&
              "Business loan eligibility is based on business vintage (years of experience × ₹5,00,000)."}
          </span>
        </div>
      )}

      <div
        className="form-footer"
        style={{ margin: "0 -2.5rem -2rem", marginTop: "2rem" }}
      >
        <span className="form-footer-info">Auto-saved locally</span>
        <div className="form-footer-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setStep(currentStep - 1)}
          >
            ← Back
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!isValid}
          >
            Continue →
          </button>
        </div>
      </div>
    </form>
  );
}
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { employmentSchema } from "../../validation/schemas";
import { useLoanStore } from "../../store/loanStore";

export default function EmploymentInfo() {
  const { formData, updateForm, currentStep, setStep } = useLoanStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(employmentSchema),
    defaultValues: {
      occupation: formData.occupation || "",
      companyName: formData.companyName || "",
      // Bug fix: store returns "" for yearsOfExperience — coerce to number was
      // converting "" to 0 which is valid, so the field showed 0 on revisit.
      // Keep blank as blank in the defaultValues.
      yearsOfExperience: formData.yearsOfExperience !== "" ? formData.yearsOfExperience : "",
    },
    // Bug fix: use "onChange" mode so isValid tracks correctly
    mode: "onChange",
  });

  const onSubmit = (data) => {
    // Bug fix: if yearsOfExperience is empty string after coerce it becomes NaN.
    // Normalise it to null so the store doesn't save "NaN".
    const clean = {
      ...data,
      yearsOfExperience:
        data.yearsOfExperience === "" || isNaN(data.yearsOfExperience)
          ? ""
          : data.yearsOfExperience,
    };
    updateForm(clean);
    setStep(currentStep + 1);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="form-group">
        <label>
          Occupation / Job Title <span className="required">*</span>
        </label>
        <input
          type="text"
          placeholder="e.g. Software Engineer, Business Owner, Doctor"
          {...register("occupation")}
        />
        {errors.occupation && (
          <span className="error-msg">⚠ {errors.occupation.message}</span>
        )}
      </div>

      <div className="form-group">
        <label>
          Employer / Company Name <span className="required">*</span>
        </label>
        <input
          type="text"
          placeholder="Name of your current employer or business"
          {...register("companyName")}
        />
        {errors.companyName && (
          <span className="error-msg">⚠ {errors.companyName.message}</span>
        )}
      </div>

      <div className="form-group">
        <label>
          Years of Work Experience{" "}
          <span className="optional">(optional — used for business loan eligibility)</span>
        </label>
        <input
          type="number"
          placeholder="Total years in current role / business vintage"
          min={0}
          max={60}
          step={1}
          {...register("yearsOfExperience")}
        />
        {errors.yearsOfExperience && (
          <span className="error-msg">⚠ {errors.yearsOfExperience.message}</span>
        )}
      </div>

      <div className="info-box info">
        <span className="info-box-icon">ℹ️</span>
        <span>
          Employment details help determine your loan eligibility and repayment
          capacity. For business loans, years of experience directly affects the
          maximum eligible amount.
        </span>
      </div>

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
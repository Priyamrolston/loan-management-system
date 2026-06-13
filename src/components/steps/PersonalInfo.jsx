import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { personalSchema } from "../../validation/schemas";
import { useLoanStore } from "../../store/loanStore";
import { verifyPAN, verifyAadhaar } from "../../services/verification";

export default function PersonalInfo() {
  const {
    formData,
    updateForm,
    verificationStatus,
    setVerificationStatus,
    currentStep,
    setStep,
  } = useLoanStore();

  const [verifying, setVerifying] = useState({ pan: false, aadhaar: false });
  const [verifyError, setVerifyError] = useState({ pan: "", aadhaar: "" });

  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    setValue,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(personalSchema),
    defaultValues: {
      fullName: formData.fullName || "",
      email: formData.email || "",
      mobile: formData.mobile || "",
      pan: formData.pan || "",
      aadhaar: formData.aadhaar || "",
    },
    mode: "onChange",
  });

  const onSubmit = (data) => {
    updateForm(data);
    setStep(currentStep + 1);
  };

  const verifyDoc = async (type) => {
    const val = getValues(type);
    const isDocValid = await trigger(type);
    if (!isDocValid) return;

    setVerifying((prev) => ({ ...prev, [type]: true }));
    setVerifyError((prev) => ({ ...prev, [type]: "" }));

    try {
      const isValid = type === "pan" ? await verifyPAN(val) : await verifyAadhaar(val);
      if (isValid) {
        setVerificationStatus(type, true);
        updateForm({ [type]: val });
      } else {
        setVerificationStatus(type, false);
        setVerifyError((prev) => ({
          ...prev,
          [type]: type === "pan"
            ? "PAN verification failed. Invalid format or number."
            : "Aadhaar verification failed. Must be a valid 12-digit number.",
        }));
      }
    } catch (e) {
      setVerifyError((prev) => ({ ...prev, [type]: "Verification service unavailable. Try again." }));
    } finally {
      setVerifying((prev) => ({ ...prev, [type]: false }));
    }
  };

  // When user edits PAN after it was verified, reset verification status
  const handlePanChange = (e) => {
    const upper = e.target.value.toUpperCase();
    setValue("pan", upper, { shouldValidate: true });
    setVerifyError((prev) => ({ ...prev, pan: "" }));
    if (verificationStatus.pan) {
      setVerificationStatus("pan", false);
    }
  };

  const handleAadhaarChange = (e) => {
    const digits = e.target.value.replace(/\D/g, ""); // strip non-digits
    setValue("aadhaar", digits, { shouldValidate: true });
    setVerifyError((prev) => ({ ...prev, aadhaar: "" }));
    if (verificationStatus.aadhaar) {
      setVerificationStatus("aadhaar", false);
    }
  };

  const canProceed =
    isValid && verificationStatus.pan && verificationStatus.aadhaar;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="info-box info">
        <span className="info-box-icon">ℹ️</span>
        <span>
          All fields are required. Your PAN and Aadhaar must be verified before
          you can proceed.
        </span>
      </div>

      <div className="form-grid-2">
        <div className="form-group">
          <label>
            Full Name <span className="required">*</span>
          </label>
          <input
            type="text"
            placeholder="As per Aadhaar / PAN"
            {...register("fullName")}
          />
          {errors.fullName && (
            <span className="error-msg">⚠ {errors.fullName.message}</span>
          )}
        </div>

        <div className="form-group">
          <label>
            Mobile Number <span className="required">*</span>
          </label>
          <input
            type="tel"
            placeholder="10-digit mobile number"
            maxLength={10}
            {...register("mobile")}
          />
          {errors.mobile && (
            <span className="error-msg">⚠ {errors.mobile.message}</span>
          )}
        </div>
      </div>

      <div className="form-group">
        <label>
          Email Address <span className="required">*</span>
        </label>
        <input
          type="email"
          placeholder="you@example.com"
          {...register("email")}
        />
        {errors.email && (
          <span className="error-msg">⚠ {errors.email.message}</span>
        )}
      </div>

      <hr className="section-divider" />
      <p className="section-title">Identity Verification</p>

      {/* PAN */}
      <div className="form-group">
        <label>
          PAN Number <span className="required">*</span>
        </label>
        <div className="input-action-row">
          <input
            type="text"
            placeholder="e.g. ABCDE1234F"
            maxLength={10}
            disabled={verificationStatus.pan}
            // Use controlled onChange to uppercase at JS level (not just CSS)
            {...register("pan")}
            onChange={handlePanChange}
            style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}
          />
          {!verificationStatus.pan ? (
            <button
              type="button"
              className={`btn btn-secondary btn-sm${
                verifying.pan ? " btn-loading" : ""
              }`}
              onClick={() => verifyDoc("pan")}
              style={{ whiteSpace: "nowrap" }}
            >
              {verifying.pan ? (
                <>
                  <span className="loading-spinner dark" />
                  Verifying…
                </>
              ) : (
                "Verify PAN"
              )}
            </button>
          ) : (
            <span className="badge badge-success">✓ Verified</span>
          )}
        </div>
        {errors.pan && (
          <span className="error-msg">⚠ {errors.pan.message}</span>
        )}
        {verifyError.pan && (
          <span className="error-msg" style={{ display: "block" }}>⚠ {verifyError.pan}</span>
        )}
        {!errors.pan && !verifyError.pan && !verificationStatus.pan && (
          <span style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "0.25rem", display: "block" }}>
            Format: 5 letters + 4 digits + 1 letter (e.g. ABCDE1234F)
          </span>
        )}
      </div>

      {/* Aadhaar */}
      <div className="form-group">
        <label>
          Aadhaar Number <span className="required">*</span>
        </label>
        <div className="input-action-row">
          <input
            type="tel"
            placeholder="12-digit Aadhaar number"
            maxLength={12}
            disabled={verificationStatus.aadhaar}
            {...register("aadhaar")}
            onChange={handleAadhaarChange}
          />
          {!verificationStatus.aadhaar ? (
            <button
              type="button"
              className={`btn btn-secondary btn-sm${
                verifying.aadhaar ? " btn-loading" : ""
              }`}
              onClick={() => verifyDoc("aadhaar")}
              style={{ whiteSpace: "nowrap" }}
            >
              {verifying.aadhaar ? (
                <>
                  <span className="loading-spinner dark" />
                  Verifying…
                </>
              ) : (
                "Verify Aadhaar"
              )}
            </button>
          ) : (
            <span className="badge badge-success">✓ Verified</span>
          )}
        </div>
        {errors.aadhaar && (
          <span className="error-msg">⚠ {errors.aadhaar.message}</span>
        )}
        {verifyError.aadhaar && (
          <span className="error-msg" style={{ display: "block" }}>⚠ {verifyError.aadhaar}</span>
        )}
        {!errors.aadhaar && !verifyError.aadhaar && !verificationStatus.aadhaar && (
          <span style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "0.25rem", display: "block" }}>
            Must be exactly 12 digits (no spaces)
          </span>
        )}
      </div>

      {(!verificationStatus.pan || !verificationStatus.aadhaar) && (
        <div className="info-box warning">
          <span className="info-box-icon">⚠️</span>
          <span>
            {!verificationStatus.pan && !verificationStatus.aadhaar
              ? "Please verify both PAN and Aadhaar to proceed."
              : !verificationStatus.pan
              ? "Please verify your PAN number to proceed."
              : "Please verify your Aadhaar number to proceed."}
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
            type="submit"
            className="btn btn-primary"
            disabled={!canProceed}
          >
            Continue →
          </button>
        </div>
      </div>
    </form>
  );
}
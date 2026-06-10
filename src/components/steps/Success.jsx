import { useMemo } from "react";
import { useLoanStore } from "../../store/loanStore";

export default function Success() {
  const { formData, resetAll } = useLoanStore();

  // Generate a stable ref number for the session (useMemo so it doesn't change on re-render)
  const refNumber = useMemo(
    () => "ZTH" + Date.now().toString().slice(-7),
    []
  );

  const loanTypeLabel = formData.loanType
    ? formData.loanType.charAt(0).toUpperCase() + formData.loanType.slice(1)
    : "";

  const handleStartNew = () => {
    // Bug fix: use the store's resetAll action rather than directly removing
    // localStorage, so Zustand's persist middleware resets cleanly.
    resetAll();
    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="success-wrap" style={{ padding: "3rem 2.5rem" }}>
      <div className="success-icon-circle">✅</div>

      <div className="success-title">Application Submitted!</div>

      <p className="success-sub">
        Thank you, <strong>{formData.fullName || "Applicant"}</strong>. Your{" "}
        {loanTypeLabel} Loan application has been successfully received and is
        under processing.
      </p>

      <div className="success-ref-card">
        <div className="success-ref-label">Application Reference Number</div>
        <div className="success-ref-num">{refNumber}</div>
      </div>

      <ul className="success-steps-list">
        <li>
          <div className="success-step-icon">1</div>
          <span>
            Our team will verify your documents within{" "}
            <strong>24–48 hours</strong>.
          </span>
        </li>
        <li>
          <div className="success-step-icon">2</div>
          <span>
            A credit officer will contact you at{" "}
            <strong>{formData.email || "your registered email"}</strong> or{" "}
            <strong>{formData.mobile || "your registered mobile"}</strong>.
          </span>
        </li>
        <li>
          <div className="success-step-icon">3</div>
          <span>
            Upon approval, funds will be disbursed to your registered bank
            account within <strong>3–5 business days</strong>.
          </span>
        </li>
      </ul>

      <div
        className="info-box info"
        style={{ maxWidth: "420px", marginTop: "2rem", textAlign: "left" }}
      >
        <span className="info-box-icon">ℹ️</span>
        <span>
          Keep your reference number <strong>{refNumber}</strong> handy for any
          follow-up queries.
        </span>
      </div>

      <button
        className="btn btn-secondary"
        style={{ marginTop: "2rem" }}
        onClick={handleStartNew}
      >
        Start a New Application
      </button>
    </div>
  );
}
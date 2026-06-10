import { useEffect, useState } from "react";
import { useLoanStore } from "../../store/loanStore";

function fmtCurrency(n) {
  const num = Number(n);
  if (!num || isNaN(num)) return "₹0";
  return "₹" + num.toLocaleString("en-IN");
}

function calcEligibility(formData) {
  const requested = Number(formData.loanAmount) || 0;
  let eligible = 0;
  let method = "";

  if (formData.loanType === "personal") {
    const salary = Number(formData.salary) || 0;
    eligible = salary * 60;
    method = `60 × monthly salary (₹${salary.toLocaleString("en-IN")})`;
  } else if (formData.loanType === "home") {
    const propVal = Number(formData.propertyValue) || 0;
    eligible = propVal * 0.8;
    method = `80% of property value (₹${propVal.toLocaleString("en-IN")})`;
  } else if (formData.loanType === "business") {
    // Bug fix: use a meaningful base — 5L per year of experience, minimum 2 years assumed
    const years = Math.max(Number(formData.yearsOfExperience) || 2, 1);
    eligible = years * 500000;
    method = `${years} years × ₹5,00,000 per year`;
  }

  const approved = eligible > 0 && eligible >= requested;
  return { eligible, requested, approved, method };
}

export default function Eligibility() {
  const { formData, currentStep, setStep } = useLoanStore();
  const [calculating, setCalculating] = useState(true);

  // Bug fix: reset calculating state each time step is mounted
  // (if user goes back and comes forward again, spinner should show again)
  useEffect(() => {
    setCalculating(true);
    const t = setTimeout(() => setCalculating(false), 1800);
    return () => clearTimeout(t);
  }, []);

  const { eligible, requested, approved, method } = calcEligibility(formData);

  // Bug fix: if data is missing (e.g. went straight to this step), show warning
  const hasRequiredData =
    formData.loanType &&
    formData.loanAmount &&
    (formData.loanType !== "personal" || formData.salary) &&
    (formData.loanType !== "home" || formData.propertyValue);

  if (calculating) {
    return (
      <div className="eligibility-loading">
        <div className="eligibility-loading-spinner" />
        <p style={{ fontWeight: 600, color: "#374151" }}>Running eligibility check…</p>
        <p style={{ fontSize: "0.8rem", color: "#9ca3af" }}>
          Analysing your profile and loan parameters
        </p>
      </div>
    );
  }

  if (!hasRequiredData) {
    return (
      <div>
        <div className="info-box warning">
          <span className="info-box-icon">⚠️</span>
          <span>
            Missing required loan information. Please go back and complete the Loan
            Details and Employment steps.
          </span>
        </div>
        <div className="form-footer" style={{ margin: "0 -2.5rem -2rem", marginTop: "2rem" }}>
          <span />
          <div className="form-footer-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setStep(currentStep - 1)}
            >
              ← Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Result banner */}
      <div
        className="eligibility-result"
        style={{ animation: "fadeSlideIn 0.4s ease" }}
      >
        <div
          className={`eligibility-result-header ${approved ? "approved" : "review"}`}
        >
          <div className="eligibility-result-icon">{approved ? "✅" : "⚠️"}</div>
          <div>
            <div className="eligibility-result-title">
              {approved ? "Congratulations — Pre-Approved!" : "Manual Review Required"}
            </div>
            <div className="eligibility-result-sub">
              {approved
                ? "Your profile meets our eligibility criteria for the requested amount."
                : "Requested amount exceeds your eligible limit. A credit officer will review."}
            </div>
          </div>
        </div>
        <div className="eligibility-result-body">
          <div className="eligibility-amount-label">Maximum Eligible Amount</div>
          <div className="eligibility-amount">{fmtCurrency(eligible)}</div>
        </div>
      </div>

      {/* Detail breakdown */}
      <div className="review-section">
        <div className="review-section-header">
          <span className="review-section-title">Eligibility Breakdown</span>
        </div>
        <table className="review-table">
          <tbody>
            <tr>
              <td>Loan Type</td>
              <td style={{ textTransform: "capitalize" }}>{formData.loanType} Loan</td>
            </tr>
            <tr>
              <td>Requested Amount</td>
              <td>{fmtCurrency(requested)}</td>
            </tr>
            <tr>
              <td>Calculation Method</td>
              <td>{method}</td>
            </tr>
            <tr>
              <td>Maximum Eligible</td>
              <td
                style={{
                  color: approved ? "#16a34a" : "#dc2626",
                  fontWeight: 700,
                }}
              >
                {fmtCurrency(eligible)}
              </td>
            </tr>
            <tr>
              <td>Status</td>
              <td>
                {approved ? (
                  <span className="badge badge-success">Pre-Approved</span>
                ) : (
                  <span className="badge badge-pending">Under Review</span>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {!approved && (
        <div className="info-box warning">
          <span className="info-box-icon">⚠️</span>
          <span>
            You may still proceed with your application. A credit officer will
            review your case and may offer a partial approval.
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
            type="button"
            className="btn btn-primary"
            onClick={() => setStep(currentStep + 1)}
          >
            {approved ? "Continue to Review →" : "Proceed Anyway →"}
          </button>
        </div>
      </div>
    </div>
  );
}
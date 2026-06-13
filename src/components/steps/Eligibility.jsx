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
    const years = Math.max(Number(formData.yearsOfExperience) || 2, 1);
    eligible = years * 500000;
    method = `${years} years × ₹5,00,000 per year`;
  }

  const approved = eligible > 0 && eligible >= requested;
  return { eligible, requested, approved, method };
}

export default function Eligibility() {
  const { formData, currentStep, setStep, isEligibilityCalculated, setEligibilityCalculated } = useLoanStore();
  const [calculating, setCalculating] = useState(!isEligibilityCalculated);
  const [tenureMonths, setTenureMonths] = useState(36);

  useEffect(() => {
    if (!isEligibilityCalculated) {
      setCalculating(true);
      const t = setTimeout(() => {
        setCalculating(false);
        setEligibilityCalculated(true);
      }, 1800);
      return () => clearTimeout(t);
    }
  }, [isEligibilityCalculated, setEligibilityCalculated]);

  const { eligible, requested, approved, method } = calcEligibility(formData);

  const hasRequiredData =
    formData.loanType &&
    formData.loanAmount &&
    (formData.loanType !== "personal" || formData.salary) &&
    (formData.loanType !== "home" || formData.propertyValue);

  // EMI parameters
  const annualRate = formData.loanType === "home" ? 8.5 : formData.loanType === "personal" ? 10.75 : 12.5;
  const r = annualRate / 12 / 100;
  const n = tenureMonths;
  const emi = requested * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
  const totalRepayment = emi * tenureMonths;
  const totalInterest = totalRepayment - requested;

  const handleDownloadLetter = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const dateStr = new Date().toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });

    const letterHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Pre-Approval Letter - Zetheta</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: #1a1a2e;
            line-height: 1.6;
            margin: 0;
            padding: 40px;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #2563eb;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .logo {
            font-size: 28px;
            font-weight: bold;
            color: #0a2647;
          }
          .logo span {
            color: #2563eb;
          }
          .title {
            text-align: center;
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 30px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #0a2647;
          }
          .date {
            text-align: right;
            margin-bottom: 20px;
            font-weight: 500;
          }
          .details-table {
            width: 100%;
            border-collapse: collapse;
            margin: 25px 0;
          }
          .details-table th, .details-table td {
            border: 1px solid #e5e7eb;
            padding: 12px 15px;
            text-align: left;
          }
          .details-table th {
            background-color: #f3f4f6;
            color: #374151;
          }
          .highlight {
            font-size: 18px;
            font-weight: bold;
            color: #16a34a;
          }
          .footer {
            margin-top: 50px;
            border-top: 1px solid #e5e7eb;
            padding-top: 20px;
            font-size: 12px;
            color: #6b7280;
            text-align: center;
          }
          .signatures {
            display: flex;
            justify-content: space-between;
            margin-top: 60px;
          }
          .sig-box {
            text-align: center;
            width: 200px;
          }
          .sig-line {
            border-top: 1px solid #1a1a2e;
            margin-top: 40px;
            padding-top: 5px;
            font-size: 14px;
            font-weight: 500;
          }
          @media print {
            body { padding: 20px; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">Zetheta<span>.</span></div>
          <div>Ref: ZTH-PA-${Date.now().toString().slice(-6)}</div>
        </div>
        <div class="title">Letter of Loan Pre-Approval</div>
        <div class="date">Date: ${dateStr}</div>
        <p>Dear <strong>${formData.fullName || "Applicant"}</strong>,</p>
        <p>We are pleased to inform you that based on the financial assessment submitted in your application, Zetheta has pre-approved your request for a <strong>${formData.loanType.charAt(0).toUpperCase() + formData.loanType.slice(1)} Loan</strong> under the following terms and conditions:</p>
        
        <table class="details-table">
          <tr>
            <th>Parameter</th>
            <th>Approved Value</th>
          </tr>
          <tr>
            <td>Applicant Name</td>
            <td>${formData.fullName}</td>
          </tr>
          <tr>
            <td>Loan Type</td>
            <td>${formData.loanType.charAt(0).toUpperCase() + formData.loanType.slice(1)} Loan</td>
          </tr>
          <tr>
            <td>Pre-Approved Loan Amount</td>
            <td class="highlight">₹${Number(formData.loanAmount).toLocaleString("en-IN")}</td>
          </tr>
          <tr>
            <td>Annual Interest Rate (Fixed)</td>
            <td>${annualRate}% p.a.</td>
          </tr>
          <tr>
            <td>Loan Tenure</td>
            <td>${tenureMonths} Months</td>
          </tr>
          <tr>
            <td>Estimated Monthly Installment (EMI)</td>
            <td>₹${Math.round(emi).toLocaleString("en-IN")}</td>
          </tr>
          <tr>
            <td>One-time Processing Fee (1.5% + 18% GST)</td>
            <td>₹${Math.round(requested * 0.015 * 1.18).toLocaleString("en-IN")}</td>
          </tr>
        </table>

        <p><strong>Please note:</strong> This pre-approval is a simulated credit assessment based on the documents uploaded. Final disbursement is subject to successful verification of original physical documents and validation of employment criteria by our credit risk department.</p>

        <div class="signatures">
          <div class="sig-box">
            <div class="sig-line">Credit Officer</div>
            <div style="font-size: 12px; color: #6b7280;">Zetheta Risk Division</div>
          </div>
          <div class="sig-box">
            <div class="sig-line">Authorized Signatory</div>
            <div style="font-size: 12px; color: #6b7280;">Zetheta Financial Services Ltd.</div>
          </div>
        </div>

        <div class="footer">
          Zetheta Financial Services Private Limited &copy; ${new Date().getFullYear()}. All Rights Reserved.
        </div>
        
        <script>
          window.onload = function() {
            window.print();
          }
        </script>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(letterHtml);
    printWindow.document.close();
  };

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

      {approved && (
        <div className="emi-calculator-card" style={{ marginTop: "1.5rem", animation: "fadeSlideIn 0.4s ease" }}>
          <div className="emi-calculator-header">
            <h3>Repayment Estimator & EMI Calculator</h3>
            <p>Adjust the tenure options to see estimated monthly EMI payouts.</p>
          </div>
          <div className="emi-calculator-body">
            <div className="tenure-selection-row">
              <label>Select Loan Tenure (Months):</label>
              <div className="tenure-options">
                {[12, 24, 36, 48, 60].map((t) => (
                  <button
                    key={t}
                    type="button"
                    className={`btn-tenure${tenureMonths === t ? " active" : ""}`}
                    onClick={() => setTenureMonths(t)}
                  >
                    {t} Mo
                  </button>
                ))}
              </div>
            </div>
            <div className="emi-results-grid">
              <div className="emi-result-stat">
                <span className="emi-result-label">Monthly EMI</span>
                <span className="emi-result-val" style={{ color: "#2563eb" }}>
                  {fmtCurrency(emi)}
                </span>
              </div>
              <div className="emi-result-stat">
                <span className="emi-result-label">Interest Rate</span>
                <span className="emi-result-val" style={{ color: "#16a34a" }}>
                  {annualRate}% p.a.
                </span>
              </div>
              <div className="emi-result-stat">
                <span className="emi-result-label">Total Interest</span>
                <span className="emi-result-val">{fmtCurrency(totalInterest)}</span>
              </div>
              <div className="emi-result-stat">
                <span className="emi-result-label">Total Repayment</span>
                <span className="emi-result-val">{fmtCurrency(totalRepayment)}</span>
              </div>
            </div>
            <div style={{ marginTop: "1.5rem", display: "flex", justifyContent: "center" }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleDownloadLetter}
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                🖨️ Download Pre-Approval Letter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail breakdown */}
      <div className="review-section" style={{ marginTop: "1.5rem" }}>
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
              <td>One-time Processing Fee (1.5% + 18% GST)</td>
              <td>{fmtCurrency(requested * 0.015 * 1.18)}</td>
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
        <div className="info-box warning" style={{ marginTop: "1.5rem" }}>
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
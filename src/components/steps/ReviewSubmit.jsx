import { useLoanStore } from "../../store/loanStore";

function fmtCurrency(n) {
  const num = Number(n);
  if (!num || isNaN(num)) return "—";
  return "₹" + num.toLocaleString("en-IN");
}

function maskAadhaar(aadhaar) {
  if (!aadhaar || aadhaar.length < 4) return "—";
  return "XXXX XXXX " + aadhaar.slice(-4);
}

function capitalise(str) {
  if (!str) return "—";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function Section({ title, children }) {
  return (
    <div className="review-section">
      <div className="review-section-header">
        <span className="review-section-title">{title}</span>
      </div>
      <table className="review-table">
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <tr>
      <td>{label}</td>
      {/* Bug fix: render value as JSX or string; avoid "value || —" swallowing 0 */}
      <td>{value === 0 ? "0" : value || "—"}</td>
    </tr>
  );
}

export default function ReviewSubmit() {
  const { formData, currentStep, setStep } = useLoanStore();

  return (
    <div>
      <div className="info-box info">
        <span className="info-box-icon">ℹ️</span>
        <span>
          Review all your details carefully. Use the Back button to correct
          anything before signing.
        </span>
      </div>

      <Section title="Personal Details">
        <Row label="Full Name" value={formData.fullName} />
        <Row label="Email Address" value={formData.email} />
        <Row label="Mobile Number" value={formData.mobile} />
        <Row label="PAN Number" value={formData.pan} />
        {/* Bug fix: mask Aadhaar properly */}
        <Row label="Aadhaar Number" value={maskAadhaar(formData.aadhaar)} />
      </Section>

      <Section title="Address">
        <Row label="Residential Address" value={formData.address} />
        <Row label="PIN Code" value={formData.pincode} />
        <Row label="City" value={formData.city} />
        <Row label="State" value={formData.state} />
      </Section>

      <Section title="Loan Details">
        <Row
          label="Loan Type"
          value={
            formData.loanType ? capitalise(formData.loanType) + " Loan" : "—"
          }
        />
        <Row label="Requested Amount" value={fmtCurrency(formData.loanAmount)} />
        {formData.loanType === "personal" && (
          <Row label="Monthly Salary" value={fmtCurrency(formData.salary)} />
        )}
        {formData.loanType === "home" && (
          <Row label="Property Value" value={fmtCurrency(formData.propertyValue)} />
        )}
        {formData.loanType === "business" && (
          <Row label="GST Number" value={formData.gstNumber} />
        )}
      </Section>

      <Section title="Employment">
        <Row label="Occupation" value={formData.occupation} />
        <Row label="Company / Business" value={formData.companyName} />
        <Row
          label="Years of Experience"
          value={
            formData.yearsOfExperience !== "" && formData.yearsOfExperience !== undefined
              ? `${formData.yearsOfExperience} year${
                  Number(formData.yearsOfExperience) !== 1 ? "s" : ""
                }`
              : "Not provided"
          }
        />
      </Section>

      {formData.documents && formData.documents.length > 0 && (
        <Section title="Uploaded Documents">
          {formData.documents.map((doc, i) => (
            <Row
              key={i}
              label={
                doc._key === "pan"
                  ? "PAN Card"
                  : doc._key === "aadhaar"
                  ? "Aadhaar Card"
                  : "Supporting Document"
              }
              value={
                <span className="badge badge-success">
                  ✓ {doc.name} ({doc.size})
                </span>
              }
            />
          ))}
        </Section>
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
            ← Back to Edit
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setStep(currentStep + 1)}
          >
            Proceed to E-Sign →
          </button>
        </div>
      </div>
    </div>
  );
}
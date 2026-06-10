import { useLoanStore } from "../../store/loanStore";

const DOC_REQUIREMENTS = {
  personal: [
    { icon: "🪪", title: "PAN Card", desc: "Original or self-attested copy" },
    { icon: "📋", title: "Aadhaar Card", desc: "Front and back side required" },
    { icon: "💰", title: "Salary Slips", desc: "Last 3 months from employer" },
    { icon: "🏦", title: "Bank Statement", desc: "Last 6 months bank statements" },
  ],
  home: [
    { icon: "🪪", title: "PAN Card", desc: "Original or self-attested copy" },
    { icon: "📋", title: "Aadhaar Card", desc: "Front and back side required" },
    { icon: "🏠", title: "Property Documents", desc: "Sale deed, title documents" },
    { icon: "💰", title: "Salary / Income Proof", desc: "Latest salary slips or ITR" },
  ],
  business: [
    { icon: "🪪", title: "PAN Card", desc: "Proprietor / Director PAN" },
    { icon: "📋", title: "Aadhaar Card", desc: "Proprietor / Director Aadhaar" },
    { icon: "🏢", title: "GST Certificate", desc: "Valid GST registration certificate" },
    { icon: "📊", title: "Business Financials", desc: "ITR & audited financials (2 years)" },
  ],
};

export default function Documents() {
  const { currentStep, setStep, formData } = useLoanStore();

  const docs = DOC_REQUIREMENTS[formData.loanType] || DOC_REQUIREMENTS.personal;

  return (
    <div>
      <div className="info-box info">
        <span className="info-box-icon">ℹ️</span>
        <span>
          Please prepare the following documents. You'll upload them in the next step.
          All documents must be in JPG, PNG, or PDF format.
        </span>
      </div>

      <p className="section-title">Required for {formData.loanType || "your"} loan</p>

      <ul className="doc-list">
        {docs.map((doc, i) => (
          <li key={i} className="doc-item">
            <div className="doc-item-icon">{doc.icon}</div>
            <div className="doc-item-body">
              <div className="doc-item-title">{doc.title}</div>
              <div className="doc-item-sub">{doc.desc}</div>
            </div>
            <span className="badge badge-pending">Required</span>
          </li>
        ))}
      </ul>

      <div className="form-footer" style={{ margin: "0 -2.5rem -2rem", marginTop: "2rem" }}>
        <span className="form-footer-info">Auto-saved locally</span>
        <div className="form-footer-actions">
          <button type="button" className="btn btn-secondary" onClick={() => setStep(currentStep - 1)}>
            ← Back
          </button>
          <button type="button" className="btn btn-primary" onClick={() => setStep(currentStep + 1)}>
            I'm Ready — Upload →
          </button>
        </div>
      </div>
    </div>
  );
}
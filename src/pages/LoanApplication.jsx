import { useState, useEffect } from "react";
import { useLoanStore } from "../store/loanStore";
import PersonalInfo from "../components/steps/PersonalInfo";
import AddressInfo from "../components/steps/AddressInfo";
import LoanDetails from "../components/steps/LoanDetails";
import EmploymentInfo from "../components/steps/EmploymentInfo";
import Documents from "../components/steps/Documents";
import FileUpload from "../components/steps/FileUpload";
import Eligibility from "../components/steps/Eligibility";
import ReviewSubmit from "../components/steps/ReviewSubmit";
import Signature from "../components/steps/Signature";
import Success from "../components/steps/Success";

const STEPS = [
  { id: 1, label: "Personal Info", desc: "Your basic details" },
  { id: 2, label: "Address", desc: "Where you live" },
  { id: 3, label: "Loan Details", desc: "Loan type & amount" },
  { id: 4, label: "Employment", desc: "Work information" },
  { id: 5, label: "Documents", desc: "What you need" },
  { id: 6, label: "Upload Docs", desc: "Upload files" },
  { id: 7, label: "Eligibility", desc: "Check eligibility" },
  { id: 8, label: "Review", desc: "Confirm details" },
  { id: 9, label: "E-Signature", desc: "Sign application" },
];

export default function LoanApplication() {
  const { currentStep, maxStepReached, setStep, resetAll } = useLoanStore();
  const [showResumeToast, setShowResumeToast] = useState(false);

  useEffect(() => {
    if (maxStepReached > 1 && currentStep > 1) {
      setShowResumeToast(true);
    }
  }, []);

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <PersonalInfo />;
      case 2: return <AddressInfo />;
      case 3: return <LoanDetails />;
      case 4: return <EmploymentInfo />;
      case 5: return <Documents />;
      case 6: return <FileUpload />;
      case 7: return <Eligibility />;
      case 8: return <ReviewSubmit />;
      case 9: return <Signature />;
      case 10: return <Success />;
      default: return <PersonalInfo />;
    }
  };

  const progressPct = ((currentStep - 1) / 9) * 100;

  if (currentStep === 10) {
    return (
      <div className="app-layout" style={{ minHeight: "auto", maxWidth: "680px", margin: "0 auto" }}>
        <div className="main-content" style={{ minHeight: "auto" }}>
          {renderStep()}
        </div>
      </div>
    );
  }

  const currentStepData = STEPS[currentStep - 1] || STEPS[0];

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-brand-logo">
            <div className="sidebar-brand-icon">Z</div>
            <span className="sidebar-brand-name">Zetheta</span>
          </div>
          <div className="sidebar-brand-tagline">Loan Application Portal</div>
        </div>

        <ul className="sidebar-nav">
          {STEPS.map((step) => {
            const isCompleted = currentStep > step.id;
            const isActive = currentStep === step.id;
            const isSelectable = step.id <= maxStepReached;
            let cls = "sidebar-step";
            if (isCompleted) cls += " completed";
            else if (isActive) cls += " active";
            if (isSelectable) cls += " selectable";
            return (
              <li
                key={step.id}
                className={cls}
                onClick={() => {
                  if (isSelectable) {
                    setStep(step.id);
                  }
                }}
                style={isSelectable ? { cursor: "pointer" } : undefined}
              >
                <div className="sidebar-step-num">
                  {isCompleted ? "✓" : step.id}
                </div>
                <span className="sidebar-step-label">{step.label}</span>
              </li>
            );
          })}
        </ul>

        <div className="sidebar-progress-wrap">
          <div className="sidebar-progress-label">
            <span>Progress</span>
            <span>{Math.round(progressPct)}%</span>
          </div>
          <div className="sidebar-progress-bar">
            <div className="sidebar-progress-fill" style={{ width: `${progressPct}%` }} />
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="main-content">
        {showResumeToast && (
          <div className="draft-resume-banner">
            <span>📂 Draft resumed from your previous auto-saved session.</span>
            <div className="draft-resume-banner-actions">
              <button
                onClick={() => setShowResumeToast(false)}
                className="btn btn-sm btn-ghost"
                style={{ color: "#2563eb", fontWeight: 600, padding: "0.25rem 0.5rem" }}
              >
                Keep Drafting
              </button>
              <button
                onClick={() => {
                  resetAll();
                  setShowResumeToast(false);
                }}
                className="btn btn-sm btn-danger-ghost"
                style={{ marginLeft: "8px", padding: "0.25rem 0.5rem" }}
              >
                Start Fresh
              </button>
            </div>
          </div>
        )}

        <div className="content-header">
          <div className="content-header-left">
            <h2>{currentStepData.label}</h2>
            <p>{currentStepData.desc}</p>
          </div>
          <div className="content-header-step-badge">
            Step {currentStep} of 9
          </div>
        </div>

        <div className="form-area">
          <div className="step-enter" key={currentStep}>
            {renderStep()}
          </div>
        </div>
      </main>
    </div>
  );
}
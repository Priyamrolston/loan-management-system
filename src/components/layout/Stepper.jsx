export default function Stepper({ currentStep }) {
  const steps = [
    "Personal",
    "Address",
    "Loan",
    "Employment",
    "Documents",
    "Uploads",
    "Eligibility",
    "Review",
    "Signature",
    "Success"
  ];

  return (
    <div style={{ marginBottom: "20px" }}>
      {steps.map((step, index) => (
        <span
          key={step}
          style={{
            padding: "8px 12px",
            marginRight: "10px",
            borderRadius: "20px",
            background:
              currentStep === index + 1
                ? "#2563eb"
                : "#e5e7eb",
            color:
              currentStep === index + 1
                ? "white"
                : "black",
          }}
        >
          {step}
        </span>
      ))}
    </div>
  );
}
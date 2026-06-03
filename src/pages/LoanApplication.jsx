import Signature from "../components/steps/Signature";
import { useLoanStore } from "../store/loanStore";
import Stepper from "../components/layout/Stepper";

import PersonalInfo from "../components/steps/PersonalInfo";
import AddressInfo from "../components/steps/AddressInfo";
import LoanDetails from "../components/steps/LoanDetails";
import EmploymentInfo from "../components/steps/EmploymentInfo";
import Documents from "../components/steps/Documents";
import FileUpload from "../components/steps/FileUpload";
import Eligibility from "../components/steps/Eligibility";
import ReviewSubmit from "../components/steps/ReviewSubmit";
import Success from "../components/steps/Success";

export default function LoanApplication() {
  const { currentStep, setStep } = useLoanStore();

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <PersonalInfo />;
      case 2:
        return <AddressInfo />;
      case 3:
        return <LoanDetails />;
      case 4:
        return <EmploymentInfo />;
      case 5:
        return <Documents />;
      case 6:
        return <FileUpload />;
      case 7:
        return <Eligibility />;
      case 8:
        return <ReviewSubmit />;
      case 9:
        return <Signature />;
      case 10:
        return <Success />;
      default:
        return <PersonalInfo />;
    }
  };

  return (
    <div className="container">
      <h1>Loan Application Portal</h1>

      <Stepper currentStep={currentStep} />

      <div className="mt-6">
        {renderStep()}
      </div>

      <div className="mt-4">
        <button
          disabled={currentStep === 1}
          onClick={() => setStep(currentStep - 1)}
        >
          Previous
        </button>

        <button
          onClick={() => setStep(currentStep + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
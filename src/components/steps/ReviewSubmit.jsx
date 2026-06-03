import { useLoanStore } from "../../store/loanStore";

export default function ReviewSubmit() {
    const { formData, setStep } = useLoanStore();
    return (
        <div>
            <h2>Review Application</h2>

            <h3>Personal Details</h3>
            <p>Name: {formData.fullName}</p>
            <p>Email: {formData.email}</p>
            <p>Mobile: {formData.mobile}</p>

            <h3>Loan Details</h3>
            <p>Loan Type: {formData.loanType}</p>
            <p>Loan Amount: {formData.loanAmount}</p>

            <h3>Employment</h3>
            <p>Occupation: {formData.occupation}</p>
            <p>Company: {formData.companyName}</p>

            <button
                style={{
                    background: "green",
                    color: "white",
                    padding: "10px 20px",
                    borderRadius: "8px",
                }}
                onClick={() => {
                    alert(
                        "Application Submitted Successfully!"
                    );
                    setStep(10);
                }}
            >
                Submit Application
            </button>
        </div>
    );
}
import { useLoanStore } from "../../store/loanStore";

export default function Eligibility() {
  const { formData } = useLoanStore();

  const income =
    Number(formData.salary) || 0;

  const eligibleAmount =
    income * 60;

  return (
    <div>
      <h2>
        Loan Eligibility Result
      </h2>

      <p>
        Monthly Income: ₹{income}
      </p>

      <p>
        Eligible Loan Amount:
        ₹{eligibleAmount}
      </p>

      <p>
        Status:
        {eligibleAmount > 500000
          ? " Approved ✅"
          : " Review Required ⚠️"}
      </p>
    </div>
  );
}
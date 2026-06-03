import { useLoanStore } from "../../store/loanStore";

export default function EmploymentInfo() {
  const { formData, updateForm } =
    useLoanStore();

  return (
    <div>
      <h2>Employment Details</h2>

      <input
        placeholder="Occupation"
        value={formData.occupation || ""}
        onChange={(e) =>
          updateForm({
            occupation: e.target.value,
          })
        }
      />

      <input
        placeholder="Company Name"
        value={formData.companyName || ""}
        onChange={(e) =>
          updateForm({
            companyName: e.target.value,
          })
        }
      />
    </div>
  );
}
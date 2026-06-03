import { useLoanStore } from "../../store/loanStore";

export default function LoanDetails() {
  const { formData, updateForm } = useLoanStore();

  const handleChange = (e) => {
    updateForm({
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div>
      <h2>Loan Details</h2>

      <select
        name="loanType"
        value={formData.loanType}
        onChange={handleChange}
      >
        <option value="">
          Select Loan Type
        </option>

        <option value="personal">
          Personal Loan
        </option>

        <option value="home">
          Home Loan
        </option>

        <option value="business">
          Business Loan
        </option>
      </select>

      <br />
      <br />

      <input
        type="number"
        name="loanAmount"
        placeholder="Loan Amount"
        value={formData.loanAmount}
        onChange={handleChange}
      />

      <br />
      <br />

      {formData.loanType === "personal" && (
        <input
          name="salary"
          placeholder="Monthly Salary"
          value={formData.salary}
          onChange={handleChange}
        />
      )}

      {formData.loanType === "home" && (
        <input
          name="propertyValue"
          placeholder="Property Value"
          value={formData.propertyValue}
          onChange={handleChange}
        />
      )}

      {formData.loanType === "business" && (
        <input
          name="gstNumber"
          placeholder="GST Number"
          value={formData.gstNumber}
          onChange={handleChange}
        />
      )}
    </div>
  );
}
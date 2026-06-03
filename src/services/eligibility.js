export const calculateEligibility = (
  income
) => {
  const eligibleAmount = income * 60;

  return {
    eligibleAmount,
    status:
      eligibleAmount > 500000
        ? "Approved"
        : "Review Required",
  };
};
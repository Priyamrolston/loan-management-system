export const verifyPAN = async (pan) => {
  await new Promise((resolve) =>
    setTimeout(resolve, 1500)
  );

  return /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(pan);
};

export const verifyAadhaar = async (aadhaar) => {
  await new Promise((resolve) =>
    setTimeout(resolve, 1500)
  );

  return aadhaar.length === 12;
};
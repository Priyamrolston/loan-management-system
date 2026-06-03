import { useState } from "react";
import { verifyPAN, verifyAadhaar } from "../../services/verification";

export default function Documents() {
  const [pan, setPan] = useState("");
  const [aadhaar, setAadhaar] = useState("");

  const [panStatus, setPanStatus] = useState("");
  const [aadhaarStatus, setAadhaarStatus] = useState("");

  const checkPAN = async () => {
    const result = await verifyPAN(pan);

    setPanStatus(
      result ? "PAN Verified ✅" : "Invalid PAN ❌"
    );
  };

  const checkAadhaar = async () => {
    const result = await verifyAadhaar(aadhaar);

    setAadhaarStatus(
      result
        ? "Aadhaar Verified ✅"
        : "Invalid Aadhaar ❌"
    );
  };

  return (
    <div>
      <h2>Document Verification</h2>

      <input
        placeholder="PAN Number"
        value={pan}
        onChange={(e) => setPan(e.target.value)}
      />

      <button onClick={checkPAN}>
        Verify PAN
      </button>

      <p>{panStatus}</p>

      <br />

      <input
        placeholder="Aadhaar Number"
        value={aadhaar}
        onChange={(e) =>
          setAadhaar(e.target.value)
        }
      />

      <button onClick={checkAadhaar}>
        Verify Aadhaar
      </button>

      <p>{aadhaarStatus}</p>
    </div>
  );
}
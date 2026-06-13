import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { addressSchema } from "../../validation/schemas";
import { useLoanStore } from "../../store/loanStore";

// Bug fix: PINCODE_MAP must be defined outside the component so it doesn't
// get re-created on every render (causing the useEffect to loop).
const PINCODE_MAP = {
  "400001": { city: "Mumbai", state: "Maharashtra" },
  "400002": { city: "Mumbai", state: "Maharashtra" },
  "400003": { city: "Mumbai", state: "Maharashtra" },
  "110001": { city: "New Delhi", state: "Delhi" },
  "110002": { city: "New Delhi", state: "Delhi" },
  "110003": { city: "New Delhi", state: "Delhi" },
  "560001": { city: "Bengaluru", state: "Karnataka" },
  "560002": { city: "Bengaluru", state: "Karnataka" },
  "600001": { city: "Chennai", state: "Tamil Nadu" },
  "600002": { city: "Chennai", state: "Tamil Nadu" },
  "700001": { city: "Kolkata", state: "West Bengal" },
  "700002": { city: "Kolkata", state: "West Bengal" },
  "500001": { city: "Hyderabad", state: "Telangana" },
  "500002": { city: "Hyderabad", state: "Telangana" },
  "380001": { city: "Ahmedabad", state: "Gujarat" },
  "380002": { city: "Ahmedabad", state: "Gujarat" },
  "411001": { city: "Pune", state: "Maharashtra" },
  "411002": { city: "Pune", state: "Maharashtra" },
  "302001": { city: "Jaipur", state: "Rajasthan" },
  "302002": { city: "Jaipur", state: "Rajasthan" },
  "226001": { city: "Lucknow", state: "Uttar Pradesh" },
  "226002": { city: "Lucknow", state: "Uttar Pradesh" },
  "201301": { city: "Noida", state: "Uttar Pradesh" },
  "122001": { city: "Gurugram", state: "Haryana" },
  "160017": { city: "Chandigarh", state: "Chandigarh" },
  "800001": { city: "Patna", state: "Bihar" },
  "462001": { city: "Bhopal", state: "Madhya Pradesh" },
  "492001": { city: "Raipur", state: "Chhattisgarh" },
  "682001": { city: "Kochi", state: "Kerala" },
};

const MOCK_SUGGESTIONS = [
  {
    display: "Flat 402, Oakwood Apartments, Bandra West, Mumbai, Maharashtra - 400001",
    address: "Flat 402, Oakwood Apartments, Bandra West",
    pincode: "400001",
    city: "Mumbai",
    state: "Maharashtra"
  },
  {
    display: "House 15, Sector 15A, Noida, Uttar Pradesh - 201301",
    address: "House 15, Sector 15A",
    pincode: "201301",
    city: "Noida",
    state: "Uttar Pradesh"
  },
  {
    display: "No. 45, Residency Road, Richmond Town, Bengaluru, Karnataka - 560001",
    address: "No. 45, Residency Road, Richmond Town",
    pincode: "560001",
    city: "Bengaluru",
    state: "Karnataka"
  },
  {
    display: "Plot 120, Jubilee Hills, Road No. 10, Hyderabad, Telangana - 500001",
    address: "Plot 120, Jubilee Hills, Road No. 10",
    pincode: "500001",
    city: "Hyderabad",
    state: "Telangana"
  },
  {
    display: "Flat 12A, DLF Phase 3, Gurugram, Haryana - 122001",
    address: "Flat 12A, DLF Phase 3",
    pincode: "122001",
    city: "Gurugram",
    state: "Haryana"
  },
  {
    display: "12 General Patters Road, Mount Road, Chennai, Tamil Nadu - 600002",
    address: "12 General Patters Road, Mount Road",
    pincode: "600002",
    city: "Chennai",
    state: "Tamil Nadu"
  },
  {
    display: "A-88, Shanti Path, Tilak Nagar, Jaipur, Rajasthan - 302002",
    address: "A-88, Shanti Path, Tilak Nagar",
    pincode: "302002",
    city: "Jaipur",
    state: "Rajasthan"
  },
  {
    display: "55/A Park Street, Elgin, Kolkata, West Bengal - 700002",
    address: "55/A Park Street, Elgin",
    pincode: "700002",
    city: "Kolkata",
    state: "West Bengal"
  }
];

export default function AddressInfo() {
  const { formData, updateForm, currentStep, setStep } = useLoanStore();
  const [pincodeLooking, setPincodeLooking] = useState(false);
  // Bug fix: initialise pincodeFound to true only when we already have a valid city saved
  const [pincodeFound, setPincodeFound] = useState(
    !!(formData.city && formData.pincode && formData.pincode.length === 6)
  );
  // Bug fix: track if pincode was not found in our map so we can show an error
  const [pincodeNotFound, setPincodeNotFound] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      address: formData.address || "",
      pincode: formData.pincode || "",
      city: formData.city || "",
      state: formData.state || "",
    },
    // Bug fix: use "onChange" so isValid tracks immediately as the user types
    mode: "onChange",
  });

  const pincode = watch("pincode");
  const addressVal = watch("address");

  const filteredSuggestions = addressVal && addressVal.trim().length >= 3
    ? MOCK_SUGGESTIONS.filter((item) =>
        item.display.toLowerCase().includes(addressVal.toLowerCase())
      )
    : [];

  useEffect(() => {
    // Only digits allowed in pincode
    if (!pincode || pincode.length !== 6) {
      if (pincode && pincode.length > 0) {
        setPincodeFound(false);
        setPincodeNotFound(false);
      }
      return;
    }

    setPincodeLooking(true);
    setPincodeNotFound(false);

    const timer = setTimeout(() => {
      const result = PINCODE_MAP[pincode];
      if (result) {
        setValue("city", result.city, { shouldValidate: true });
        setValue("state", result.state, { shouldValidate: true });
        setPincodeFound(true);
        setPincodeNotFound(false);
      } else {
        // Unknown pincode — let user type manually
        setValue("city", "", { shouldValidate: false });
        setValue("state", "", { shouldValidate: false });
        setPincodeFound(false);
        setPincodeNotFound(true);
      }
      setPincodeLooking(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [pincode, setValue]);

  const onSubmit = (data) => {
    updateForm(data);
    setStep(currentStep + 1);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="form-group">
        <label>
          Residential Address <span className="required">*</span>
        </label>
        <div className="autocomplete-wrapper" style={{ position: "relative" }}>
          <textarea
            placeholder="House/Flat No., Street, Area, Locality (Type 3+ chars for suggestions)"
            {...register("address")}
            rows={3}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 250)}
          />
          {showSuggestions && filteredSuggestions.length > 0 && (
            <ul className="autocomplete-suggestions">
              {filteredSuggestions.map((item, i) => (
                <li
                  key={i}
                  className="autocomplete-suggestion-item"
                  onMouseDown={() => {
                    setValue("address", item.address, { shouldValidate: true });
                    setValue("pincode", item.pincode, { shouldValidate: true });
                    setValue("city", item.city, { shouldValidate: true });
                    setValue("state", item.state, { shouldValidate: true });
                    setPincodeFound(true);
                    setPincodeNotFound(false);
                    setShowSuggestions(false);
                  }}
                >
                  {item.display}
                </li>
              ))}
            </ul>
          )}
        </div>
        {errors.address && (
          <span className="error-msg">⚠ {errors.address.message}</span>
        )}
      </div>

      <div className="form-grid-2">
        <div className="form-group">
          <label>
            PIN Code <span className="required">*</span>
            {pincodeLooking && (
              <span
                style={{ marginLeft: "8px", fontSize: "0.75rem", color: "#2563eb" }}
              >
                Looking up…
              </span>
            )}
            {pincodeFound && !pincodeLooking && (
              <span
                style={{ marginLeft: "8px", fontSize: "0.75rem", color: "#16a34a" }}
              >
                ✓ Found
              </span>
            )}
            {pincodeNotFound && !pincodeLooking && (
              <span
                style={{ marginLeft: "8px", fontSize: "0.75rem", color: "#f59e0b" }}
              >
                Not in list — enter city/state manually
              </span>
            )}
          </label>
          <input
            type="text"
            placeholder="6-digit PIN code"
            maxLength={6}
            // Bug fix: only allow digit input for pincode
            onKeyDown={(e) => {
              if (
                !/[0-9]/.test(e.key) &&
                !["Backspace", "Delete", "Tab", "ArrowLeft", "ArrowRight"].includes(e.key)
              ) {
                e.preventDefault();
              }
            }}
            {...register("pincode")}
          />
          {errors.pincode && (
            <span className="error-msg">⚠ {errors.pincode.message}</span>
          )}
        </div>

        <div className="form-group">
          <label>
            City <span className="required">*</span>{" "}
            {!pincodeNotFound && <span className="optional">auto-filled</span>}
          </label>
          <input
            type="text"
            placeholder={pincodeNotFound ? "Enter your city" : "Auto-filled from PIN"}
            // Bug fix: readOnly only when auto-filled; editable when pincode not in map
            readOnly={pincodeFound && !pincodeNotFound}
            {...register("city")}
          />
          {errors.city && (
            <span className="error-msg">⚠ {errors.city.message}</span>
          )}
        </div>
      </div>

      <div className="form-group">
        <label>
          State <span className="required">*</span>{" "}
          {!pincodeNotFound && <span className="optional">auto-filled</span>}
        </label>
        <input
          type="text"
          placeholder={pincodeNotFound ? "Enter your state" : "Auto-filled from PIN"}
          readOnly={pincodeFound && !pincodeNotFound}
          {...register("state")}
        />
        {errors.state && (
          <span className="error-msg">⚠ {errors.state.message}</span>
        )}
      </div>

      {pincodeFound && !pincodeNotFound && (
        <div className="info-box success">
          <span className="info-box-icon">✅</span>
          <span>City and state auto-filled from your PIN code.</span>
        </div>
      )}

      {pincodeNotFound && (
        <div className="info-box warning">
          <span className="info-box-icon">⚠️</span>
          <span>
            PIN code not found in our database. Please enter your city and state
            manually.
          </span>
        </div>
      )}

      <div
        className="form-footer"
        style={{ margin: "0 -2.5rem -2rem", marginTop: "2rem" }}
      >
        <span className="form-footer-info">Auto-saved locally</span>
        <div className="form-footer-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setStep(currentStep - 1)}
          >
            ← Back
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!isValid}
          >
            Continue →
          </button>
        </div>
      </div>
    </form>
  );
}
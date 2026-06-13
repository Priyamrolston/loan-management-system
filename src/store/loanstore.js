import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useLoanStore = create(
  persist(
    (set) => ({
      currentStep: 1,
      maxStepReached: 1,
      isEligibilityCalculated: false,

      formData: {
        // Personal
        fullName: "",
        email: "",
        mobile: "",
        pan: "",
        aadhaar: "",
        // Address
        address: "",
        city: "",
        state: "",
        pincode: "",
        // Loan
        loanType: "",
        loanAmount: "",
        salary: "",
        propertyValue: "",
        gstNumber: "",
        // Employment
        occupation: "",
        companyName: "",
        yearsOfExperience: "",
        // Upload
        documents: [],
        // Signature
        signature: null,
      },

      verificationStatus: {
        pan: false,
        aadhaar: false,
      },

      // ─── Actions ─────────────────────────────────────
      setStep: (step) =>
        set((state) => ({
          currentStep: step,
          maxStepReached: Math.max(state.maxStepReached, step),
        })),

      setEligibilityCalculated: (val) => set({ isEligibilityCalculated: val }),

      updateForm: (data) =>
        set((state) => {
          const newFormData = { ...state.formData, ...data };
          let extra = {};

          // Cross-step dependency 1: If loanType changes, clear downstream steps and files
          if (data.loanType !== undefined && data.loanType !== state.formData.loanType) {
            newFormData.documents = [];
            newFormData.signature = null;

            // Reset other conditional fields
            if (data.loanType !== "personal") newFormData.salary = "";
            if (data.loanType !== "home") newFormData.propertyValue = "";
            if (data.loanType !== "business") newFormData.gstNumber = "";

            extra.isEligibilityCalculated = false;
            // Roll back max step to current step or loan details step (Step 3)
            extra.maxStepReached = Math.max(state.currentStep, 3);
          }

          // Cross-step dependency 2: If values affecting eligibility are changed, reset eligibility calculation
          const eligibilityParams = ["loanAmount", "salary", "propertyValue", "yearsOfExperience"];
          const isEligibilityParamChanged = eligibilityParams.some(
            (param) => data[param] !== undefined && data[param] !== state.formData[param]
          );

          if (isEligibilityParamChanged) {
            extra.isEligibilityCalculated = false;
            // Roll back max step so user is forced to re-run eligibility check at Step 7
            extra.maxStepReached = Math.min(state.maxStepReached, 6);
          }

          return {
            formData: newFormData,
            ...extra,
          };
        }),

      setVerificationStatus: (type, status) =>
        set((state) => ({
          verificationStatus: { ...state.verificationStatus, [type]: status },
        })),

      setSignature: (sig) =>
        set((state) => ({
          formData: { ...state.formData, signature: sig },
        })),

      resetAll: () =>
        set({
          currentStep: 1,
          maxStepReached: 1,
          isEligibilityCalculated: false,
          formData: {
            fullName: "", email: "", mobile: "", pan: "", aadhaar: "",
            address: "", city: "", state: "", pincode: "",
            loanType: "", loanAmount: "", salary: "", propertyValue: "", gstNumber: "",
            occupation: "", companyName: "", yearsOfExperience: "",
            documents: [], signature: null,
          },
          verificationStatus: { pan: false, aadhaar: false },
        }),
    }),
    {
      name: "loan-application-storage",
    }
  )
);
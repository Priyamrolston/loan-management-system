import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useLoanStore = create(
  persist(
    (set) => ({
      currentStep: 1,

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
      setStep: (step) => set({ currentStep: step }),

      updateForm: (data) =>
        set((state) => ({
          formData: { ...state.formData, ...data },
        })),

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
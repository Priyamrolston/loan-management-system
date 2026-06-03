import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useLoanStore = create(
  persist(
    (set) => ({
      currentStep: 1,

      formData: {
        fullName: "",
        email: "",
        mobile: "",
        loanType: "",
        loanAmount: "",
        salary: "",
        propertyValue: "",
        gstNumber: "",
        occupation: "",
        companyName: "",
      },

      setStep: (step) =>
        set({
          currentStep: step,
        }),

      updateForm: (data) =>
        set((state) => ({
          formData: {
            ...state.formData,
            ...data,
          },
        })),
    }),
    {
      name: "loan-application-storage",
    }
  )
);
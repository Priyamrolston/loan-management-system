import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { personalSchema } from "../../validation/schemas";
import { useLoanStore } from "../../store/loanStore";

export default function PersonalInfo() {
  const { formData, updateForm } =
    useLoanStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(personalSchema),
    defaultValues: formData,
  });

  const onSubmit = (data) => {
    updateForm(data);
    alert("Saved Successfully");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>Personal Information</h2>

      <input
        placeholder="Full Name"
        {...register("fullName")}
      />

      <p>{errors.fullName?.message}</p>

      <input
        placeholder="Email"
        {...register("email")}
      />

      <p>{errors.email?.message}</p>

      <input
        placeholder="Mobile Number"
        {...register("mobile")}
      />

      <p>{errors.mobile?.message}</p>

      <button type="submit">
        Save
      </button>
    </form>
  );
}
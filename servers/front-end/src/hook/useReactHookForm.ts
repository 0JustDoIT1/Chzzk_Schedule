import { useForm } from "react-hook-form";

const useReactHookForm = (initValue: any) => {
  const {
    register,
    control,
    setValue,
    watch,
    setFocus,
    reset,
    clearErrors,
    handleSubmit,
    formState: { errors },
  } = useForm({ reValidateMode: "onChange", defaultValues: initValue });

  const ringStyle = (name: string): string => {
    if (errors[name]) return "ring-error focus:ring-2 focus:ring-error";
    else return "ring-textLight focus:ring-brandMain";
  };

  return {
    register,
    control,
    setValue,
    watch,
    setFocus,
    reset,
    errors,
    clearErrors,
    handleSubmit,
    ringStyle,
  };
};

export default useReactHookForm;

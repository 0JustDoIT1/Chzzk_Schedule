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
  };
};

export default useReactHookForm;

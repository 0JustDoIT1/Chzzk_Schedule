import { DefaultValues, FieldValues, useForm } from "react-hook-form";

const useReactHookForm = <T extends FieldValues>(initValue: DefaultValues<T>) => {
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
  } = useForm<T>({ reValidateMode: "onChange", defaultValues: initValue });

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

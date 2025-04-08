import { setDateAndTime } from "@/utils/dateFormat";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const useScheduleInput = (
  isOfficial: boolean,
  setIsOfficial: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const initValue: any = {
    streamer: "",
    category: "",
    title: "",
    member: [],
    fullDay: false,
    startAtDate: setDateAndTime().date,
    startAtTime: setDateAndTime().time,
    endAtDate: setDateAndTime().date,
    endAtTime: setDateAndTime().time,
    contents: "",
  };

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

  const [member, setMember] = useState<string[]>([]);

  const ringStyle = (name: string): string => {
    if (errors[name]) return "ring-error focus:ring-2 focus:ring-error";
    else return "ring-textLight focus:ring-brandMain";
  };

  useEffect(() => {
    if (isOfficial) {
      setValue("streamer", "");
      clearErrors(["streamer"]);
    }
    setValue("member", []);
  }, [isOfficial]);

  useEffect(() => {
    if (
      watch("category") &&
      (watch("category") === "personal" || watch("category") === "watch")
    ) {
      setValue("member", []);
    }
  }, [watch("category")]);

  useEffect(() => {
    if (watch("fullDay")) {
      const date = watch("startAtDate");
      setValue("endAtDate", date, { shouldValidate: true });
      setValue("startAtTime", "00:00", { shouldValidate: true });
      setValue("endAtTime", "23:59", { shouldValidate: true });
    }
  }, [watch("fullDay"), watch("startAtDate")]);

  useEffect(() => {
    if (errors.streamer) {
      setTimeout(() => {
        setFocus("streamer");
      });
    }
  }, [errors.streamer, setFocus]);

  const onAddMember = () => {
    const name = watch("member");
    if (name) {
      if (member.includes(name)) setValue("member", "");
      else {
        setMember([...member, name]);
        setValue("member", "");
      }
    }
  };

  const onRemoveMember = (name: string) => {
    setMember(member.filter((item: string) => item !== name));
  };

  const onFocusTiptapLabel = () => {
    const tiptapEditor = document.getElementsByClassName(
      "ProseMirror"
    )[0] as HTMLElement;
    tiptapEditor.focus();
  };

  const onReset = () => {
    reset();
    clearErrors();
    setIsOfficial(false);
  };

  const onSubmit = handleSubmit((data) => {
    const result = {
      ...data,
      isOfficial,
      member,
    };
    // if (isOfficial) delete result.streamer;
    console.log("데이터", result);
  });

  return {
    register,
    control,
    errors,
    setValue,
    watch,
    onSubmit,
    onReset,
    initValue,
    member,
    setMember,
    onAddMember,
    onRemoveMember,
    onFocusTiptapLabel,
    ringStyle,
  };
};

export default useScheduleInput;

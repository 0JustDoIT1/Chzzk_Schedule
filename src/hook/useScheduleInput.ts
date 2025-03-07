import { dateToFormatString } from "@/utils/dateFormat";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const useScheduleInput = (
  isOfficial: boolean,
  setIsOfficial: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const {
    register,
    control,
    setValue,
    watch,
    setFocus,
    clearErrors,
    handleSubmit,
    formState: { errors },
  } = useForm({ reValidateMode: "onChange" });

  const [fullDay, setFullDay] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [member, setMember] = useState<string[]>([]);

  const ringStyle = (name: string) => {
    if (errors[name]) return "ring-error focus:ring-2 focus:ring-error";
    else return "ring-gray-300 focus:ring-brandMain";
  };

  useEffect(() => {
    if (isOfficial) {
      setValue("streamer", "");
      clearErrors(["streamer"]);
    }
    setMember([]);
  }, [isOfficial]);

  useEffect(() => {
    if (
      watch("category") &&
      (watch("category") === "personal" || watch("category") === "watch")
    ) {
      setMember([]);
    }
  }, [watch("category")]);

  useEffect(() => {
    if (fullDay) {
      const date = watch("startAtDate");
      setValue("endAtDate", date, { shouldValidate: true });
      setValue("startAtTime", "00:00", { shouldValidate: true });
      setValue("endAtTime", "23:59", { shouldValidate: true });
    }
  }, [fullDay, watch("startAtDate")]);

  useEffect(() => {
    if (errors.streamer) {
      setTimeout(() => {
        setFocus("streamer");
      });
    }
  }, [errors.streamer, setFocus]);

  const setDateAndTime = () => {
    let dateTime = new Date();
    if (0 <= dateTime.getMinutes() && dateTime.getMinutes() < 30) {
      dateTime.setMinutes(30);
    } else {
      dateTime.setHours(dateTime.getHours() + 1);
      dateTime.setMinutes(0);
    }

    const date = dateToFormatString(dateTime, "YYYY-MM-DD");
    const time = dateToFormatString(dateTime, "HH:mm");

    return { date, time };
  };

  const initValue: { [x: string]: string } = {
    streamer: "",
    category: "",
    title: "",
    startAtDate: setDateAndTime().date,
    startAtTime: setDateAndTime().time,
    endAtDate: setDateAndTime().date,
    endAtTime: setDateAndTime().time,
    contents: "",
  };

  const onFocusTiptapLabel = () => {
    const tiptapEditor = document.getElementsByClassName(
      "ProseMirror"
    )[0] as HTMLElement;
    tiptapEditor.focus();
  };

  const onReset = () => {
    Object.keys(initValue).forEach((key) => {
      setValue(key, initValue[key]);
      clearErrors();
    });
    setFullDay(false);
    setDisabled(false);
    setMember([]);
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
    onFocusTiptapLabel,
    member,
    setMember,
    fullDay,
    setFullDay,
    disabled,
    setDisabled,
    ringStyle,
  };
};

export default useScheduleInput;

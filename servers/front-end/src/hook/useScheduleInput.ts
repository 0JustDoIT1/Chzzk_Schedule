import { dateTypeToDate, setDateAndTime } from "@/utils/dateFormat";
import { useEffect, useState } from "react";
import useReactHookForm from "./useReactHookForm";
import { ISchedule, IScheduleInput } from "@/schemas/schedule.schema";
import { createSchedule } from "@/api/schedule-api";
import { useAsPathStore } from "@/providers/asPath-provider";
import { useToastStore } from "@/providers/toast-provider";
import { showErrorToast } from "@/utils/errorHandler";
import { useRouter } from "next/navigation";

const useScheduleInput = (
  isOfficial: boolean,
  setIsOfficial: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const router = useRouter();
  const previousAsPath = useAsPathStore((state) => state.previousAsPath);
  const showToast = useToastStore((state) => state.showToast);

  const initValue: Partial<IScheduleInput> = {
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
    errors,
    clearErrors,
    handleSubmit,
  } = useReactHookForm(initValue);

  const [member, setMember] = useState<string[]>([]);

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
    setMember(initValue.member!);
    setIsOfficial(false);
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      const inputData: IScheduleInput = {
        ...data,
        isOfficial,
        member,
      };

      const startAt = `${inputData.startAtDate} ${inputData.startAtTime}`;
      const endAt = `${inputData.endAtDate} ${inputData.endAtTime}`;

      const result: ISchedule = {
        isOfficial: inputData.isOfficial,
        streamer: inputData.streamer,
        category: inputData.category,
        title: inputData.title,
        member: inputData.member,
        startAt: dateTypeToDate(startAt),
        endAt: dateTypeToDate(endAt),
        contents: inputData.contents,
      };
      if (result.isOfficial) delete result.streamer;
      if (!result.member || !result.member?.length) delete result.member;
      if (!result.contents) delete result.contents;

      console.log("!!!", result);
      // await createSchedule(result);
      // router.push(previousAsPath!);
      showToast("success", `일정을 추가했습니다.`);
    } catch (error) {
      showErrorToast(error, showToast);
    }
  });

  return {
    register,
    control,
    errors,
    watch,
    onSubmit,
    onReset,
    initValue,
    member,
    setMember,
    onAddMember,
    onRemoveMember,
    onFocusTiptapLabel,
  };
};

export default useScheduleInput;

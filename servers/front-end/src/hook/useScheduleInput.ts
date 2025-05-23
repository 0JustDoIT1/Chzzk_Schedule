import { dateTypeToDate, setDateAndTime } from "@/utils/dateFormat";
import { useEffect, useState } from "react";
import useReactHookForm from "./useReactHookForm";
import {
  BaseCategory,
  ChzzkCategory,
  ISchedule,
  IScheduleInput,
} from "@/schemas/schedule.schema";
import { useAsPathStore } from "@/providers/asPath-provider";
import { useToastStore } from "@/providers/toast-provider";
import { useRouter } from "next/navigation";
import { createSchedule } from "@/api/schedule-api";
import { isResError } from "@/fetch/error-check";

const useScheduleInput = (
  isOfficial: boolean,
  setIsOfficial: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const router = useRouter();
  const previousAsPath = useAsPathStore((state) => state.previousAsPath);
  const showToast = useToastStore((state) => state.showToast);

  const initValue: Partial<IScheduleInput> = {
    streamer: "",
    category: undefined,
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

  // Reset input value
  const _resetInputValue = () => {
    reset();
    clearErrors();
    setMember(initValue.member!);
  };

  // Reset input value when change isOfficial
  useEffect(() => {
    _resetInputValue();
  }, [isOfficial]);

  // Set value(member) when change category
  useEffect(() => {
    if (
      watch("category") &&
      (watch("category") === "personal" || watch("category") === "watch")
    ) {
      setValue("member", "");
      setMember([]);
    }
  }, [watch("category")]);

  // Check fullDay event
  useEffect(() => {
    if (watch("fullDay")) {
      const date = watch("startAtDate");
      setValue("endAtDate", date, { shouldValidate: true });
      setValue("startAtTime", "00:00", { shouldValidate: true });
      setValue("endAtTime", "23:59", { shouldValidate: true });
    }
  }, [watch("fullDay"), watch("startAtDate")]);

  useEffect(() => {
    const startAtDate = watch("startAtDate");
    const endAtDate = watch("endAtDate");
    const startAtTime = watch("startAtTime");
    const endAtTime = watch("endAtTime");

    if (startAtDate === endAtDate) {
      if (startAtTime > endAtTime) {
        setValue("startAtTime", endAtTime);
        setValue("endAtTime", startAtTime);
      }
    } else {
      if (startAtDate > endAtDate) {
        setValue("startAtDate", endAtDate);
        setValue("endAtDate", startAtDate);
      }
    }
  }, [
    watch("startAtDate"),
    watch("startAtTime"),
    watch("endAtDate"),
    watch("endAtTime"),
  ]);

  // When streamer input has error, focus input
  useEffect(() => {
    if (errors.streamer) {
      setTimeout(() => {
        setFocus("streamer");
      });
    }
  }, [errors.streamer, setFocus]);

  // Add member button event
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

  // Remove member button event
  const onRemoveMember = (name: string) => {
    setMember(member.filter((item: string) => item !== name));
  };

  // Focus tiptap label
  const onFocusTiptapLabel = () => {
    const tiptapEditor = document.getElementsByClassName(
      "ProseMirror"
    )[0] as HTMLElement;
    tiptapEditor.focus();
  };

  // Reset button event
  const onReset = () => {
    _resetInputValue();
    setIsOfficial(false);
  };

  // Submit event
  const onSubmit = handleSubmit(async (data) => {
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
    if (!result.member || result.member?.length === 0) delete result.member;
    if (!result.contents) delete result.contents;

    const schedule = await createSchedule(result);
    if (isResError(schedule))
      return showToast("error", `같은 시간대에 스케줄이 존재합니다.`);

    router.push(previousAsPath!);
    showToast("success", `일정을 추가했습니다.`);
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

import { dateTypeToDate, setDateAndTime } from "@/lib/utils/dateFormat";
import { useEffect, useMemo, useState } from "react";
import useReactHookForm from "./useReactHookForm";
import {
  getStreamerNameByCategory,
  ISchedule,
  IScheduleInput,
} from "@/schemas/schedule.schema";
import { useToastStore } from "@/lib/providers/toast-provider";
import { useRouter } from "next/navigation";
import { createSchedule } from "@/api/schedule-api";
import { IApiError } from "../types/error-response";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useScheduleInput = (
  isOfficial: boolean,
  setIsOfficial: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const router = useRouter();
  const showToast = useToastStore((state) => state.showToast);

  const initValue: Partial<IScheduleInput> = useMemo(
    () => ({
      streamerName: "",
      category: undefined,
      title: "",
      member: [],
      fullDay: false,
      startAtDate: setDateAndTime().date,
      startAtTime: setDateAndTime().time,
      endAtDate: setDateAndTime().date,
      endAtTime: setDateAndTime().time,
      contents: "",
    }),
    []
  );

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
  const resetInputValue = () => {
    reset();
    clearErrors();
    setMember([]);
  };

  // Reset input value when change isOfficial
  useEffect(() => {
    resetInputValue();
  }, [isOfficial]);

  const category = watch("category");
  const fullDay = watch("fullDay");
  const startAtDate = watch("startAtDate");
  const startAtTime = watch("startAtTime");
  const endAtDate = watch("endAtDate");
  const endAtTime = watch("endAtTime");

  // Set value(member) when change category
  // Check fullDay event
  // Check time up & down
  useEffect(() => {
    if (category === "personal" || category === "watch") {
      setValue("memberInput", "");
      setMember([]);
    }

    if (fullDay) {
      setValue("endAtDate", startAtDate, { shouldValidate: true });
      setValue("startAtTime", "00:00", { shouldValidate: true });
      setValue("endAtTime", "23:59", { shouldValidate: true });
    }

    if (startAtDate === endAtDate && startAtTime > endAtTime) {
      setValue("startAtTime", endAtTime);
      setValue("endAtTime", startAtTime);
    } else if (startAtDate > endAtDate) {
      setValue("startAtDate", endAtDate);
      setValue("endAtDate", startAtDate);
    }
  }, [category, fullDay, startAtDate, startAtTime, endAtDate, endAtTime]);

  // When streamerName input has error, focus input
  useEffect(() => {
    if (errors.streamerName) {
      setTimeout(() => {
        setFocus("streamerName");
      });
    }
  }, [errors.streamerName, setFocus]);

  // Add member button event
  const onAddMember = () => {
    const name = watch("memberInput");
    if (!name) return;

    if (!member.includes(name)) {
      setMember((prev) => [...prev, name]);
    }

    setValue("memberInput", "");
  };

  // Remove member button event
  const onRemoveMember = (name: string) => {
    setMember((prev) => prev.filter((item) => item !== name));
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
    resetInputValue();
    setIsOfficial(false);
  };

  const queryClient = useQueryClient();

  const createScheduleMutation = useMutation({
    mutationFn: (data: Partial<ISchedule>) => createSchedule(data),
    onSuccess: (schedule) => {
      showToast("success", `일정을 추가했습니다.`);
      queryClient.invalidateQueries({ queryKey: ["getScheduleListByDate"] });
      router.back();
    },
    onError: (error: IApiError) => {
      if (error.status === 409) {
        // 중복 시간대 스케줄
        showToast("error", "같은 시간대에 스케줄이 존재합니다.");
      } else if (error.status === 400) {
        // 클라이언트 요청 문제
        showToast("error", "입력값을 다시 확인해주세요.");
      } else {
        // 알 수 없는 에러
        showToast("error", "알 수 없는 오류가 발생했습니다.");
      }
    },
  });

  // Submit event
  const onSubmit = handleSubmit((data) => {
    const inputData: IScheduleInput = {
      ...data,
      isOfficial,
      member,
    };

    const startAt = `${inputData.startAtDate} ${inputData.startAtTime}`;
    const endAt = `${inputData.endAtDate} ${inputData.endAtTime}`;
    const streamerName = getStreamerNameByCategory(
      inputData.category,
      inputData.streamerName
    );

    const createData: Partial<ISchedule> = {
      isOfficial: inputData.isOfficial,
      streamerName: streamerName,
      category: inputData.category,
      title: inputData.title,
      member: inputData.member,
      startAt: dateTypeToDate(startAt),
      endAt: dateTypeToDate(endAt),
      contents: inputData.contents,
    };

    if (!createData.member || createData.member?.length === 0)
      delete createData.member;
    if (!createData.contents) delete createData.contents;

    createScheduleMutation.mutate(createData);
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

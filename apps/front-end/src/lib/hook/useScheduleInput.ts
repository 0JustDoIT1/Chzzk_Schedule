import { useCallback, useEffect, useMemo, useState } from "react";
import useReactHookForm from "./useReactHookForm";
import { useToastStore } from "@/lib/providers/toast-provider";
import { useRouter } from "next/navigation";
import { submitSchedule, updateSchedule } from "@/api/schedule-api";
import { IApiError } from "../types/error-response";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { route } from "../constants/router";
import { adjustScheduleTimes } from "../utils/chzzk-date";
import { getScheduleInitValue } from "../utils/chzzk-input";
import { useMember } from "./useMember";
import { handleScheduleApiError } from "../utils/error-handler";
import {
  invalidateOfficialScheduleListByMonth,
  invalidateScheduleById,
  invalidateScheduleLinkById,
  invalidateScheduleListByDate,
  invalidateScheduleListByMonth,
  invalidateScheduleListByMonthWithId,
} from "../utils/react-query-utils";
import { IScheduleInput, TScheduleSchema } from "@shared/types";
import { getStreamerNameByCategory } from "../utils/chzzk-utils";
import { AllCategory } from "@shared/constants";

const useScheduleInput = (
  isOfficial: boolean,
  setIsOfficial: React.Dispatch<React.SetStateAction<boolean>>,
  initData?: TScheduleSchema // optional 초기값
) => {
  const router = useRouter();
  const [sourceUrl, setSourceUrl] = useState("");
  const showToast = useToastStore((state) => state.showToast);

  const initValue: IScheduleInput = useMemo(
    () => getScheduleInitValue(initData),
    [initData]
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

  const category = watch("category");
  const fullDay = watch("fullDay");
  const startTimeKnown = watch("startTimeKnown");
  const endTimeKnown = watch("endTimeKnown");
  const startAtDate = watch("startAtDate");
  const startAtTime = watch("startAtTime");
  const endAtDate = watch("endAtDate");
  const endAtTime = watch("endAtTime");
  const streamerName = watch("streamerName");

  const { member, setMember, addMember, removeMember, resetMember } = useMember(
    initData?.member ?? [],
    showToast,
    streamerName
  );

  // Reset input value
  const resetInputValue = useCallback(() => {
    reset(initValue);
    clearErrors();
    resetMember();
    setIsOfficial(initValue.isOfficial ?? false);
  }, [reset, clearErrors, resetMember, setIsOfficial, initValue]);

  // initData가 존재할 경우 form에 반영
  useEffect(() => {
    resetInputValue();
  }, [initValue]);

  // // Reset input value when change isOfficial
  // useEffect(() => {
  //   if (!initData) resetInputValue();
  // }, [isOfficial]);

  // Set value(member) when change category
  // Check fullDay event
  // Check time up & down
  useEffect(() => {
    if (category === "personal" || category === "watch") {
      setValue("memberInput", "");
      setMember([]);
    }
    adjustScheduleTimes({
      startAtDate,
      startAtTime,
      endAtDate,
      endAtTime,
      fullDay,
      startTimeKnown,
      endTimeKnown,
      setValue,
    });
  }, [
    category,
    fullDay,
    startTimeKnown,
    endTimeKnown,
    startAtDate,
    startAtTime,
    endAtDate,
    endAtTime,
    setValue,
    setMember,
  ]);

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
    if (!name || member.includes(name)) return;

    addMember(name);
    setValue("memberInput", "");
  };

  // Remove member button event
  const onRemoveMember = (name: string) => {
    removeMember(name);
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
  };

  const queryClient = useQueryClient();

  // create schedule
  const createScheduleMutation = useMutation({
    mutationFn: async (data: Partial<TScheduleSchema>) =>
      await submitSchedule(data, sourceUrl),
    onSuccess: (receipt) => {
      showToast("success", "제보가 접수되었습니다. 검수 후 게시됩니다.");
      router.push(`/submissions/${receipt.id}`);
    },
    onError: (error: IApiError) => handleScheduleApiError(error, showToast),
  });

  // update schedule
  const updateScheduleMutation = useMutation({
    mutationFn: async (data: {
      id: string;
      payload: Partial<TScheduleSchema>;
    }) => await updateSchedule(data.id, data.payload),
    onSuccess: (schedule) => {
      invalidateScheduleListByDate(queryClient, schedule.startAt);
      invalidateScheduleListByMonth(queryClient, schedule.startAt);
      invalidateScheduleListByMonthWithId(
        queryClient,
        schedule.startAt,
        schedule.streamerId
      );
      invalidateScheduleById(queryClient, schedule._id);
      invalidateScheduleLinkById(queryClient, schedule._id);
      if (schedule.isOfficial)
        invalidateOfficialScheduleListByMonth(queryClient, schedule.startAt);
      showToast("success", `일정을 수정했습니다.`);
      router.push(route.allCalendar);
    },
    onError: (error: IApiError) => handleScheduleApiError(error, showToast),
  });

  // submit data 처리
  const prepareScheduleData = (inputData: IScheduleInput) => {
    const startAt = `${inputData.startAtDate} ${inputData.startTimeKnown === false ? "00:00" : inputData.startAtTime}`;
    const endAt = inputData.endTimeKnown === false ? startAt : `${inputData.endAtDate} ${inputData.endAtTime}`;
    const streamerName = getStreamerNameByCategory(
      inputData.category as AllCategory,
      inputData.streamerName
    );

    const data: Partial<TScheduleSchema> = {
      isOfficial: inputData.isOfficial,
      streamerName: streamerName,
      category: inputData.category as AllCategory,
      title: inputData.title,
      member: inputData.member,
      fullDay: inputData.fullDay,
      status: initData?.status ?? "scheduled",
      startTimeKnown: inputData.fullDay ? true : inputData.startTimeKnown !== false,
      endTimeKnown: inputData.fullDay ? true : inputData.endTimeKnown !== false,
      startAt: new Date(`${startAt.replace(" ", "T")}:00+09:00`),
      endAt: new Date(`${endAt.replace(" ", "T")}:00+09:00`),
      contents: inputData.contents,
    };

    if (!data.member || data.member?.length === 0) delete data.member;
    if (!data.contents) delete data.contents;

    return data;
  };

  // Submit event
  const onSubmit = handleSubmit((data) => {
    if (!initData && !sourceUrl) {
      showToast("error", "출처 링크를 입력해 주세요.");
      return;
    }
    const inputData: IScheduleInput = {
      ...data,
      isOfficial,
      member,
    };

    const createData = prepareScheduleData(inputData);

    if (initData) {
      updateScheduleMutation.mutate({
        id: initData._id,
        payload: createData,
      });
    } else {
      createScheduleMutation.mutate(createData);
    }
  });

  return {
    register,
    control,
    errors,
    watch,
    handleSubmit: onSubmit,
    handleReset: onReset,
    initValue,
    member,
    setMember,
    onAddMember,
    onRemoveMember,
    onFocusTiptapLabel,
    sourceUrl,
    setSourceUrl,
  };
};

export default useScheduleInput;

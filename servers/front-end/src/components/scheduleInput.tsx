import { category, chzzkCategory } from "@/constants/streaming";
import TiptapEditor from "./tiptapEditor";
import { BrandButton } from "./button";
import { Controller } from "react-hook-form";
import SearchableDropdown from "./searchableDropdown";
import React from "react";
import useScheduleInput from "@/hook/useScheduleInput";
import CloseIcon from "~/public/assets/svg/close";
import CheckIcon from "~/public/assets/svg/check";
import HelperText from "./helperText";
import { useRouter } from "next/navigation";

interface ScheduleInput {
  isOfficial: boolean;
  setIsOfficial: React.Dispatch<React.SetStateAction<boolean>>;
}

const ScheduleInput = ({ isOfficial, setIsOfficial }: ScheduleInput) => {
  const router = useRouter();

  const {
    register,
    control,
    errors,
    watch,
    onSubmit,
    onReset,
    initValue,
    member,
    onAddMember,
    onRemoveMember,
    onFocusTiptapLabel,
    ringStyle,
  } = useScheduleInput(isOfficial, setIsOfficial);

  console.log("###", errors);

  return (
    <form
      className="container mx-auto px-4 py-4 md:px-8 lg:max-w-2xl"
      onSubmit={onSubmit}
    >
      {!isOfficial && (
        <div className="flex flex-col mb-4">
          <label htmlFor="streamer" className="text-sm text-textMain mb-2">
            <span className="text-brandMain">&#42;</span> 스트리머
          </label>
          <Controller
            control={control}
            name="streamer"
            rules={{
              required: { value: true, message: "스트리머를 선택해 주세요." },
            }}
            render={({ field: { ref, value, onChange } }) => (
              <SearchableDropdown
                list={[
                  { _id: 1, streamer: "hi" },
                  { _id: 2, streamer: "testㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇ" },
                  { _id: 3, streamer: "hi2" },
                  { _id: 4, streamer: "test2" },
                  { _id: 5, streamer: "hi3" },
                  { _id: 6, streamer: "test3" },
                  { _id: 7, streamer: "hi4" },
                  { _id: 8, streamer: "test4" },
                  { _id: 9, streamer: "hi5" },
                  { _id: 10, streamer: "test5" },
                  { _id: 11, streamer: "hi6" },
                  { _id: 12, streamer: "test6" },
                  { _id: 13, streamer: "hi7" },
                  { _id: 14, streamer: "test7" },
                  { _id: 15, streamer: "hi8" },
                  { _id: 16, streamer: "test8" },
                  { _id: 17, streamer: "hi9" },
                  { _id: 18, streamer: "test9" },
                  { _id: 19, streamer: "hi10" },
                  { _id: 20, streamer: "test10" },
                  { _id: 21, streamer: "hi11" },
                  { _id: 22, streamer: "test11" },
                  { _id: 23, streamer: "hi12" },
                  { _id: 24, streamer: "test12" },
                ]}
                keyName="streamer"
                placeholder="스트리머를 선택해 주세요."
                ref={ref}
                value={value}
                onChange={onChange}
                ringStyle={ringStyle("streamer")}
              />
            )}
          />
          {errors.streamer && (
            <HelperText className="text-error">
              {errors.streamer?.message as string}
            </HelperText>
          )}
        </div>
      )}
      <div className="flex flex-col mb-4">
        <label htmlFor="category" className="text-sm text-textMain mb-2">
          <span className="text-brandMain">&#42;</span> 방송 종류
        </label>
        <select
          {...register("category", {
            value: initValue.category,
            required: {
              value: true,
              message: "방송 종류를 선택해 주세요.",
            },
          })}
          id="category"
          className={`w-full rounded-md bg-white p-2 text-sm text-textMain box-border ring-1 shadow-xs outline-none hover:bg-textHover ${ringStyle(
            "category"
          )}`}
        >
          <option style={{ color: "gray" }} value="">
            방송 종류를 선택해 주세요.
          </option>
          {isOfficial
            ? chzzkCategory.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))
            : category.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
        </select>
        {errors.category && (
          <HelperText className="text-error">
            {errors.category?.message as string}
          </HelperText>
        )}
      </div>

      {isOfficial && watch("category") && watch("category") !== "watch" && (
        <div className="flex flex-col mb-4">
          <label htmlFor="member" className="text-sm text-textMain mb-2">
            멤버 &#40;진행 및 게스트&#41;
          </label>
          <div className="flex justify-between items-center">
            <input
              {...register("member", {
                value: initValue.member,
              })}
              id="member"
              className="w-[calc(100%-72px)] rounded-md bg-white p-2 text-sm text-textMain box-border ring-1 shadow-xs outline-none ring-textLight focus:ring-brandMain hover:bg-textHover"
              type="text"
              placeholder="합방 멤버를 추가해 주세요."
            />
            <BrandButton classes="w-16" onClick={onAddMember}>
              추가
            </BrandButton>
          </div>
          <div className="flex flex-wrap gap-1 items-center w-full mt-2">
            {member &&
              member.map((name: string) => (
                <div
                  key={name}
                  className="flex items-center justify-between rounded-md border border-brandMain bg-brandMain text-xs text-white py-1 pl-2 pr-1"
                >
                  {name}
                  <span
                    className="cursor-pointer"
                    onClick={() => {
                      onRemoveMember(name);
                    }}
                  >
                    <CloseIcon className="w-4 h-4 ml-2 text-white" />
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
      {!isOfficial && watch("category") && watch("category") !== "personal" && (
        <div className="flex flex-col mb-4">
          <label htmlFor="member" className="text-sm text-textMain mb-2">
            합방 멤버
          </label>
          <div className="flex justify-between items-center">
            <input
              {...register("member", {
                value: initValue.member,
              })}
              id="member"
              className="w-[calc(100%-72px)] rounded-md bg-white p-2 text-sm text-textMain box-border ring-1 shadow-xs outline-none ring-textLight focus:ring-brandMain hover:bg-textHover"
              type="text"
              placeholder="합방 멤버를 추가해 주세요."
            />
            <BrandButton classes="w-16" onClick={onAddMember}>
              추가
            </BrandButton>
          </div>
          <div className="flex flex-wrap gap-1 items-center w-full mt-2">
            {member &&
              member.map((name: string) => (
                <div
                  key={name}
                  className="flex items-center justify-between rounded-md border border-brandMain bg-brandMain text-xs text-white py-1 pl-2 pr-1"
                >
                  {name}
                  <span
                    className="cursor-pointer"
                    onClick={() => {
                      onRemoveMember(name);
                    }}
                  >
                    <CloseIcon className="w-4 h-4 ml-2 text-white" />
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
      <div className="flex flex-col mb-4">
        <label htmlFor="title" className="text-sm text-textMain mb-2">
          <span className="text-brandMain">&#42;</span> 일정 제목
        </label>
        <input
          {...register("title", {
            value: initValue.title,
            required: { value: true, message: "일정 제목을 입력해 주세요." },
          })}
          id="title"
          className={`w-full rounded-md bg-white p-2 text-sm text-textMain box-border ring-1 shadow-xs outline-none hover:bg-textHover ${ringStyle(
            "title"
          )}`}
          type="text"
          placeholder="제목을 입력해 주세요."
        />
        {errors.title && (
          <HelperText className="text-error">
            {errors.title?.message as string}
          </HelperText>
        )}
      </div>
      <div className="flex flex-col mb-4">
        <label htmlFor="startAtDate" className="text-sm text-textMain mb-2">
          <span className="text-brandMain">&#42;</span> 시작 일시
        </label>
        <div className="flex gap-2 items-center mb-2">
          <label className="flex items-center cursor-pointer relative">
            <input
              {...register("fullDay", {
                value: initValue.fullDay,
              })}
              id="fullDay"
              className="peer h-4 w-4 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-brandMain checked:border-brandMain focus:ring-2 focus:ring-brandLight"
              type="checkbox"
            />
            <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <CheckIcon className="w-4 h-4" />
            </span>
          </label>
          <label
            htmlFor="fullDay"
            className="inline-block text-sm text-textMain mt-[2px]"
          >
            종일
          </label>
        </div>
        <div className="flex gap-2">
          <input
            {...register("startAtDate", {
              value: initValue.startAtDate,
              required: { value: true, message: "시작 일시를 입력해 주세요." },
            })}
            id="startAtDate"
            className={`w-1/2 rounded-md bg-white p-2 text-sm text-textMain box-border ring-1 shadow-xs ring-textLight outline-none hover:bg-textHover ${ringStyle(
              "startAtDate"
            )}`}
            type="date"
            onKeyDown={(e) => e.preventDefault()}
          />
          <input
            {...register("startAtTime", {
              value: initValue.startAtTime,
              required: { value: true, message: "시작 일시를 입력해 주세요." },
            })}
            id="startAtTime"
            className={`w-1/2 rounded-md bg-white p-2 text-sm text-textMain box-border ring-1 shadow-xs outline-none hover:bg-textHover ${ringStyle(
              "startAtTime"
            )} disabled:ring-textIcon disabled:bg-textSuperLight disabled:text-textIcon`}
            type="time"
            onKeyDown={(e) => e.preventDefault()}
            disabled={watch("fullDay")}
          />
        </div>
        {(errors.startAtDate || errors.startAtTime) && (
          <HelperText className="text-error">
            {(errors.startAtDate?.message as string) ||
              (errors.startAtTime?.message as string)}
          </HelperText>
        )}
      </div>
      <div className="flex flex-col mb-4">
        <label htmlFor="endAtDate" className="text-sm text-textMain mb-2">
          <span className="text-brandMain">&#42;</span> 종료 일시
        </label>
        <div className="flex gap-2">
          <input
            {...register("endAtDate", {
              value: initValue.endAtDate,
              required: { value: true, message: "종료 일시를 입력해 주세요." },
            })}
            id="endAtDate"
            className={`w-1/2 rounded-md bg-white p-2 text-sm text-textMain box-border ring-1 shadow-xs outline-none hover:bg-textHover ${ringStyle(
              "endAtDate"
            )} disabled:ring-textIcon disabled:bg-textSuperLight disabled:text-textIcon`}
            type="date"
            onKeyDown={(e) => e.preventDefault()}
            disabled={watch("fullDay")}
          />
          <input
            {...register("endAtTime", {
              value: initValue.endAtTime,
              required: { value: true, message: "종료 일시를 입력해 주세요." },
            })}
            id="endAtTime"
            className={`w-1/2 rounded-md bg-white p-2 text-sm text-textMain box-border ring-1 shadow-xs outline-none hover:bg-textHover ${ringStyle(
              "endAtTime"
            )} disabled:ring-textIcon disabled:bg-textSuperLight disabled:text-textIcon`}
            type="time"
            onKeyDown={(e) => e.preventDefault()}
            disabled={watch("fullDay")}
          />
        </div>
        {(errors.endAtDate || errors.endAtTime) && (
          <HelperText className="text-error">
            {(errors.endAtDate?.message as string) ||
              (errors.endAtTime?.message as string)}
          </HelperText>
        )}
      </div>
      <div className="flex flex-col mb-4">
        <label
          htmlFor="contents"
          className="text-sm text-textMain mb-2"
          onClick={onFocusTiptapLabel}
        >
          일정 내용
        </label>
        <Controller
          control={control}
          name="contents"
          render={({ field: { value, onChange } }) => (
            <TiptapEditor text={value} setText={onChange} />
          )}
        />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <BrandButton
          type="button"
          classes="w-auto min-w-20"
          onClick={() => onReset()}
        >
          초기화
        </BrandButton>
        <div className="flex flex-wrap items-center justify-end gap-2">
          <BrandButton
            type="button"
            classes="w-auto min-w-20"
            onClick={() => router.back()}
          >
            취소
          </BrandButton>
          <BrandButton type="submit" color="green" classes="w-auto min-w-20">
            저장
          </BrandButton>
        </div>
      </div>
    </form>
  );
};

export default ScheduleInput;

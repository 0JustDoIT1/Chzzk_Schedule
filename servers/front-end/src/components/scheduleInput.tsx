import {
  baseCategoryOpt,
  chzzkCategoryOpt,
} from "@/lib/constants/streamingCategory";
import TiptapEditor from "./tiptapEditor";
import { Controller } from "react-hook-form";
import SearchableDropdown from "./searchableDropdown";
import React from "react";
import useScheduleInput from "@/lib/hook/useScheduleInput";
import CheckIcon from "~/public/assets/svg/check";
import HelperText from "./helperText";
import { useRouter } from "next/navigation";
import { BrandButton } from "./button";
import { preventEnterKey } from "@/lib/utils/keyEvent";
import { IStreamer } from "@/schemas/streamer.schema";
import { goBackRoute, route } from "@/lib/constants/router";
import { useAsPathStore } from "@/lib/providers/asPath-provider";
import { TScheduleSchema } from "@/schemas/schedule.schema";
import MemberList from "./memberList";

interface IScheduleInput {
  streamerList: IStreamer[];
  isOfficial: boolean;
  setIsOfficial: React.Dispatch<React.SetStateAction<boolean>>;
  initData?: TScheduleSchema;
}

const ScheduleInput = ({
  streamerList,
  isOfficial,
  setIsOfficial,
  initData,
}: IScheduleInput) => {
  const router = useRouter();
  const previousAsPath = useAsPathStore((state) => state.previousAsPath);

  const {
    register,
    control,
    errors,
    watch,
    onSubmit,
    onReset,
    member,
    onAddMember,
    onRemoveMember,
    onFocusTiptapLabel,
  } = useScheduleInput(isOfficial, setIsOfficial, initData);

  const category = watch("category");
  const fullDay = watch("fullDay");

  return (
    <form
      className="container mx-auto px-4 py-4 md:px-8 lg:max-w-2xl"
      onSubmit={onSubmit}
      onKeyDown={preventEnterKey}
    >
      <div>
        {!isOfficial && (
          <div className="flex flex-col mb-4">
            <label
              htmlFor="streamerName"
              className="text-sm text-textMain mb-2"
            >
              <span className="text-brandMain">&#42;</span> 스트리머
            </label>
            {streamerList.length === 0 ? (
              <div className="relative cursor-default">
                <p className="w-full rounded-md bg-white p-2 text-sm text-textNormal box-border ring-1 shadow-xs outline-none ring-error">
                  추가된 스트리머가 없습니다. 스트리머를 먼저 등록해 주세요.
                </p>
              </div>
            ) : (
              <>
                <Controller
                  control={control}
                  name="streamerName"
                  rules={{
                    required: {
                      value: true,
                      message: "스트리머를 선택해 주세요.",
                    },
                  }}
                  render={({ field: { ref, value, onChange } }) => (
                    <SearchableDropdown
                      list={streamerList}
                      keyName="name"
                      placeholder="스트리머를 선택해 주세요."
                      ref={ref}
                      value={value}
                      onChange={onChange}
                      errors={errors["name"] ? true : false}
                    />
                  )}
                />
                {errors.streamerName && (
                  <HelperText className="text-error">
                    {errors.streamerName?.message as string}
                  </HelperText>
                )}
              </>
            )}
          </div>
        )}
        <div className="flex flex-col mb-4">
          <label htmlFor="category" className="text-sm text-textMain mb-2">
            <span className="text-brandMain">&#42;</span> 방송 종류
          </label>
          <select
            {...register("category", {
              required: {
                value: true,
                message: "방송 종류를 선택해 주세요.",
              },
            })}
            id="category"
            className={`w-full rounded-md bg-white p-2 text-sm text-textMain box-border ring-1 shadow-xs outline-none hover:bg-textHover ${
              errors["category"]
                ? "ring-error focus:ring-2 focus:ring-error"
                : "ring-textLight focus:ring-brandMain"
            }`}
          >
            <option style={{ color: "gray" }} value="">
              방송 종류를 선택해 주세요.
            </option>
            {isOfficial
              ? chzzkCategoryOpt.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))
              : baseCategoryOpt.map((item) => (
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

        {isOfficial && category && category !== "watch" && (
          <div className="flex flex-col mb-4">
            <label htmlFor="memberInput" className="text-sm text-textMain mb-2">
              멤버 &#40;진행 및 게스트&#41;
            </label>
            <div className="flex justify-between items-center">
              <input
                {...register("memberInput")}
                id="memberInput"
                className="w-[calc(100%-72px)] rounded-md bg-white p-2 text-sm text-textMain box-border ring-1 shadow-xs outline-none ring-textLight focus:ring-brandMain hover:bg-textHover"
                type="text"
                placeholder="합방 멤버를 추가해 주세요."
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    onAddMember();
                  }
                }}
              />
              <BrandButton className="w-16" onClick={onAddMember}>
                추가
              </BrandButton>
            </div>
            <MemberList member={member} onRemove={onRemoveMember} />
          </div>
        )}
        {!isOfficial && category && category !== "personal" && (
          <div className="flex flex-col mb-4">
            <label htmlFor="memberInput" className="text-sm text-textMain mb-2">
              합방 멤버
            </label>
            <div className="flex justify-between items-center">
              <input
                {...register("memberInput")}
                id="memberInput"
                className="w-[calc(100%-72px)] rounded-md bg-white p-2 text-sm text-textMain box-border ring-1 shadow-xs outline-none ring-textLight focus:ring-brandMain hover:bg-textHover"
                type="text"
                placeholder="합방 멤버를 추가해 주세요."
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    onAddMember();
                  }
                }}
              />
              <BrandButton className="w-16" onClick={onAddMember}>
                추가
              </BrandButton>
            </div>
            <MemberList member={member} onRemove={onRemoveMember} />
          </div>
        )}
        <div className="flex flex-col mb-4">
          <label htmlFor="title" className="text-sm text-textMain mb-2">
            <span className="text-brandMain">&#42;</span> 일정 제목
          </label>
          <input
            {...register("title", {
              required: { value: true, message: "일정 제목을 입력해 주세요." },
            })}
            id="title"
            className={`w-full rounded-md bg-white p-2 text-sm text-textMain box-border ring-1 shadow-xs outline-none hover:bg-textHover ${
              errors["title"]
                ? "ring-error focus:ring-2 focus:ring-error"
                : "ring-textLight focus:ring-brandMain"
            }`}
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
                type="checkbox"
                {...register("fullDay")}
                id="fullDay"
                className="peer h-4 w-4 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-brandMain checked:border-brandMain focus:ring-2 focus:ring-brandLight"
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
                required: {
                  value: true,
                  message: "시작 일시를 입력해 주세요.",
                },
              })}
              id="startAtDate"
              className={`w-1/2 rounded-md bg-white p-2 text-sm text-textMain box-border ring-1 shadow-xs ring-textLight outline-none hover:bg-textHover ${
                errors["startAtDate"]
                  ? "ring-error focus:ring-2 focus:ring-error"
                  : "ring-textLight focus:ring-brandMain"
              }`}
              type="date"
              onKeyDown={(e) => e.preventDefault()}
            />
            <input
              {...register("startAtTime", {
                required: {
                  value: true,
                  message: "시작 일시를 입력해 주세요.",
                },
              })}
              id="startAtTime"
              className={`w-1/2 rounded-md bg-white p-2 text-sm text-textMain box-border ring-1 shadow-xs outline-none hover:bg-textHover ${
                errors["startAtTime"]
                  ? "ring-error focus:ring-2 focus:ring-error"
                  : "ring-textLight focus:ring-brandMain"
              } disabled:ring-textIcon disabled:bg-textSuperLight disabled:text-textIcon`}
              type="time"
              onKeyDown={(e) => e.preventDefault()}
              disabled={fullDay}
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
                required: {
                  value: true,
                  message: "종료 일시를 입력해 주세요.",
                },
              })}
              id="endAtDate"
              className={`w-1/2 rounded-md bg-white p-2 text-sm text-textMain box-border ring-1 shadow-xs outline-none hover:bg-textHover ${
                errors["endAtDate"]
                  ? "ring-error focus:ring-2 focus:ring-error"
                  : "ring-textLight focus:ring-brandMain"
              } disabled:ring-textIcon disabled:bg-textSuperLight disabled:text-textIcon`}
              type="date"
              onKeyDown={(e) => e.preventDefault()}
              disabled={fullDay}
            />
            <input
              {...register("endAtTime", {
                required: {
                  value: true,
                  message: "종료 일시를 입력해 주세요.",
                },
              })}
              id="endAtTime"
              className={`w-1/2 rounded-md bg-white p-2 text-sm text-textMain box-border ring-1 shadow-xs outline-none hover:bg-textHover ${
                errors["endAtTime"]
                  ? "ring-error focus:ring-2 focus:ring-error"
                  : "ring-textLight focus:ring-brandMain"
              } disabled:ring-textIcon disabled:bg-textSuperLight disabled:text-textIcon`}
              type="time"
              onKeyDown={(e) => e.preventDefault()}
              disabled={fullDay}
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
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 mt-8">
        <BrandButton
          type="button"
          className="w-auto min-w-20"
          onClick={() => onReset()}
        >
          초기화
        </BrandButton>
        <div className="flex flex-wrap items-center justify-end gap-2">
          <BrandButton
            type="button"
            className="w-auto min-w-20"
            onClick={() =>
              goBackRoute(router, previousAsPath, route.allCalendar)
            }
          >
            취소
          </BrandButton>
          <BrandButton type="submit" color="green" className="w-auto min-w-20">
            저장
          </BrandButton>
        </div>
      </div>
    </form>
  );
};

export default ScheduleInput;

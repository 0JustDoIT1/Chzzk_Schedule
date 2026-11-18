"use client";

import React, { useState, KeyboardEvent } from "react";
import useReactHookForm from "@/lib/hook/useReactHookForm";
import { useRouter } from "next/navigation";
import CloseIcon from "~/public/assets/svg/close";
import HelperText from "@/lib/components/common/helperText";
import { BrandButton } from "@/lib/components/common/button";
import { useToastStore } from "@/lib/providers/toast-provider";
import { useAsPathStore } from "@/lib/providers/asPath-provider";
import { preventEnterKey } from "@/lib/utils/keyEvent";
import { submitStreamer } from "@/api/streamer-api";
import { IApiError } from "@/lib/types/error-response";
import { useMutation } from "@tanstack/react-query";
import { goBackRoute, route } from "@/lib/constants/router";
import { IStreamer } from "@shared/types";

const StreamerAddView = () => {
  const router = useRouter();
  const showToast = useToastStore((state) => state.showToast);
  const previousAsPath = useAsPathStore((state) => state.previousAsPath);


  const createStreamerMutation = useMutation({
    mutationFn: async (streamer: IStreamer) => await submitStreamer(streamer),
    onSuccess: (receipt) => {
      showToast("success", "제보가 접수되었습니다. 검수 후 게시됩니다.");
      router.push(`/submissions/${receipt.id}`);
    },
    onError: (error: IApiError) => {
      if (error.status === 409) {
        showToast("error", "같은 채널의 제보가 검수 대기 중입니다.");
      } else if (error.status === 429) {
        showToast("error", "제보 요청이 많습니다. 잠시 후 다시 시도해 주세요.");
      } else if (error.status === 400) {
        showToast("error", "입력값이 올바르지 않습니다.");
      } else {
        showToast("error", "알 수 없는 오류가 발생했습니다.");
      }
    },
  });

  const initValue: { name: string; chzzkLink: string; tag: string } = {
    name: "",
    chzzkLink: "",
    tag: "",
  };

  const {
    register,
    setValue,
    watch,
    reset,
    errors,
    clearErrors,
    handleSubmit,
  } = useReactHookForm(initValue);

  const [tag, setTag] = useState<string[]>([]);

  const onKeyDownAddTag = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onAddTag();
    }
  };

  const onAddTag = () => {
    const value = watch("tag");
    if (value) {
      if (tag.includes(value)) setValue("tag", "");
      else {
        setTag([...tag, value]);
        setValue("tag", "");
      }
    }
  };

  const onRemoveTag = (value: string) => {
    setTag(tag.filter((item: string) => item !== value));
  };

  const onReset = () => {
    reset();
    clearErrors();
    setTag([]);
  };

  const onSubmit = handleSubmit((data) => {
    const result: IStreamer = {
      ...data,
      tag,
      isOfficial: false,
    };
    if (tag.length === 0) delete result.tag;

    createStreamerMutation.mutate(result);
  });

  return (
    <>
      <section className="border-b border-gray-100 bg-white py-8">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h1 className="mb-2 text-3xl font-bold text-textMain">스트리머 제보</h1>
          <p className="text-sm leading-relaxed text-textNormal">치지직 채널 주소를 알려주세요. 확인 후 목록에 반영합니다.</p>
        </div>
      </section>
      <main className="min-h-[calc(100vh-180px)] bg-[#f7faf8] px-4 py-8 sm:px-6">
        <form
          className="mx-auto flex max-w-4xl flex-col justify-between rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8"
          onSubmit={onSubmit}
          onKeyDown={preventEnterKey}
        >
          <div>
            <div className="flex flex-col mb-4">
              <label htmlFor="name" className="text-sm text-textMain mb-2">
                <span className="text-brandMain">&#42;</span> 닉네임
              </label>
              <input
                {...register("name", {
                  value: initValue.name,
                  required: { value: true, message: "닉네임을 입력해 주세요." },
                })}
                id="name"
                className={`w-full rounded-md bg-white p-2 text-sm text-textMain box-border ring-1 shadow-xs outline-none hover:bg-textHover ${
                  errors["name"]
                    ? "ring-error focus:ring-2 focus:ring-error"
                    : "ring-textLight focus:ring-brandMain"
                }`}
                type="text"
                placeholder="닉네임을 입력해 주세요."
              />
              {errors.name && (
                <HelperText className="text-error">
                  {errors.name?.message as string}
                </HelperText>
              )}
            </div>
            <div className="flex flex-col mb-4">
              <label htmlFor="chzzkLink" className="text-sm text-textMain mb-2">
                <span className="text-brandMain">&#42;</span> 치지직 채널 주소
              </label>
              <input
                {...register("chzzkLink", {
                  value: initValue.chzzkLink,
                  required: {
                    value: true,
                    message: "치지직 채널 주소를 입력해 주세요.",
                  },
                })}
                id="chzzkLink"
                className={`w-full rounded-md bg-white p-2 text-sm text-textMain box-border ring-1 shadow-xs outline-none hover:bg-textHover ${
                  errors["chzzkLink"]
                    ? "ring-error focus:ring-2 focus:ring-error"
                    : "ring-textLight focus:ring-brandMain"
                }`}
                type="url"
                pattern="https://chzzk\.naver\.com/[a-fA-F0-9]{32}/?"
                placeholder="https://chzzk.naver.com/채널ID"
              />
              <p className="mt-1 text-xs text-textNormal">방송 영상 주소가 아닌 스트리머의 채널 페이지 주소를 입력해 주세요.</p>
              {errors.chzzkLink && (
                <HelperText className="text-error">
                  {errors.chzzkLink?.message as string}
                </HelperText>
              )}
            </div>
            <div className="flex flex-col mb-4">
              <label htmlFor="tag" className="text-sm text-textMain mb-2">
                태그 &#40;MCN이나 소속&#41;
              </label>
              <div className="flex justify-between items-center">
                <input
                  {...register("tag", {
                    value: initValue.tag,
                  })}
                  id="tag"
                  className="w-[calc(100%-72px)] rounded-md bg-white p-2 text-sm text-textMain box-border ring-1 shadow-xs outline-none ring-textLight focus:ring-brandMain hover:bg-textHover"
                  type="text"
                  placeholder="태그를 추가해 주세요."
                  onKeyDown={onKeyDownAddTag}
                />
                <BrandButton className="w-16" onClick={onAddTag}>
                  추가
                </BrandButton>
              </div>
              <div className="flex flex-wrap gap-1 items-center w-full mt-2">
                {tag &&
                  tag.map((name: string) => (
                    <div
                      key={name}
                      className="flex items-center justify-between rounded-md border border-brandMain bg-brandMain text-xs text-white py-1 pl-2 pr-1"
                    >
                      {name}
                      <span
                        className="cursor-pointer"
                        onClick={() => {
                          onRemoveTag(name);
                        }}
                      >
                        <CloseIcon className="w-4 h-4 ml-2 text-white" />
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 mt-8">
            <BrandButton
              type="button"
              className="w-auto min-w-20"
              onClick={onReset}
            >
              초기화
            </BrandButton>
            <div className="flex flex-wrap items-center justify-end gap-2">
              <BrandButton
                type="button"
                className="w-auto min-w-20"
                onClick={() => goBackRoute(router, previousAsPath, route.today)}
              >
                취소
              </BrandButton>
              <BrandButton
                type="submit"
                color="green"
                className="w-auto min-w-20"
              >
                저장
              </BrandButton>
            </div>
          </div>
        </form>
      </main>
    </>
  );
};

export default StreamerAddView;

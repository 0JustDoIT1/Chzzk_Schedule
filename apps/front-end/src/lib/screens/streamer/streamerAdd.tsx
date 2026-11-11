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
    mutationFn: async (data: { streamer: IStreamer; sourceUrl: string }) => await submitStreamer(data.streamer, data.sourceUrl),
    onSuccess: (receipt) => {
      showToast("success", "제보가 접수되었습니다. 검수 후 게시됩니다.");
      router.push(`/submissions/${receipt.id}`);
    },
    onError: (error: IApiError) => {
      if (error.status === 409) {
        showToast("error", "이미 등록된 스트리머입니다.");
      } else if (error.status === 400) {
        showToast("error", "입력값이 올바르지 않습니다.");
      } else {
        showToast("error", "알 수 없는 오류가 발생했습니다.");
      }
    },
  });

  const initValue: Partial<IStreamer> = {
    name: "",
    chzzkLink: "",
    tag: [],
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
  const [sourceUrl, setSourceUrl] = useState("");

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
    setTag(initValue.tag!);
  };

  const onSubmit = handleSubmit((data) => {
    const result: IStreamer = {
      ...data,
      tag,
      isOfficial: false,
    };
    if (tag.length === 0) delete result.tag;

    createStreamerMutation.mutate({ streamer: result, sourceUrl });
  });

  return (
    <>
      <section className="w-full border-b border-b-textLight p-4">
        {/* <div className="container mx-auto flex flex-col gap-4 items-center justify-between px-4 md:px-8 md:flex-row lg:max-w-2xl">
          <div className="flex flex-col items-center w-full md:w-2/3 md:items-start">
            <p className="text-2xl">스트리머 추가</p>
            <p className="text-sm text-textNormal">
              원하는 스트리머를 추가 요청해 주세요.
              <br />
              요청을 확인한 후, 문제가 없으면 추가됩니다.
            </p>
          </div>
        </div> */}
        <div className="container mx-auto flex flex-col gap-4 items-center justify-between px-4 md:px-8 md:flex-row lg:max-w-2xl">
          <div className="flex flex-col items-center w-full md:w-2/3 md:items-start">
            <p className="text-2xl">스트리머 추가</p>
            <p className="text-sm text-textNormal">
              원하는 스트리머를 추가 요청해 주세요.
              <br />
              요청을 확인한 후, 문제가 없으면 추가됩니다.
            </p>
          </div>
        </div>
      </section>
      <main className="w-full p-4">
        <form
          className="container flex flex-col justify-between mx-auto px-4 py-4 md:px-8 lg:max-w-2xl"
          onSubmit={onSubmit}
          onKeyDown={preventEnterKey}
        >
          <div>
            <div className="flex flex-col mb-4">
              <label htmlFor="sourceUrl" className="text-sm text-textMain mb-2">출처 링크 *</label>
              <input id="sourceUrl" type="url" required value={sourceUrl} onChange={(event) => setSourceUrl(event.target.value)} className="w-full rounded-md bg-white p-2 text-sm ring-1 ring-textLight" placeholder="https://..." />
            </div>
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
                <span className="text-brandMain">&#42;</span> 방송 링크
              </label>
              <input
                {...register("chzzkLink", {
                  value: initValue.chzzkLink,
                  required: {
                    value: true,
                    message: "치지직 방송 링크를 입력해 주세요.",
                  },
                })}
                id="chzzkLink"
                className={`w-full rounded-md bg-white p-2 text-sm text-textMain box-border ring-1 shadow-xs outline-none hover:bg-textHover ${
                  errors["chzzkLink"]
                    ? "ring-error focus:ring-2 focus:ring-error"
                    : "ring-textLight focus:ring-brandMain"
                }`}
                type="text"
                placeholder="치지직 방송 링크를 입력해 주세요."
              />
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

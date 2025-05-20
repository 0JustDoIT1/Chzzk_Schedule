"use client";

import React, { useState, KeyboardEvent } from "react";
import useReactHookForm from "@/hook/useReactHookForm";
import { useRouter } from "next/navigation";
import CloseIcon from "~/public/assets/svg/close";
import { IStreamer } from "@/schemas/streamer.schema";
import HelperText from "@/components/helperText";
import { BrandButton } from "@/components/button";
import { useToastStore } from "@/providers/toast-provider";
import { createStreamer } from "@/api/streamer-api";
import { useAsPathStore } from "@/providers/asPath-provider";
import { preventEnterKey } from "@/utils/keyEvent";
import { showErrorToast } from "@/utils/errorHandler";

const StreamerAddView = () => {
  const router = useRouter();
  const previousAsPath = useAsPathStore((state) => state.previousAsPath);
  const showToast = useToastStore((state) => state.showToast);

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

  const onKeyDownAddTag = (e: KeyboardEvent<HTMLElement>) => {
    if (e.code === "Enter") {
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

  const onSubmit = handleSubmit(async (data) => {
    try {
      const result: IStreamer = {
        ...data,
        tag,
      };
      if (!tag.length) delete result.tag;
      await createStreamer(result);
      router.push(previousAsPath!);
      showToast("success", `${result.name}을(를) 추가했습니다.`);
    } catch (error) {
      showErrorToast(error, showToast);
    }
  });

  return (
    <React.Fragment>
      <section className="w-full border-b border-b-textLight p-4">
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
                <BrandButton classes="w-16" onClick={onAddTag}>
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
              classes="w-auto min-w-20"
              onClick={onReset}
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
              <BrandButton
                type="submit"
                color="green"
                classes="w-auto min-w-20"
              >
                저장
              </BrandButton>
            </div>
          </div>
        </form>
      </main>
    </React.Fragment>
  );
};

export default StreamerAddView;

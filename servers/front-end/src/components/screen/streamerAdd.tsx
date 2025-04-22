import React from "react";
import HelperText from "../helperText";
import useReactHookForm from "@/hook/useReactHookForm";

const StreamerAdd = () => {
  const initValue: any = {
    name: "",
    chzzkLink: "",
    tag: [],
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
    ringStyle,
  } = useReactHookForm(initValue);

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
          className="container mx-auto px-4 py-4 md:px-8 lg:max-w-2xl"
          // onSubmit={onSubmit}
        >
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
              // className={`w-full rounded-md bg-white p-2 text-sm text-textMain box-border ring-1 shadow-xs outline-none hover:bg-textHover ${ringStyle(
              //   "name"
              // )}`}
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
              <span className="text-brandMain">&#42;</span> 치지직 방송 링크
            </label>
            <input
              {...register("chzzkLink", {
                value: initValue.chzzkLink,
                required: {
                  value: true,
                  message: "일정 제목을 입력해 주세요.",
                },
              })}
              id="name"
              // className={`w-full rounded-md bg-white p-2 text-sm text-textMain box-border ring-1 shadow-xs outline-none hover:bg-textHover ${ringStyle(
              //   "name"
              // )}`}
              type="text"
              placeholder="닉네임을 입력해 주세요."
            />
            {errors.chzzkLink && (
              <HelperText className="text-error">
                {errors.chzzkLink?.message as string}
              </HelperText>
            )}
          </div>
          {/* <div className="flex flex-col mb-4">
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
          </div> */}
        </form>
      </main>
    </React.Fragment>
  );
};

export default StreamerAdd;

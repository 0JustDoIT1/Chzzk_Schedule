"use client";

import { useRouter } from "next/navigation";
import React, { PropsWithChildren, useEffect } from "react";
import CloseIcon from "~/public/assets/svg/close";
import { CustomButton } from "./button";
import { useAsPathStore } from "@/lib/providers/asPath-provider";
import { goBackRoute, route } from "@/lib/constants/router";

const Modal = ({ children }: PropsWithChildren) => {
  const router = useRouter();
  const previousAsPath = useAsPathStore((state) => state.previousAsPath);

  useEffect(() => {
    document.body.classList.add("overflow-y-hidden");

    return () => {
      document.body.classList.remove("overflow-y-hidden");
    };
  }, []);

  return (
    <>
      <div className="fixed inset-0 w-screen h-screen bg-black opacity-60 z-10"></div>
      <div className="fixed inset-0 w-full h-full flex items-center justify-center z-50">
        <div className="w-1/2 h-auto max-h-[756px] py-4 bg-white rounded-lg overflow-y-auto">
          <div className="flex items-center justify-end px-4">
            <CustomButton
              onClick={() => {
                goBackRoute(router, previousAsPath, route.index);
              }}
            >
              <CloseIcon className="w-6 h-6 text-textNormal" />
            </CustomButton>
          </div>
          {children}
        </div>
      </div>
    </>
  );
};

export default Modal;

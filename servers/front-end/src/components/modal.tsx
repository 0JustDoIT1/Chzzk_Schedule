"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { ReactNode, useEffect } from "react";
import CloseIcon from "~/public/assets/svg/close";
import { CustomButton } from "./button";
import { useAsPathStore } from "@/providers/asPath-provider";

const Modal = ({
  children,
}: Readonly<{
  children: ReactNode;
}>) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isOpen = searchParams.get("modal");

  const previousAsPath = useAsPathStore((state) => state.previousAsPath);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-y-hidden");
    } else {
      document.body.classList.remove("overflow-y-hidden");
    }
  }, [isOpen]);

  return (
    <React.Fragment>
      {isOpen ? (
        <React.Fragment>
          <div className="fixed inset-0 w-screen h-screen bg-black opacity-60 z-10"></div>
          <div className="fixed inset-0 w-full h-full flex items-center justify-center z-50">
            <div className="w-1/2 h-auto max-h-[756px] py-4 bg-white rounded-lg overflow-y-auto">
              <div className="flex items-center justify-end px-4">
                <CustomButton
                  onClick={() => {
                    router.push(previousAsPath!);
                  }}
                >
                  <CloseIcon className="w-6 h-6 text-textNormal" />
                </CustomButton>
              </div>
              {children}
            </div>
          </div>
        </React.Fragment>
      ) : null}
    </React.Fragment>
  );
};

export default Modal;

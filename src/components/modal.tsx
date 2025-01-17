"use client";

import { useRouter } from "next/navigation";
import React, { ReactNode } from "react";
import CloseIcon from "~/public/assets/svg/close";

const Modal = ({
  children,
}: Readonly<{
  children: ReactNode;
}>) => {
  const router = useRouter();

  return (
    <React.Fragment>
      <div className="fixed inset-0 w-screen h-screen bg-black opacity-60 z-10"></div>
      <div className="fixed inset-0 w-full h-full flex items-center justify-center z-50">
        <div className="w-4/5 max-h-2/3 p-4 bg-white rounded-lg md:w-3/4 md:max-w-[1024px] lg:w-2/3 lg:max-w-[1024px]">
          <div className="flex items-center justify-end">
            <button
              onClick={() => {
                router.back();
              }}
            >
              <CloseIcon className="w-6 h-6 text-gray-600" />
            </button>
          </div>
          {children}
        </div>
      </div>
    </React.Fragment>
  );
};

export default Modal;

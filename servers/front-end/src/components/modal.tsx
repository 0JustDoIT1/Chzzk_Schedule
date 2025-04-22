import { useRouter } from "next/navigation";
import React, { ReactNode, useEffect } from "react";
import CloseIcon from "~/public/assets/svg/close";
import { CustomButton } from "./button";

const Modal = ({
  children,
}: Readonly<{
  children: ReactNode;
}>) => {
  const router = useRouter();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <React.Fragment>
      <div className="fixed inset-0 w-screen h-screen bg-black opacity-60 z-10"></div>
      <div className="fixed inset-0 w-full h-full flex items-center justify-center z-50">
        <div className="w-1/2 h-4/5 py-4 bg-white rounded-lg overflow-y-auto">
          <div className="flex items-center justify-end px-4">
            <CustomButton
              onClick={() => {
                router.back();
              }}
            >
              <CloseIcon className="w-6 h-6 text-textNormal" />
            </CustomButton>
          </div>
          {children}
        </div>
      </div>
    </React.Fragment>
  );
};

export default Modal;

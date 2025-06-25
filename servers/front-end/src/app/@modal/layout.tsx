import Modal from "@/components/modal";
import { ReactNode } from "react";

export default function ModalLayout({ children }: { children: ReactNode }) {
  return <Modal>{children}</Modal>;
}

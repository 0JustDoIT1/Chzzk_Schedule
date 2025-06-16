// import Link from "@tiptap/extension-link";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
// import { Markdown } from "tiptap-markdown";
import TiptapToolbar from "./tiptapToolbar";
import Underline from "@tiptap/extension-underline";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect } from "react";

interface ITiptapEditor {
  text: string;
  setText: (...event: any[]) => void;
}

const TiptapEditor = ({ text, setText }: ITiptapEditor) => {
  useEffect(() => {
    if (!text) editor?.commands.clearContent();
  }, [text]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image.configure({
        allowBase64: true,
        inline: true,
      }),
      Placeholder.configure({
        placeholder: "방송 내용을 입력해 주세요.",
      }),
      //   Link.extend({ inclusive: false }).configure({
      //     openOnClick: false,
      //   }),
      //   Markdown,
    ],
    content: text,
    onUpdate({ editor }) {
      const value = editor.isEmpty ? "" : editor.getHTML();
      setText(value);
    },
    immediatelyRender: false,
  });

  return (
    <div
      id="tiptap-box"
      className="w-full rounded-md bg-white text-sm text-textMain box-border ring-1 shadow-xs ring-textLight outline-none"
    >
      {editor && <TiptapToolbar editor={editor} />}
      <EditorContent editor={editor} />
    </div>
  );
};

export default TiptapEditor;

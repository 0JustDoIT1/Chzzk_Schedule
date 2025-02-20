// import Link from "@tiptap/extension-link";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useState } from "react";
// import { Markdown } from "tiptap-markdown";
import TiptapToolbar from "./tiptapToolbar";
import Underline from "@tiptap/extension-underline";
import Image from "@tiptap/extension-image";

const TiptapEditor = () => {
  const [text, setText] = useState<string>("");
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image.configure({
        allowBase64: true,
        inline: true,
      }),
      //   Link.extend({ inclusive: false }).configure({
      //     openOnClick: false,
      //   }),
      //   Markdown,
    ],
    content: text,
    onUpdate({ editor }) {
      setText(editor.getHTML());
    },
    immediatelyRender: false,
  });

  return (
    <div className="w-full rounded-md bg-white text-sm text-gray-800 box-border ring-1 shadow-xs ring-gray-300 outline-none">
      {editor && <TiptapToolbar editor={editor} />}
      <EditorContent editor={editor} />
    </div>
  );
};

export default TiptapEditor;

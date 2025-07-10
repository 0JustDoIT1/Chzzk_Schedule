import { Editor } from "@tiptap/react";
import FormatAddPhotoAlternateIcon from "~/public/assets/svg/format-add-photo-alternate";
import FormatBoldIcon from "~/public/assets/svg/format-bold";
import FormatH1Icon from "~/public/assets/svg/format-h1";
import FormatH2Icon from "~/public/assets/svg/format-h2";
import FormatH3Icon from "~/public/assets/svg/format-h3";
import FormatItalicIcon from "~/public/assets/svg/format-italic";
import FormatStrikethroughIcon from "~/public/assets/svg/format-strikethrough";
import FormatUnderlineIcon from "~/public/assets/svg/format-underlined";
import ToolbarButton from "./tiptapToolbarButton";

type ToolbarProps = {
  editor: Editor;
};

const TiptapToolbar = ({ editor }: ToolbarProps) => {
  const handleUploadPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const file = files[0];

    let reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result?.toString() || "";
      editor?.chain().focus().setImage({ src: url }).run();
    };
    reader.readAsDataURL(file);

    e.target.value = "";
  };

  return (
    <div className="flex items-center justify-between p-2 bg-textMain rounded-t-md">
      <div className="w-full grid grid-cols-3 divide-x divide-x-white">
        <div className="flex items-center justify-center gap-4">
          <ToolbarButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            active={editor.isActive("heading", { level: 1 })}
            ariaLabel="제목 1"
          >
            <FormatH1Icon className="w-full h-full text-white" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            active={editor.isActive("heading", { level: 2 })}
            ariaLabel="제목 2"
          >
            <FormatH2Icon className="w-full h-full text-white" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            active={editor.isActive("heading", { level: 3 })}
            ariaLabel="제목 3"
          >
            <FormatH3Icon className="w-full h-full text-white" />
          </ToolbarButton>
        </div>
        <div className="flex items-center justify-center gap-4">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            active={editor.isActive("bold")}
            ariaLabel="굵게"
          >
            <FormatBoldIcon className="w-full h-full text-white" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            active={editor.isActive("italic")}
            ariaLabel="기울임"
          >
            <FormatItalicIcon className="w-full h-full text-white" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            active={editor.isActive("underline")}
            ariaLabel="밑줄"
          >
            <FormatUnderlineIcon className="w-full h-full text-white" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            active={editor.isActive("strike")}
            ariaLabel="취소선"
          >
            <FormatStrikethroughIcon className="w-full h-full text-white" />
          </ToolbarButton>
        </div>
        <div className="flex items-center justify-center gap-4">
          <input
            id="file"
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleUploadPhoto}
          />
          <label
            htmlFor="file"
            className="w-6 h-6 cursor-pointer"
            aria-label="사진 업로드"
          >
            <FormatAddPhotoAlternateIcon className="w-full h-full text-white" />
          </label>
        </div>
      </div>
    </div>
  );
};

export default TiptapToolbar;

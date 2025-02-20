import { streamingType } from "@/constants/streaming";
import TiptapEditor from "./tiptapEditor";

const ScheduleInput = () => {
  return (
    <div className="container mx-auto px-4 md:px-8 md:flex-row lg:max-w-2xl">
      <div className="flex flex-col gap-2">
        <label htmlFor="title" className="text-sm text-gray-700">
          &#42; 일정 제목
        </label>
        <input
          id="title"
          className="w-full rounded-md bg-white p-2 text-sm text-gray-800 box-border ring-1 shadow-xs ring-gray-300 outline-none hover:bg-gray-50 focus:ring-brandMain focus:border-brandMain"
          type="text"
          value=""
          name="title"
          placeholder="제목을 입력해 주세요."
          onChange={(e) => {}}
        />
      </div>
      <div className="flex flex-col gap-2 mt-4">
        <label htmlFor="startAtDate" className="text-sm text-gray-700">
          &#42; 시작 일시
        </label>
        <div className="flex flex-row gap-2">
          <input
            id="startAtDate"
            className="w-1/2 rounded-md bg-white p-2 text-sm text-gray-800 box-border ring-1 shadow-xs ring-gray-300 outline-none hover:bg-gray-50 focus:ring-brandMain focus:border-brandMain"
            type="date"
            value=""
            name="startAtDate"
            onChange={(e) => {}}
          />
          <input
            id="startAtTime"
            className="w-1/2 rounded-md bg-white p-2 text-sm text-gray-800 box-border ring-1 shadow-xs ring-gray-300 outline-none hover:bg-gray-50 focus:ring-brandMain focus:border-brandMain"
            type="time"
            value=""
            name="startAtTime"
            onChange={(e) => {}}
          />
        </div>
      </div>
      <div className="flex flex-col gap-2 mt-4">
        <label htmlFor="endAtDate" className="text-sm text-gray-700">
          &#42; 종료 일시
        </label>
        <div className="flex flex-row gap-2">
          <input
            id="endAtDate"
            className="w-1/2 rounded-md bg-white p-2 text-sm text-gray-800 box-border ring-1 shadow-xs ring-gray-300 outline-none hover:bg-gray-50 focus:ring-brandMain focus:border-brandMain"
            type="date"
            value=""
            name="endAtDate"
            onChange={(e) => {}}
          />
          <input
            id="endAtTime"
            className="w-1/2 rounded-md bg-white p-2 text-sm text-gray-800 box-border ring-1 shadow-xs ring-gray-300 outline-none hover:bg-gray-50 focus:ring-brandMain focus:border-brandMain"
            type="time"
            value=""
            name="endAtTime"
            onChange={(e) => {}}
          />
        </div>
      </div>
      <div className="flex flex-col gap-2 mt-4">
        <label htmlFor="streamingType" className="text-sm text-gray-700">
          &#42; 방송 종류
        </label>
        <select
          id="streamingType"
          className="w-full rounded-md bg-white p-2 text-sm text-gray-800 box-border ring-1 shadow-xs ring-gray-300 outline-none hover:bg-gray-50 focus:ring-brandMain focus:border-brandMain"
        >
          <option style={{ color: "gray" }} value="">
            방송 종류를 선택해 주세요.
          </option>
          {streamingType.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-2 mt-4">
        <label htmlFor="contents" className="text-sm text-gray-700">
          &#42; 방송 내용
        </label>
        <input
          id="title"
          className="hidden"
          type="text"
          value=""
          name="searchValue"
          onChange={(e) => {}}
        />
        <TiptapEditor />
      </div>
    </div>
  );
};

export default ScheduleInput;

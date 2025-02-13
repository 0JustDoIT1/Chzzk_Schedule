const ScheduleEdit = () => {
  return (
    <div className="container mx-auto md:px-8 md:flex-row lg:max-w-[1200px]">
      <div className="flex flex-col gap-2">
        <label htmlFor="title" className="text-sm">
          &#42; 일정 제목
        </label>
        <input
          id="title"
          className="w-full rounded-md bg-white p-2 text-sm text-gray-900 box-border ring-1 shadow-xs ring-gray-300 outline-none hover:bg-gray-50"
          type="text"
          value=""
          name="searchValue"
          onChange={(e) => {}}
        />
      </div>
    </div>
  );
};

export default ScheduleEdit;

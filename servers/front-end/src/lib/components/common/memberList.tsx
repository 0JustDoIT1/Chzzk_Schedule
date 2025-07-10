import CloseIcon from "~/public/assets/svg/close";

interface IMemberList {
  member: string[];
  onRemove: (name: string) => void;
}

const MemberList = ({ member, onRemove }: IMemberList) => {
  return (
    <div className="flex flex-wrap gap-1 items-center w-full mt-2">
      {member &&
        member.map((name: string) => (
          <div
            key={name}
            className="flex items-center justify-between rounded-md border border-brandMain bg-brandMain text-xs text-white py-1 pl-2 pr-1"
          >
            {name}
            <span
              className="cursor-pointer"
              onClick={() => {
                onRemove(name);
              }}
            >
              <CloseIcon className="w-4 h-4 ml-2 text-white" />
            </span>
          </div>
        ))}
    </div>
  );
};

export default MemberList;

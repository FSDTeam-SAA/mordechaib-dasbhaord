import { ShieldCheck, SquarePen, Users } from "lucide-react";
import type { AdminRole } from "./role-data";

const tones = {
  blue: "bg-[#EEF5FF] text-[#597CFF] border-[#DDE9FF]",
  orange: "bg-[#FFF6E5] text-[#FF9900] border-[#FFE9C4]",
  green: "bg-[#E5F8F1] text-[#00BE8A] border-[#CCF0E5]",
};

export default function RoleCard({
  role,
  onEdit,
}: {
  role: AdminRole;
  onEdit: () => void;
}) {
  return (
    <article className="min-h-[228px] rounded-2xl bg-white p-4">
      <div className="mb-2 flex items-center gap-2.5">
        <div
          className={`flex size-11 shrink-0 items-center justify-center rounded-full ${tones[role.tone]}`}
        >
          {role.tone === "orange" ? (
            <Users className="size-5" />
          ) : (
            <ShieldCheck className="size-5" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-base font-medium text-[#151830]">{role.name}</h2>
          <p className="mt-1 text-xs text-[#929AC0]">
            {role.memberCount} members
          </p>
        </div>
        <button
          onClick={onEdit}
          aria-label={`Edit ${role.name}`}
          className="cursor-pointer rounded p-1 text-[#A4A4A4] hover:bg-[#F5F6FF] focus-visible:outline-[#5C7CFA]"
        >
          <SquarePen className="size-5" strokeWidth={1.4} />
        </button>
      </div>
      <div className="flex flex-wrap gap-x-2 gap-y-1.5 border-b border-[#B7BED9] pb-2">
        {role.permissions.map((permission) => (
          <span
            key={permission}
            className={`rounded-full border px-2 py-0.5 text-[11px] leading-tight ${tones[role.tone]}`}
          >
            {permission}
          </span>
        ))}
      </div>
      <p className="mb-2 mt-3 text-sm text-[#A6A6A6]">Members</p>
      <div className="flex flex-wrap gap-2">
        {role.members.map((member) => (
          <span
            key={member}
            className="rounded-full bg-[#F6F7FC] px-2.5 py-1 text-[11px] text-[#242840] shadow-[0_2px_8px_#1F28500A]"
          >
            {member}
          </span>
        ))}
        {role.memberCount > role.members.length && (
          <span className="rounded-full bg-[#F6F7FC] px-2.5 py-1 text-[11px] text-[#242840]">
            +{role.memberCount - role.members.length} more
          </span>
        )}
      </div>
    </article>
  );
}

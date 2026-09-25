import { CalendarDays, CircleCheck, Mic, Pencil, Rocket, Trash2, Workflow } from "lucide-react";

export const packStyles = {
  actions: { icon: Workflow, color: "#607AFF", border: "#607AFF", label: "AI Actions · Blue" },
  voice: { icon: Mic, color: "#DA48D0", border: "#E345DF", label: "Voice Minutes · Pink" },
  operations: { icon: Rocket, color: "#F59B00", border: "#F59B00", label: "Operations · Orange" },
  meetings: { icon: CalendarDays, color: "#3DA16A", border: "#A9DFBB", label: "Meetings · Green" },
};
export type AddOnPack = { id: string; name: string; style: keyof typeof packStyles; items: string[] };
export const initialPacks: AddOnPack[] = [
  { id: "actions", name: "AI Actions Packs", style: "actions", items: ["1,000 AI Actions - $25", "5,000 AI Actions - $90", "10,000 AI Actions - $300"] },
  { id: "voice", name: "AI Voice Minutes Packs", style: "voice", items: ["500 Voice Minutes - $12", "2,000 Voice Minutes - $40", "10,000 Voice Minutes - $180"] },
  { id: "operations", name: "Operations Booster Pack", style: "operations", items: ["+10,000 AI Actions", "+1,000 Voice Minutes", "Priority Support"] },
  { id: "meetings", name: "AI Meeting Capture", style: "meetings", items: ["10 meeting hours — $12", "30 meeting hours — $32", "75 meeting hours — $75"] },
];

export default function AddOnPacks({ packs, onEdit, onDelete }: { packs: AddOnPack[]; onEdit: (pack: AddOnPack) => void; onDelete: (pack: AddOnPack) => void }) {
  return <div className="overflow-x-auto pb-2">
    <div className="grid min-w-[1080px] grid-cols-4 gap-4">
      {packs.map(pack => {
        const style = packStyles[pack.style];
        return <article key={pack.id} style={{ borderColor: style.border }} className="flex min-w-0 flex-col rounded-xl border-2 bg-[#FCFBFF] p-4 shadow-sm">
          <div className="flex min-h-14 items-start gap-2 border-b border-[#E2E5EF] pb-4">
            <span style={{ backgroundColor: style.color }} className="flex size-8 shrink-0 items-center justify-center rounded-full text-white"><style.icon className="size-5" strokeWidth={1.7} /></span>
            <h3 className="pt-1 text-[15px] font-semibold leading-5 break-words text-[#171C35]">{pack.name}</h3>
          </div>
          <ul className="my-5 space-y-4">{pack.items.map((item, index) => <li key={index} className="flex items-start gap-2 text-sm leading-5 break-words text-[#262A40]"><CircleCheck style={{ color: style.color }} className="mt-0.5 size-4 shrink-0" strokeWidth={1.7} /><span className="min-w-0">{item}</span></li>)}</ul>
          <div className="mt-auto flex gap-2 border-t border-[#E2E5EF] pt-3">
            <button type="button" aria-label={`Edit ${pack.name}`} onClick={() => onEdit(pack)} className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-md border border-[#DDE3FF] py-2 text-xs text-[#607AFF] hover:bg-[#EFF2FF]"><Pencil className="size-3.5" />Edit</button>
            <button type="button" aria-label={`Delete ${pack.name}`} onClick={() => onDelete(pack)} className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-md border border-red-100 py-2 text-xs text-[#FF5057] hover:bg-red-50"><Trash2 className="size-3.5" />Delete</button>
          </div>
        </article>;
      })}
    </div>
  </div>;
}

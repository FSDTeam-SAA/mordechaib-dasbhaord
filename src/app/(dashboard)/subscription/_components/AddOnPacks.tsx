import { addonCategories, type AddonProduct } from "@/lib/addon-api";
import { usd } from "@/lib/subscription-api";
import { CalendarDays, CircleCheck, Mic, Pencil, Rocket, Trash2, Workflow } from "lucide-react";

export const packStyles = {
  actions: { icon: Workflow, color: "#607AFF", border: "#607AFF", label: "AI Actions · Blue" },
  voice: { icon: Mic, color: "#DA48D0", border: "#E345DF", label: "Voice Minutes · Pink" },
  operations: { icon: Rocket, color: "#F59B00", border: "#F59B00", label: "Operations · Orange" },
  meetings: { icon: CalendarDays, color: "#3DA16A", border: "#A9DFBB", label: "Meetings · Green" },
};
export default function AddOnPacks({ packs, onEdit, onDelete }: { packs: AddonProduct[]; onEdit: (pack: AddonProduct) => void; onDelete: (pack: AddonProduct) => void }) {
  return <div className="overflow-x-auto pb-2">
    <div className="grid min-w-[1080px] grid-cols-4 gap-4">
      {packs.map(pack => {
        const style = packStyles[addonCategories[pack.category]?.style ?? "actions"];
        return <article key={pack._id} style={{ borderColor: style.border }} className="flex min-w-0 flex-col rounded-xl border-2 bg-[#FCFBFF] p-4 shadow-sm">
          <div className="flex min-h-14 items-start gap-2 border-b border-[#E2E5EF] pb-4">
            <span style={{ backgroundColor: style.color }} className="flex size-8 shrink-0 items-center justify-center rounded-full text-white"><style.icon className="size-5" strokeWidth={1.7} /></span>
            <h3 className="pt-1 text-[15px] font-semibold leading-5 break-words text-[#171C35]">{pack.name}</h3>
          </div>
          {pack.description && <p className="mt-3 text-xs leading-5 text-[#737D95]">{pack.description}</p>}
          <div className="mt-2 flex flex-wrap gap-2 text-[10px] text-[#929AC0]">{!pack.isActive && <span className="rounded bg-amber-50 px-2 py-1 text-amber-600">Inactive</span>}{pack.isInquiryOnly && <span className="rounded bg-[#F0F3FF] px-2 py-1">Contact Sales</span>}</div>
          <ul className="my-5 space-y-4">{pack.tiers.map((tier, index) => <li key={index} className="flex items-start gap-2 text-sm leading-5 break-words text-[#262A40]"><CircleCheck style={{ color: style.color }} className="mt-0.5 size-4 shrink-0" strokeWidth={1.7} /><span className="min-w-0">{tier.label}{!pack.isInquiryOnly && ` — ${usd(tier.priceUsd)}`}<span className="mt-1 block text-xs text-[#929AC0]">Quantity: {tier.quantity.toLocaleString("en-US")}</span></span></li>)}</ul>
          <div className="mt-auto flex gap-2 border-t border-[#E2E5EF] pt-3">
            <button type="button" aria-label={`Edit ${pack.name}`} onClick={() => onEdit(pack)} className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-md border border-[#DDE3FF] py-2 text-xs text-[#607AFF] hover:bg-[#EFF2FF]"><Pencil className="size-3.5" />Edit</button>
            <button type="button" aria-label={`Delete ${pack.name}`} onClick={() => onDelete(pack)} className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-md border border-red-100 py-2 text-xs text-[#FF5057] hover:bg-red-50"><Trash2 className="size-3.5" />Delete</button>
          </div>
        </article>;
      })}
    </div>
  </div>;
}

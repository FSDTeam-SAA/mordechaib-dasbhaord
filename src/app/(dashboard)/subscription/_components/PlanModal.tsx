"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { CircleCheck, Plus, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { usePlans } from "./PlanProvider";
import type { Plan } from "./PlanCard";

const inputClass = "mt-1.5 block min-h-10 w-full rounded-lg border-0 bg-[#F5F6FF] px-3 py-2.5 text-sm text-[#30334C] placeholder:text-[#929AC0] focus-visible:outline-2 focus-visible:outline-[#607AFF]";
const groups = [{ key: "usage", label: "Included Monthly Usage" }, { key: "capabilities", label: "Core Capabilities" }, { key: "support", label: "Support" }, { key: "channels", label: "Communication Channels" }] as const;
type ListKey = (typeof groups)[number]["key"];

function PlanForm({ plan, onClose }: { plan?: Plan; onClose: () => void }) {
  const { savePlan } = usePlans();
  const [billing, setBilling] = useState(plan?.price === null ? "custom" : plan?.billingType ?? "monthly");
  const [lists, setLists] = useState<Record<ListKey, string[]>>({ usage: plan?.usage ?? [""], capabilities: plan?.capabilities ?? [""], support: plan?.support ?? [""], channels: plan?.channels ?? ["Calls", "Voice Notes", "Meetings"] });
  const [error, setError] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const description = String(data.get("description") ?? "").trim();
    const price = billing === "custom" ? null : Number(data.get("price"));
    if (!name || !description) { setError("Please enter a plan title and subtitle."); return; }
    if (price !== null && (!Number.isFinite(price) || price < 0)) { setError("Please enter a valid price."); return; }
    const clean = (key: ListKey) => Array.from(new Set(lists[key].map(value => value.trim()).filter(Boolean)));
    savePlan({ id: plan?.id ?? crypto.randomUUID(), name, description, price, billingType: billing === "yearly" ? "yearly" : "monthly", usage: clean("usage"), capabilities: clean("capabilities"), support: clean("support"), channels: clean("channels") });
    onClose();
  }
  return <form onSubmit={submit} className="space-y-4">
    <label className="block text-xs text-[#929AC0]">Plan Title<input autoFocus name="name" required maxLength={60} defaultValue={plan?.name} placeholder="e.g. Starter" className={inputClass} /></label>
    <label className="block text-xs text-[#929AC0]">Plan Subtitle<textarea name="description" required maxLength={180} defaultValue={plan?.description} placeholder="For solo operators and early-stage businesses." rows={2} className={inputClass} /></label>
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <label className="block text-xs text-[#929AC0]">Billing Type<select value={billing} onChange={event => setBilling(event.target.value)} className={inputClass}><option value="monthly">Monthly</option><option value="yearly">Yearly</option><option value="custom">Variable pricing</option></select></label>
      <label className="block text-xs text-[#929AC0]">{billing === "yearly" ? "Yearly Price ($)" : "Price ($)"}<input name="price" type="number" min="0" step="0.01" required={billing !== "custom"} disabled={billing === "custom"} defaultValue={plan?.price ?? ""} placeholder={billing === "custom" ? "Custom quote" : "e.g. 149.00"} className={`${inputClass} disabled:opacity-50`} /></label>
    </div>
    <p className="text-[11px] text-[#929AC0]">{billing === "monthly" ? "Yearly billing includes a 20% discount on the monthly price." : billing === "yearly" ? "Enter the full annual total. Cards also show the equivalent monthly price." : "The card will show “Let’s talk” and Contact Sales."}</p>
    {groups.map(group => <fieldset key={group.key} className="space-y-2">
      <legend className="mb-2 w-full text-xs text-[#929AC0]"><span className="flex items-center justify-between gap-2">{group.label}<button type="button" aria-label={`Add ${group.label.toLowerCase()} item`} onClick={() => setLists(current => ({ ...current, [group.key]: [...current[group.key], ""] }))} className="flex cursor-pointer items-center gap-1 rounded-md bg-[#5D7BF5] px-2.5 py-1.5 text-xs text-white hover:bg-[#4968E8]"><Plus className="size-3.5" />Add</button></span></legend>
      {lists[group.key].map((value, index) => <div key={index} className="flex items-center gap-2 rounded border border-[#F0F2FA] px-2.5 py-1.5">
        <CircleCheck className="size-3.5 shrink-0 text-[#607AFF]" />
        <input aria-label={`${group.label} ${index + 1}`} value={value} maxLength={160} onChange={event => setLists(current => ({ ...current, [group.key]: current[group.key].map((item, itemIndex) => itemIndex === index ? event.target.value : item) }))} placeholder={`Add ${group.label.toLowerCase()}`} className="min-w-0 flex-1 rounded px-1 py-1.5 text-sm text-[#30334C] outline-[#607AFF] placeholder:text-[#929AC0]" />
        <button type="button" aria-label={`Delete ${group.label.toLowerCase()} ${index + 1}`} onClick={() => setLists(current => ({ ...current, [group.key]: current[group.key].filter((_, itemIndex) => itemIndex !== index) }))} className="cursor-pointer rounded p-1.5 text-[#FF5057] hover:bg-red-50"><Trash2 className="size-4" /></button>
      </div>)}
    </fieldset>)}
    {error && <p role="alert" className="text-sm text-red-500">{error}</p>}
    <div className="sticky -bottom-5 grid grid-cols-2 gap-3 border-t border-[#F0F2FA] bg-white py-3">
      <button type="button" onClick={onClose} className="min-h-10 cursor-pointer rounded-md border border-[#607AFF] text-sm text-[#607AFF] hover:bg-[#F5F6FF]">Cancel</button>
      <button type="submit" className="min-h-10 cursor-pointer rounded-md bg-[#5D7BF5] text-sm text-white hover:bg-[#4968E8]">{plan ? "Save Changes" : "Add Plan"}</button>
    </div>
  </form>;
}

export default function PlanModal({ planId }: { planId?: string }) {
  const router = useRouter();
  const { plans } = usePlans();
  const plan = plans.find(item => item.id === planId);
  const close = () => router.push("/subscription");
  return <Dialog open onOpenChange={open => { if (!open) close(); }}>
    <DialogContent overlayClassName="bg-[#171C35]/15 backdrop-blur-[3px]" className="max-h-[90dvh] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden rounded-xl border-0 bg-white p-5 sm:max-w-[664px] [&>button]:flex [&>button]:size-6 [&>button]:items-center [&>button]:justify-center [&>button]:rounded-full [&>button]:border [&>button]:border-[#929AC0] [&>button]:text-[#929AC0]">
      <DialogHeader className="border-b border-[#F0F2FA] pb-3 text-left">
        <DialogTitle className="pr-7 text-base font-medium text-[#171C35]">{planId ? "Edit Subscription Plan" : "Add new Subscription Plans"}</DialogTitle>
        <DialogDescription className="text-xs text-[#929AC0]">Set plan details and add or remove benefits. Changes are saved in this preview until refresh.</DialogDescription>
      </DialogHeader>
      {planId && !plan ? <div className="space-y-4"><p className="text-sm">This plan was not found. Preview plans reset when the page is refreshed.</p><button onClick={close} className="rounded-md bg-[#5D7BF5] px-4 py-2 text-white">Back to plans</button></div> : <PlanForm key={planId ?? "new"} plan={plan} onClose={close} />}
    </DialogContent>
  </Dialog>;
}

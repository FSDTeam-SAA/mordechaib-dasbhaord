"use client";

import { useRouter } from "next/navigation";
import { usePlans } from "./PlanProvider";
import { useState } from "react";
import PlanCard, { type Plan } from "./PlanCard";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function PlansTab() {
  const router = useRouter();
  const { plans } = usePlans();
  const [yearly, setYearly] = useState(false);
  const [selected, setSelected] = useState<Plan | null>(null);
  return <>
    <div className="mx-auto w-full max-w-[1000px] rounded-xl bg-white p-4 sm:p-6">
        <div className="mb-6 flex justify-center border-b border-[#EFF1FA] pb-5"><div aria-label="Billing period" className="inline-flex gap-1 rounded-md bg-[#F5F6FF] p-1">{[false, true].map(annual => <button key={String(annual)} aria-pressed={yearly === annual} onClick={() => setYearly(annual)} className={`flex cursor-pointer items-center gap-2 rounded px-4 py-2 text-xs ${yearly === annual ? "bg-[#5D7BF5] text-white" : "text-[#929AC0]"}`}>{annual ? "Yearly" : "Monthly"}{annual && <span className={`rounded-full px-1.5 py-0.5 text-[9px] ${yearly ? "bg-white/20" : "bg-[#5D7BF5] text-white"}`}>Save 20%</span>}</button>)}</div></div>
        <div className="mx-auto grid max-w-[400px] grid-cols-1 items-stretch gap-5 md:max-w-none md:grid-cols-2">{plans.map(plan => <PlanCard key={plan.id} plan={plan} yearly={yearly} onSelect={setSelected} onEdit={plan => router.push(`/subscription/edit/${plan.id}`)} />)}</div>
    </div>
    <Dialog open={selected !== null} onOpenChange={open => { if (!open) setSelected(null); }}><DialogContent><DialogHeader><DialogTitle>{selected?.name}</DialogTitle><DialogDescription>{selected?.price === null ? "Custom pricing is tailored to your organization’s requirements." : `Your selected plan is $${selected ? (selected.billingType === "yearly" ? (selected.price! / 12).toFixed(2) : yearly ? (selected.price! * 0.8).toFixed(2) : selected.price) : 0}/month${yearly ? ", billed yearly" : ""}.`}</DialogDescription></DialogHeader><p className="text-sm text-[#737D95]">This is a design preview. Trial activation and sales requests will be available when the subscription service is connected.</p></DialogContent></Dialog>
  </>;
}

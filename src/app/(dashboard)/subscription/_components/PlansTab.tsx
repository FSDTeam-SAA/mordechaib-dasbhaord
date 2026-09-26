"use client";

import { useRouter } from "next/navigation";
import { usePlans } from "./PlanProvider";
import { useState } from "react";
import { planToCard, usd } from "@/lib/subscription-api";
import SubscriptionQueryState from "../../_components/SubscriptionQueryState";
import PlanCard, { type Plan } from "./PlanCard";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function PlansTab() {
  const router = useRouter();
  const { plans, query, billingCycle, setBillingCycle } = usePlans();
  const yearly = billingCycle === "year";
  const [selected, setSelected] = useState<Plan | null>(null);
  return <>
    <div className="mx-auto w-full max-w-[1000px] rounded-xl bg-white p-4 sm:p-6">
        <div className="mb-6 flex justify-center border-b border-[#EFF1FA] pb-5"><div aria-label="Billing period" className="inline-flex gap-1 rounded-md bg-[#F5F6FF] p-1">{[false, true].map(annual => <button key={String(annual)} aria-pressed={yearly === annual} onClick={() => setBillingCycle(annual ? "year" : "month")} className={`flex cursor-pointer items-center gap-2 rounded px-4 py-2 text-xs ${yearly === annual ? "bg-[#5D7BF5] text-white" : "text-[#929AC0]"}`}>{annual ? "Yearly" : "Monthly"}</button>)}</div></div>
        {query.isPending || query.error ? <SubscriptionQueryState error={query.error} retry={() => void query.refetch()} /> : plans.length === 0 ? <p className="py-8 text-center text-sm text-[#929AC0]">No plans available for {yearly ? "yearly" : "monthly"} billing.</p> : <div className="mx-auto grid max-w-[400px] grid-cols-1 items-stretch gap-5 md:max-w-none md:grid-cols-2">{plans.map(planToCard).map(plan => <PlanCard key={plan.id} plan={plan} yearly={yearly} onSelect={setSelected} onEdit={plan => router.push(`/subscription/edit/${plan.id}`)} />)}</div>}
    </div>
    <Dialog open={selected !== null} onOpenChange={open => { if (!open) setSelected(null); }}><DialogContent><DialogHeader><DialogTitle>{selected?.name}</DialogTitle><DialogDescription>{selected?.description}</DialogDescription></DialogHeader><div className="space-y-2 text-sm text-[#737D95]"><p>{selected?.price === null ? "Variable pricing" : selected ? `${usd(yearly ? selected.annualPrice ?? 0 : selected.price ?? 0)} / ${yearly ? "year" : "month"}` : ""}</p><p>{selected?.activeSubscriberCount ?? 0} active subscribers</p><p>{usd(selected?.monthlyRevenueUsd ?? 0)} monthly revenue</p></div></DialogContent></Dialog>
  </>;
}

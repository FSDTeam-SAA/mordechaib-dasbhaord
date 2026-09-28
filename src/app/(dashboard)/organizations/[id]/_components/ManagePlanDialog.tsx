"use client";

import { useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogDescription, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { Plan } from "../../organization-data";

export type BillingCycle = "Monthly" | "Yearly";
const plans: { name: Plan; price: number }[] = [
  { name: "Starter", price: 49 },
  { name: "Growth", price: 99 },
  { name: "Enterprise", price: 249 },
];

export default function ManagePlanDialog({ companyName, currentPlan, billingCycle, onApply }: {
  companyName: string;
  currentPlan: string;
  billingCycle: string;
  onApply: (plan: Plan, billing: BillingCycle) => void;
}) {
  const initialPlan: Plan = currentPlan === "Growth" || currentPlan === "Enterprise" ? currentPlan : "Growth";
  const initialBilling: BillingCycle = billingCycle === "Yearly" ? "Yearly" : "Monthly";
  const [open, setOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan>(initialPlan);
  const [billing, setBilling] = useState<BillingCycle>(initialBilling);
  const unchanged = selectedPlan === currentPlan && billing === billingCycle;

  function handleOpen(next: boolean) {
    if (next) {
      setSelectedPlan(initialPlan);
      setBilling(initialBilling);
    }
    setOpen(next);
  }

  return <Dialog open={open} onOpenChange={handleOpen}>
    <DialogTrigger asChild><Button className="h-9 cursor-pointer rounded-md bg-[#5B7CFA] px-3 text-[11px] font-normal text-white hover:bg-[#4B6CEB]">Manage Plan</Button></DialogTrigger>
    <DialogPortal>
      <DialogOverlay className="z-[60] bg-[#202840]/15 backdrop-blur-[5px]" />
      <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-[70] max-h-[calc(100dvh-32px)] w-[calc(100vw-32px)] max-w-[720px] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-[10px] bg-white p-4 text-[#171C35] shadow-[0_16px_60px_rgba(40,49,84,0.18)] outline-none sm:p-5">
        <DialogTitle className="text-center text-xl font-semibold leading-7">Manage Plan</DialogTitle>
        <DialogDescription className="mt-2 text-center text-xs text-[#30364E]">{companyName} — currently on <span className="text-[#5B7CFF]">{currentPlan}</span></DialogDescription>
        <fieldset className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
          <legend className="sr-only">Choose a subscription plan</legend>
          {plans.map((plan) => {
            const selected = selectedPlan === plan.name;
            const price = billing === "Yearly" ? plan.price * 0.8 : plan.price;
            return <label key={plan.name} className="relative min-w-0 cursor-pointer">
              <input type="radio" name="subscription-plan" value={plan.name} checked={selected} onChange={() => setSelectedPlan(plan.name)} className="peer sr-only" />
              <span className={cn("flex min-h-[132px] flex-col rounded-[9px] border p-3 transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#5B7CFF] sm:min-h-[145px] sm:p-4", selected ? "border-[#5B7CFF] bg-[#EFF3FF] shadow-[inset_0_1px_0_#5B7CFF]" : "border-[#E3A5FF] bg-[#FCF5FF]")}>
                <span className={cn("mb-3 flex h-7 w-7 items-center justify-center rounded-lg border", selected ? "border-[#B9C7FF] text-[#5B7CFF]" : "border-[#E1A4FF] text-[#C93EFF]")}><Zap className="h-4 w-4" strokeWidth={1.6} /></span>
                <span className="text-xs font-semibold text-[#242431] sm:text-sm">{plan.name}</span>
                <span className={cn("mt-2 flex flex-wrap items-baseline", selected ? "text-[#5B7CFF]" : "text-[#D94BDB]")}><span className="text-[23px] font-bold leading-7 sm:text-[28px]">${Number(price.toFixed(2))}</span><span className="ml-0.5 text-[9px]">/mo</span></span>
              </span>
            </label>;
          })}
        </fieldset>
        <fieldset className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 bg-[#F5F6FF] px-2 py-2 text-xs text-[#30364E]">
          <legend className="sr-only">Billing type</legend><span aria-hidden="true">Billing type:</span>
          <label className="flex cursor-pointer items-center gap-1.5"><input type="radio" name="billing-cycle" value="Monthly" checked={billing === "Monthly"} onChange={() => setBilling("Monthly")} className="h-3 w-3 accent-[#5B7CFF]" />Monthly</label>
          <label className="flex cursor-pointer items-center gap-1.5"><input type="radio" name="billing-cycle" value="Yearly" checked={billing === "Yearly"} onChange={() => setBilling("Yearly")} className="h-3 w-3 accent-[#5B7CFF]" />Yearly (20% save)</label>
        </fieldset>
        <p className="my-4 text-center text-[11px] leading-5 text-[#30364E]">Change takes effect immediately. Prorated billing applied. Previous plan data retained.</p>
        <div className="flex gap-2">
          <DialogClose asChild><Button variant="outline" className="h-9 w-[88px] cursor-pointer rounded border-[#8D96AC] bg-white text-[11px] font-normal text-[#171C35] shadow-none hover:bg-[#F5F6FF]">Back</Button></DialogClose>
          <Button disabled={unchanged} onClick={() => { onApply(selectedPlan, billing); setOpen(false); }} className="h-9 min-w-0 flex-1 cursor-pointer rounded bg-[#5B7CF3] px-2 text-[11px] font-normal text-white hover:bg-[#4B6CE3]">{unchanged ? "Current Plan" : selectedPlan === currentPlan ? `Switch to ${billing} Billing` : `Switch to ${selectedPlan} Plan`}</Button>
        </div>
      </DialogPrimitive.Content>
    </DialogPortal>
  </Dialog>;
}

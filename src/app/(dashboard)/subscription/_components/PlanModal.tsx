"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { CircleCheck, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useSubscriptionQuery } from "@/hooks/use-subscription-query";
import { type ApiPlan, type BillingCycle, type PlanInput, type PlanType } from "@/lib/subscription-api";
import SubscriptionQueryState from "../../_components/SubscriptionQueryState";
import { usePlans } from "./PlanProvider";

const inputClass = "mt-1.5 block min-h-10 w-full rounded-lg border-0 bg-[#F5F6FF] px-3 py-2.5 text-sm text-[#30334C] placeholder:text-[#929AC0] focus-visible:outline-2 focus-visible:outline-[#607AFF]";
const limitFields = [
  { key: "aiActionsPerMonth", label: "AI actions per month", min: 0 },
  { key: "crmContactsLimit", label: "CRM contacts", min: 0 },
  { key: "callMinutesPerMonth", label: "Call minutes per month", min: 0 },
  { key: "meetingHoursPerMonth", label: "Meeting hours per month", min: 0 },
  { key: "usersIncluded", label: "Users included", min: 1 },
  { key: "aiAgentsIncluded", label: "AI agents included", min: 0 },
  { key: "trialDays", label: "Free trial days", min: 0 },
] as const;

function PlanForm({ plan, onClose }: { plan?: ApiPlan; onClose: () => void }) {
  const { savePlan, saving, setBillingCycle } = usePlans();
  const submitting = useRef(false);
  const initialCycles = plan?.billingCycles ?? ["month"];
  const [billing, setBilling] = useState(plan?.isInquiryOnly ? "custom" : initialCycles.length === 2 ? "both" : initialCycles[0]);
  const [features, setFeatures] = useState(plan?.features ?? [""]);
  const [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const tagline = String(data.get("tagline") ?? "").trim();
    if (name.length < 2) { setError("Plan title must contain at least two characters."); return; }
    const number = (key: string) => data.get(key) === "" || data.get(key) === null ? undefined : Number(data.get(key));
    const priceUsd = number("priceUsd");
    const annualPriceUsd = number("annualPriceUsd");
    if (billing !== "custom" && (priceUsd === undefined || !Number.isFinite(priceUsd) || priceUsd < 0)) { setError("Enter a valid monthly price."); return; }
    if ((billing === "year" || billing === "both") && (annualPriceUsd === undefined || !Number.isFinite(annualPriceUsd) || annualPriceUsd < 0)) { setError("Enter a valid annual price."); return; }
    const billingCycles: BillingCycle[] = billing === "both" ? ["month", "year"] : billing === "custom" ? initialCycles : [billing as BillingCycle];
    const limits: Partial<PlanInput> = {};
    for (const field of limitFields) {
      const value = number(field.key);
      if (value !== undefined && (!Number.isSafeInteger(value) || value < field.min)) { setError(`Enter a valid value for ${field.label.toLowerCase()}.`); return; }
      limits[field.key] = value;
    }
    const body: PlanInput = {
      planType: String(data.get("planType")) as PlanType, name, tagline,
      billingCycles, isInquiryOnly: billing === "custom",
      ...(billing !== "custom" ? { priceUsd, ...(annualPriceUsd !== undefined ? { annualPriceUsd } : {}) } : {}),
      ...limits, features: [...new Set(features.map(value => value.trim()).filter(Boolean))],
      isActive: data.get("isActive") === "on",
    };
    submitting.current = true;
    setError("");
    try {
      await savePlan({ id: plan?._id, body });
      setBillingCycle(billingCycles.includes("month") ? "month" : "year");
      toast.success(plan ? "Plan updated successfully." : "Plan created successfully.");
      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unable to save the plan.");
    } finally { submitting.current = false; }
  }
  return <form onSubmit={submit} className="space-y-4">
    <fieldset disabled={saving} className="space-y-4 disabled:opacity-70">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block text-xs text-[#929AC0]">Plan Title<input autoFocus name="name" required minLength={2} maxLength={80} defaultValue={plan?.name} placeholder="e.g. Starter" className={inputClass} /></label>
        <label className="block text-xs text-[#929AC0]">Plan Type<select name="planType" defaultValue={plan?.planType ?? "STARTER"} className={inputClass}>{["STARTER", "GROWTH", "ENTERPRISE", "CUSTOM"].map(value => <option key={value} value={value}>{value}</option>)}</select></label>
      </div>
      <label className="block text-xs text-[#929AC0]">Plan Subtitle<textarea name="tagline" maxLength={160} defaultValue={plan?.tagline} placeholder="For solo operators and early-stage businesses." rows={2} className={inputClass} /></label>
      <label className="block text-xs text-[#929AC0]">Billing Type<select value={billing} onChange={event => setBilling(event.target.value)} className={inputClass}><option value="month">Monthly</option><option value="year">Yearly</option><option value="both">Monthly and yearly</option><option value="custom">Variable pricing</option></select></label>
      {billing !== "custom" && <div className="grid gap-3 sm:grid-cols-2">
        <label className="block text-xs text-[#929AC0]">Monthly Price ($)<input name="priceUsd" type="number" min="0" step="0.01" required defaultValue={plan?.priceUsd ?? ""} placeholder="e.g. 49.00" className={inputClass} /></label>
        {(billing === "year" || billing === "both") && <label className="block text-xs text-[#929AC0]">Yearly Price ($)<input name="annualPriceUsd" type="number" min="0" step="0.01" required defaultValue={plan?.annualPriceUsd ?? ""} placeholder="Full annual total" className={inputClass} /></label>}
      </div>}
      <fieldset><legend className="mb-2 text-xs text-[#929AC0]">Included Monthly Usage & Support</legend><div className="grid gap-3 sm:grid-cols-2">{limitFields.map(field => <label key={field.key} className="block text-xs text-[#929AC0]">{field.label}<input type="number" name={field.key} min={field.min} step="1" required={plan?.[field.key] !== undefined} defaultValue={plan?.[field.key] ?? ""} placeholder="Not specified" className={inputClass} /></label>)}</div></fieldset>
      <fieldset className="space-y-2">
        <legend className="mb-2 w-full text-xs text-[#929AC0]"><span className="flex items-center justify-between">Core Capabilities<button type="button" onClick={() => setFeatures(current => [...current, ""])} className="flex cursor-pointer items-center gap-1 rounded-md bg-[#5D7BF5] px-2.5 py-1.5 text-xs text-white"><Plus className="size-3.5" />Add</button></span></legend>
        {features.map((value, index) => <div key={index} className="flex items-center gap-2 rounded border border-[#F0F2FA] px-2.5 py-1.5">
          <CircleCheck className="size-3.5 shrink-0 text-[#607AFF]" />
          <input aria-label={`Capability ${index + 1}`} value={value} onChange={event => setFeatures(current => current.map((item, i) => i === index ? event.target.value : item))} placeholder="Add a feature" className="min-w-0 flex-1 rounded px-1 py-1.5 text-sm text-[#30334C] outline-[#607AFF] placeholder:text-[#929AC0]" />
          <button type="button" aria-label={`Delete capability ${index + 1}`} onClick={() => setFeatures(current => current.filter((_, i) => i !== index))} className="cursor-pointer rounded p-1.5 text-[#FF5057] hover:bg-red-50"><Trash2 className="size-4" /></button>
        </div>)}
      </fieldset>
      <label className="flex items-center gap-2 text-xs text-[#737D95]"><input type="checkbox" name="isActive" defaultChecked={plan?.isActive ?? true} className="accent-[#5D7BF5]" />Active plan</label>
    </fieldset>
    {error && <p role="alert" className="text-sm text-red-500">{error}</p>}
    <div className="sticky -bottom-5 grid grid-cols-2 gap-3 border-t border-[#F0F2FA] bg-white py-3">
      <button type="button" disabled={saving} onClick={onClose} className="min-h-10 cursor-pointer rounded-md border border-[#607AFF] text-sm text-[#607AFF] hover:bg-[#F5F6FF] disabled:opacity-50">Cancel</button>
      <button type="submit" disabled={saving} className="min-h-10 cursor-pointer rounded-md bg-[#5D7BF5] text-sm text-white hover:bg-[#4968E8] disabled:opacity-50">{saving ? "Saving…" : plan ? "Save Changes" : "Add Plan"}</button>
    </div>
  </form>;
}

export default function PlanModal({ planId }: { planId?: string }) {
  const router = useRouter();
  const { saving } = usePlans();
  const query = useSubscriptionQuery<ApiPlan>(["plan", planId], `/subscription-plans/${encodeURIComponent(planId ?? "")}`, Boolean(planId));
  const close = () => router.push("/subscription");
  return <Dialog open onOpenChange={open => { if (!open && !saving) close(); }}>
    <DialogContent showCloseButton={!saving} onEscapeKeyDown={event => { if (saving) event.preventDefault(); }} onInteractOutside={event => { if (saving) event.preventDefault(); }} overlayClassName="bg-[#171C35]/15 backdrop-blur-[3px]" className="max-h-[90dvh] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden rounded-xl border-0 bg-white p-5 sm:max-w-[664px] [&>button]:flex [&>button]:size-6 [&>button]:items-center [&>button]:justify-center [&>button]:rounded-full [&>button]:border [&>button]:border-[#929AC0] [&>button]:text-[#929AC0]">
      <DialogHeader className="border-b border-[#F0F2FA] pb-3 text-left"><DialogTitle className="pr-7 text-base font-medium text-[#171C35]">{planId ? "Edit Subscription Plan" : "Add new Subscription Plans"}</DialogTitle><DialogDescription className="text-xs text-[#929AC0]">Set pricing, included usage, and features for this plan.</DialogDescription></DialogHeader>
      {query.error || (planId && query.isPending) ? <SubscriptionQueryState error={query.error} retry={() => void query.refetch()} /> : <PlanForm key={planId ?? "new"} plan={planId ? query.data : undefined} onClose={close} />}
    </DialogContent>
  </Dialog>;
}

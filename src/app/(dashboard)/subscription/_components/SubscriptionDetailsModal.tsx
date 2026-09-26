"use client";

import { Building2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useSubscriptionQuery } from "@/hooks/use-subscription-query";
import { usd } from "@/lib/subscription-api";
import { billingLabel, subscriptionDate, type SubscriptionDetails } from "@/lib/subscriptions-admin";
import SubscriptionQueryState from "../../_components/SubscriptionQueryState";
import SubscriptionStatusBadge from "./SubscriptionStatusBadge";

export default function SubscriptionDetailsModal({ id, onClose }: { id: string; onClose: () => void }) {
  const query = useSubscriptionQuery<SubscriptionDetails>(["purchased-detail", id], `/subscriptions-admin/${encodeURIComponent(id)}`);
  const data = query.data;
  const address = data?.organization?.address;
  return <Dialog open onOpenChange={open => { if (!open) onClose(); }}>
    <DialogContent overlayClassName="bg-[#171C35]/20 backdrop-blur-[3px]" className="max-h-[90dvh] overflow-y-auto rounded-2xl border-0 bg-white p-5 sm:max-w-[720px] sm:p-6">
      <DialogHeader className="border-b border-[#EDF0FA] pb-4 text-left">
        <DialogTitle className="pr-8 text-lg font-semibold text-[#171C35]">Subscription Details</DialogTitle>
        <DialogDescription className="break-all text-xs text-[#929AC0]">Subscription ID: {id}</DialogDescription>
      </DialogHeader>
      {query.isPending || query.error ? <SubscriptionQueryState error={query.error} retry={() => void query.refetch()} /> : data && <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[#F5F6FF] p-4">
          <div className="flex min-w-0 items-center gap-3"><span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#E8EDFF] text-[#607AFF]"><Building2 className="size-5" /></span><div className="min-w-0"><h3 className="break-words text-base font-semibold text-[#171C35]">{data.organization?.name ?? "Unknown organization"}</h3><p className="mt-1 text-sm text-[#737D95]">{data.plan?.name ?? "Unknown plan"}</p></div></div>
          <SubscriptionStatusBadge status={data.status} />
        </div>
        <section><h3 className="mb-3 text-sm font-semibold text-[#30334C]">Billing & Renewal</h3><dl className="grid grid-cols-2 gap-4 rounded-xl border border-[#EDF0FA] p-4">
          {[["Billing cycle", billingLabel(data.billingCycle)], ["Monthly recurring revenue", usd(data.mrrUsd)], ["Current period starts", subscriptionDate(data.currentPeriodStart)], ["Next renewal", subscriptionDate(data.nextRenewal)], ["Paused until", subscriptionDate(data.pausedUntil)], ["Cancel at period end", data.cancelAtPeriodEnd ? "Yes" : "No"], ["Created", subscriptionDate(data.createdAt)], ["Last updated", subscriptionDate(data.updatedAt)]].map(([label, value]) => <div key={label}><dt className="text-xs text-[#929AC0]">{label}</dt><dd className="mt-1 text-sm font-medium text-[#30334C]">{value}</dd></div>)}
        </dl></section>
        <section><h3 className="mb-3 text-sm font-semibold text-[#30334C]">Organization</h3><dl className="space-y-3 rounded-xl border border-[#EDF0FA] p-4">
          {[["Email", data.organization?.emailAddress ?? "—"], ["Phone", data.organization?.phoneNumber ?? "—"], ["Status", data.organization?.status ?? "—"], ["Address", address ? [address.street, address.city, address.state, address.postalCode].filter(Boolean).join(", ") || "—" : "—"]].map(([label, value]) => <div key={label} className="grid grid-cols-[80px_1fr] gap-4 text-sm"><dt className="text-[#929AC0]">{label}</dt><dd className="break-words text-[#30334C]">{value}</dd></div>)}
        </dl></section>
        <section><h3 className="mb-3 text-sm font-semibold text-[#30334C]">Purchased Add-ons</h3>{data.activeAddons.length ? <div className="space-y-2">{data.activeAddons.map(addon => <div key={`${addon.addonProductId}-${addon.tierIndex}`} className="flex items-center justify-between gap-4 rounded-lg bg-[#F5F6FF] p-3"><div><p className="text-sm font-medium text-[#30334C]">{addon.label}</p><p className="mt-1 text-xs text-[#929AC0]">Quantity: {addon.quantity.toLocaleString("en-US")}</p></div><span className="shrink-0 text-sm font-semibold text-[#00865F]">{usd(addon.priceUsd)}</span></div>)}</div> : <p className="rounded-lg bg-[#F5F6FF] p-4 text-sm text-[#929AC0]">No active add-ons.</p>}</section>
        <details className="rounded-xl border border-[#EDF0FA] p-4"><summary className="cursor-pointer text-sm font-medium text-[#737D95]">Payment references</summary><dl className="mt-3 space-y-3 text-xs">{[["Stripe customer", data.stripeCustomerId], ["Stripe subscription", data.stripeSubscriptionId]].map(([label, value]) => <div key={label}><dt className="text-[#929AC0]">{label}</dt><dd className="mt-1 break-all text-[#30334C]">{value ?? "—"}</dd></div>)}</dl></details>
      </div>}
      <div className="flex justify-end border-t border-[#EDF0FA] pt-4"><button type="button" onClick={onClose} className="cursor-pointer rounded-lg bg-[#5D7BF5] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#4968E8]">Close</button></div>
    </DialogContent>
  </Dialog>;
}

"use client";
import { FileText } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useSubscriptionQuery } from "@/hooks/use-subscription-query";
import { usd } from "@/lib/subscription-api";
import { billingLabel, subscriptionDate } from "@/lib/subscriptions-admin";
import type { Invoice } from "@/lib/invoices-api";
import SubscriptionQueryState from "../../_components/SubscriptionQueryState";
import InvoiceStatusBadge from "./InvoiceStatusBadge";
import InvoiceDownloadButton from "./InvoiceDownloadButton";

export default function InvoiceDetailsModal({ id, onClose }: { id: string; onClose: () => void }) {
  const query = useSubscriptionQuery<Invoice>(["invoice-detail", id], `/invoices/${encodeURIComponent(id)}`);
  const data = query.data;
  return <Dialog open onOpenChange={open => { if (!open) onClose(); }}><DialogContent overlayClassName="bg-[#171C35]/20 backdrop-blur-[3px]" className="max-h-[90dvh] overflow-y-auto rounded-2xl border-0 bg-white p-5 sm:max-w-[640px] sm:p-6">
    <DialogHeader className="border-b border-[#EDF0FA] pb-4 text-left"><DialogTitle className="pr-8 text-lg font-semibold text-[#171C35]">Invoice Details</DialogTitle><DialogDescription className="break-all text-xs text-[#929AC0]">{data?.invoiceId ?? id}</DialogDescription></DialogHeader>
    {query.isPending || query.error ? <SubscriptionQueryState error={query.error} retry={() => void query.refetch()} /> : data && <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[#F5F6FF] p-4"><div className="flex min-w-0 items-center gap-3"><span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#E8EDFF] text-[#607AFF]"><FileText className="size-5" /></span><div><h3 className="break-words text-base font-semibold text-[#171C35]">{data.organizationName}</h3><p className="mt-1 text-sm text-[#737D95]">{data.planName ?? "Unknown plan"}</p></div></div><InvoiceStatusBadge status={data.status} /></div>
      <dl className="grid grid-cols-2 gap-5 rounded-xl border border-[#EDF0FA] p-4">{[["Invoice number", data.invoiceId], ["Amount", usd(data.amountUsd)], ["Billing cycle", billingLabel(data.billingInterval)], ["Issued date", subscriptionDate(data.issuedAt)], ["Period starts", subscriptionDate(data.periodStart)], ["Period ends", subscriptionDate(data.periodEnd)]].map(([label, value]) => <div key={label}><dt className="text-xs text-[#929AC0]">{label}</dt><dd className="mt-1 break-words text-sm font-medium text-[#30334C]">{value}</dd></div>)}</dl>
      <details className="rounded-xl border border-[#EDF0FA] p-4"><summary className="cursor-pointer text-sm font-medium text-[#737D95]">Payment references</summary><dl className="mt-3 space-y-3 text-xs">{[["Invoice record", data.id], ["Stripe invoice", data.stripeInvoiceId], ["Stripe subscription", data.stripeSubscriptionId]].map(([label, value]) => <div key={label}><dt className="text-[#929AC0]">{label}</dt><dd className="mt-1 break-all text-[#30334C]">{value ?? "—"}</dd></div>)}</dl></details>
    </div>}
    <div className="flex justify-end gap-3 border-t border-[#EDF0FA] pt-4">{data && !query.error && <InvoiceDownloadButton id={id} label={data.invoiceId} />}<button type="button" onClick={onClose} className="cursor-pointer rounded-lg bg-[#5D7BF5] px-6 py-2 text-sm font-medium text-white hover:bg-[#4968E8]">Close</button></div>
  </DialogContent></Dialog>;
}

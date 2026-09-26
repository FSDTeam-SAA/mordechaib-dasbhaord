"use client";

import { useEffect, useState } from "react";
import { Building2, ChevronLeft, ChevronRight, Eye, Search } from "lucide-react";
import { useSubscriptionQuery } from "@/hooks/use-subscription-query";
import { usd, type PlanType } from "@/lib/subscription-api";
import { billingLabel, paginationPages, subscriptionDate, subscriptionStatuses, subscriptionsPath, type PurchasedSubscriptions, type SubscriptionFilters, type SubscriptionStatus } from "@/lib/subscriptions-admin";
import SubscriptionQueryState from "../../_components/SubscriptionQueryState";
import SubscriptionDetailsModal from "./SubscriptionDetailsModal";
import SubscriptionStatusBadge from "./SubscriptionStatusBadge";

const planColors: Record<PlanType, string> = {
  STARTER: "bg-[#EFF2FF] text-[#526BD1]", GROWTH: "bg-[#E5F8F5] text-[#008D9E]", ENTERPRISE: "bg-[#FCECFB] text-[#AF38B1]", CUSTOM: "bg-[#FFF5E3] text-[#A56B00]",
};
const selectClass = "h-11 cursor-pointer rounded-lg border border-[#E6EAF5] bg-white px-3 text-sm text-[#68738D] outline-[#607AFF]";

export default function SubscriptionsTab() {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<SubscriptionFilters>({ search: "", planType: "", status: "", page: 1, limit: 9 });
  const [detailsId, setDetailsId] = useState<string | null>(null);
  useEffect(() => {
    const timeout = setTimeout(() => setFilters(current => current.search === search.trim() ? current : { ...current, search: search.trim(), page: 1 }), 300);
    return () => clearTimeout(timeout);
  }, [search]);
  const query = useSubscriptionQuery<PurchasedSubscriptions>(["purchased", filters], subscriptionsPath(filters));
  const data = query.data;
  const rows = data?.items ?? [];
  const pages = paginationPages(data?.page ?? filters.page, data?.totalPages ?? 0);
  const busy = query.isPending || query.isFetching;
  const page = data?.page ?? filters.page;
  const total = data?.total ?? 0;
  const start = data ? (data.page - 1) * data.limit : 0;
  const changePage = (value: number) => setFilters(current => ({ ...current, page: value }));

  return <div className="rounded-xl bg-[#F5F6FF] p-2 sm:p-3">
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <div className="flex h-11 w-full items-center gap-2.5 rounded-lg border border-[#E6EAF5] bg-white px-3.5 text-[#929AC0] sm:w-[320px]">
        <Search className="size-[18px] shrink-0" strokeWidth={1.7} /><input aria-label="Search organizations" value={search} onChange={event => setSearch(event.target.value)} placeholder="Search organizations..." className="h-full min-w-0 flex-1 bg-transparent text-sm text-[#30334C] outline-none placeholder:text-[#929AC0]" />
      </div>
      <div className="flex flex-wrap gap-3">
        <select aria-label="Filter by plan" value={filters.planType} onChange={event => setFilters(current => ({ ...current, planType: event.target.value as PlanType | "", page: 1 }))} className={selectClass}><option value="">All Plans</option>{Object.keys(planColors).map(value => <option key={value} value={value}>{value[0] + value.slice(1).toLowerCase()}</option>)}</select>
        <select aria-label="Filter by status" value={filters.status} onChange={event => setFilters(current => ({ ...current, status: event.target.value as SubscriptionStatus | "", page: 1 }))} className={selectClass}><option value="">All Status</option>{Object.entries(subscriptionStatuses).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>
      </div>
    </div>
    <div className="overflow-hidden rounded-xl border border-[#E6EAF5] bg-white shadow-[0_2px_12px_#30334C04]" aria-busy={busy}>
      <div className="overflow-x-auto"><table className="w-full min-w-[960px] text-left text-sm text-[#424B63]">
        <caption className="sr-only">Purchased subscriptions</caption>
        <thead className="border-b border-[#E6EAF5] bg-[#FAFBFF]"><tr>{["Organization", "Billing Cycle", "MRR", "Next Renewal", "Plan", "Status"].map(label => <th key={label} scope="col" className="whitespace-nowrap px-5 py-4 text-[13px] font-semibold text-[#737D95]">{label}</th>)}<th scope="col" className="w-20 px-5 py-4 text-right text-[13px] font-semibold text-[#737D95]">Action</th></tr></thead>
        <tbody className="divide-y divide-[#F0F2F8]">
          {!query.error && !query.isPending && rows.map(row => <tr key={row.id} className="transition-colors hover:bg-[#FAFBFF]">
            <td className="px-5 py-4"><div className="flex items-center gap-3"><span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#F0F3FF] text-[#7B8FE6]"><Building2 className="size-[18px]" strokeWidth={1.5} /></span><span title={row.organizationName} className="max-w-[220px] truncate font-medium text-[#242D43]">{row.organizationName}</span></div></td>
            <td className="whitespace-nowrap px-5 py-4">{billingLabel(row.billingInterval)}</td>
            <td className="whitespace-nowrap px-5 py-4 font-semibold tabular-nums text-[#008C68]">{usd(row.mrrUsd)}</td>
            <td className="whitespace-nowrap px-5 py-4 tabular-nums">{subscriptionDate(row.nextRenewal)}</td>
            <td className="px-5 py-4"><span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${row.planType ? planColors[row.planType] : "bg-[#F0F1F5] text-[#687087]"}`}>{row.planName}</span></td>
            <td className="px-5 py-4"><SubscriptionStatusBadge status={row.status} />{row.pausedUntil && new Date(row.pausedUntil).getTime() > Date.now() && <p className="mt-1.5 whitespace-nowrap text-xs text-[#A56B00]">Paused until {subscriptionDate(row.pausedUntil)}</p>}</td>
            <td className="px-5 py-4 text-right"><button type="button" title="View subscription details" aria-label={`View ${row.organizationName} subscription details`} onClick={() => setDetailsId(row.id)} className="ml-auto flex size-9 cursor-pointer items-center justify-center rounded-lg border border-[#DDE4FF] bg-[#F7F9FF] text-[#5D7BF5] transition-colors hover:border-[#99AAEF] hover:bg-[#EDF1FF] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#607AFF]"><Eye className="size-[18px]" strokeWidth={1.7} /></button></td>
          </tr>)}
          {(query.isPending || query.error) && <tr><td colSpan={7} className="p-5"><SubscriptionQueryState error={query.error} retry={() => void query.refetch()} /></td></tr>}
          {!query.isPending && !query.error && !rows.length && <tr><td colSpan={7} className="py-16 text-center text-sm text-[#929AC0]">No matching subscriptions found.{filters.page > 1 && <button type="button" onClick={() => changePage(1)} className="ml-2 cursor-pointer text-[#607AFF] underline">Go to first page</button>}</td></tr>}
        </tbody>
      </table></div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#E6EAF5] px-5 py-4 text-sm text-[#8490A7]">
        <p aria-live="polite">{query.isPending ? "Loading subscriptions…" : query.error ? "Unable to load subscriptions" : `Showing ${rows.length ? start + 1 : 0} to ${rows.length ? start + rows.length : 0} of ${total} results`}</p>
        <nav aria-label="Subscriptions pagination" className="flex items-center gap-1.5">
          <button type="button" aria-label="Previous page" disabled={busy || Boolean(query.error) || page <= 1} onClick={() => changePage(page - 1)} className="flex size-9 cursor-pointer items-center justify-center rounded-lg border border-[#DDE3F0] bg-white disabled:cursor-not-allowed disabled:opacity-40"><ChevronLeft className="size-4" /></button>
          {pages.map((value, index) => <span key={value} className="flex items-center gap-1.5">{index > 0 && value - pages[index - 1] > 1 && <span className="px-1">…</span>}<button type="button" aria-label={`Page ${value}`} aria-current={page === value ? "page" : undefined} disabled={busy || Boolean(query.error)} onClick={() => changePage(value)} className={`size-9 cursor-pointer rounded-lg border text-sm disabled:cursor-not-allowed ${page === value ? "border-[#5D7BF5] bg-[#5D7BF5] font-medium text-white" : "border-[#DDE3F0] bg-white hover:bg-[#F5F6FF]"}`}>{value}</button></span>)}
          <button type="button" aria-label="Next page" disabled={busy || Boolean(query.error) || page >= (data?.totalPages ?? 0)} onClick={() => changePage(page + 1)} className="flex size-9 cursor-pointer items-center justify-center rounded-lg border border-[#DDE3F0] bg-white disabled:cursor-not-allowed disabled:opacity-40"><ChevronRight className="size-4" /></button>
        </nav>
      </div>
    </div>
    {detailsId && <SubscriptionDetailsModal key={detailsId} id={detailsId} onClose={() => setDetailsId(null)} />}
  </div>;
}

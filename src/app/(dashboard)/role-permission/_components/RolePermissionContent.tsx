"use client";
import { useEffect, useState } from "react";
import { Eye, Pencil, Search, Users, UserRoundPlus, ChevronLeft, ChevronRight } from "lucide-react";
import { useSubscriptionQuery } from "@/hooks/use-subscription-query";
import { teamRoles, teamPermissions, type TeamPage } from "@/lib/team-api";
import { paginationPages, subscriptionDate } from "@/lib/subscriptions-admin";
import SubscriptionQueryState from "../../_components/SubscriptionQueryState";
import TeamMemberModal from "./TeamMemberModal";

export default function RolePermissionContent() {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ search: "", page: 1 });
  const [modal, setModal] = useState<{ id?: string; mode: "invite" | "edit" | "view" } | null>(null);
  useEffect(() => { const timer = setTimeout(() => setFilters(current => current.search === search.trim() ? current : { search: search.trim(), page: 1 }), 300); return () => clearTimeout(timer); }, [search]);
  const params = new URLSearchParams({ page: String(filters.page), limit: "10", ...(filters.search ? { search: filters.search } : {}) });
  const query = useSubscriptionQuery<TeamPage>(["team", "list", filters], `/team?${params}`);
  const data = query.data;
  const page = data?.page ?? filters.page;
  const totalPages = data?.pages ?? 1;
  const pages = paginationPages(page, totalPages);
  const busy = query.isPending || query.isFetching || Boolean(query.error);
  const start = data ? (data.page - 1) * data.limit : 0;
  const changePage = (next: number) => setFilters(current => ({ ...current, page: next }));
  const paginationClass = "flex size-9 cursor-pointer items-center justify-center rounded-lg border border-[#DDE3F0] bg-white hover:bg-[#F5F6FF] disabled:cursor-not-allowed disabled:opacity-40";
  const actionClass = "flex size-9 cursor-pointer items-center justify-center rounded-lg border border-[#DDE4FF] bg-[#F7F9FF] text-[#5D7BF5] hover:bg-[#EDF1FF]";
  return <div className="-m-4 min-h-[calc(100dvh-76px)] bg-[#F5F6FF] p-3 text-[#171C35] md:-m-6 md:p-4">
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><div className="flex h-11 w-full items-center gap-2 rounded-lg border border-[#E6EAF5] bg-white px-3 sm:w-[320px]"><Search className="size-5 text-[#929AC0]" /><input aria-label="Search members" placeholder="Search members..." value={search} onChange={event => setSearch(event.target.value)} className="h-full min-w-0 flex-1 text-sm outline-none placeholder:text-[#929AC0]" /></div><button onClick={() => setModal({ mode: "invite" })} className="flex h-11 cursor-pointer items-center gap-2 rounded-lg bg-[#5B7CFA] px-5 text-sm text-white hover:bg-[#496CEB]"><UserRoundPlus className="size-5" />Invite Member</button></div>
    <div className="mb-4 ml-auto flex items-center gap-4 rounded-xl border border-[#E6EAF5] bg-white p-5 sm:max-w-[320px]" aria-label="Total members" aria-busy={query.isPending}>
      <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#EEF2FF] text-[#5B7CFA]"><Users className="size-6" strokeWidth={1.6} /></span>
      <div><p className="text-sm text-[#929AC0]">Total Members</p><p aria-live="polite" className={`mt-1 text-3xl font-semibold tracking-tight text-[#171C35] ${query.isPending ? "animate-pulse" : ""}`}>{query.error || !data ? "—" : data.total.toLocaleString("en-US")}</p>{filters.search && <p className="mt-1 text-xs text-[#929AC0]">Matching your search</p>}</div>
    </div>
    <section className="overflow-hidden rounded-xl border border-[#E6EAF5] bg-white">
      <div className="overflow-x-auto"><table className="w-full min-w-[850px] text-left text-sm text-[#424B63]"><caption className="sr-only">Team members</caption><thead className="border-b border-[#E6EAF5] bg-[#FAFBFF]"><tr>{["Member", "Role", "Permissions", "Status", "Joined"].map(label => <th scope="col" key={label} className="px-5 py-4 text-xs font-semibold text-[#737D95]">{label}</th>)}<th scope="col" className="px-5 py-4 text-right text-xs font-semibold text-[#737D95]">Action</th></tr></thead><tbody className="divide-y divide-[#F0F2F8]">
        {query.isPending || query.error ? <tr><td colSpan={6} className="p-5"><SubscriptionQueryState error={query.error} retry={() => void query.refetch()} /></td></tr> : data?.items.length ? data.items.map(member => <tr key={member._id} className="hover:bg-[#FAFBFF]">
          <td className="px-5 py-4"><p className="font-medium text-[#242D43]">{member.name}</p><p className="mt-1 text-xs text-[#929AC0]">{member.email}</p></td>
          <td className="whitespace-nowrap px-5 py-4">{teamRoles[member.role] ?? member.role}</td>
          <td className="max-w-[320px] px-5 py-4"><div className="flex flex-wrap gap-1.5">{member.permissions.map(permission => <span key={permission} className="rounded-full bg-[#EEF2FF] px-2 py-1 text-xs text-[#597CFF]">{teamPermissions[permission] ?? permission}</span>)}</div></td>
          <td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-medium ${member.status === "ACTIVE" ? "bg-[#E4F8F0] text-[#00865F]" : "bg-red-50 text-red-500"}`}>{member.status === "ACTIVE" ? "Active" : "Suspended"}</span></td>
          <td className="whitespace-nowrap px-5 py-4">{subscriptionDate(member.createdAt)}</td>
          <td className="px-5 py-4"><div className="flex justify-end gap-2"><button aria-label={`View ${member.name}`} title="View member" onClick={() => setModal({ id: member._id, mode: "view" })} className={actionClass}><Eye className="size-4" /></button><button aria-label={`Edit ${member.name}`} title="Edit member" onClick={() => setModal({ id: member._id, mode: "edit" })} className={actionClass}><Pencil className="size-4" /></button></div></td>
        </tr>) : <tr><td colSpan={6} className="py-14 text-center text-[#929AC0]">No members found.</td></tr>}
      </tbody></table></div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#E6EAF5] px-5 py-4 text-sm text-[#8490A7]">
        <p aria-live="polite">{query.isPending ? "Loading members…" : query.error ? "Unable to load members" : `Showing ${data?.items.length ? start + 1 : 0} to ${data?.items.length ? start + data.items.length : 0} of ${data?.total ?? 0} results`}</p>
        <nav aria-label="Member pagination" className="flex items-center gap-1.5">
          <button type="button" aria-label="Previous page" disabled={busy || page <= 1} onClick={() => changePage(page - 1)} className={paginationClass}><ChevronLeft className="size-4" /></button>
          {pages.map((value, index) => <span key={value} className="flex items-center gap-1.5">
            {index > 0 && value - pages[index - 1] > 1 && <span className="px-1">…</span>}
            <button type="button" aria-label={`Page ${value}`} aria-current={page === value ? "page" : undefined} disabled={busy} onClick={() => changePage(value)} className={`size-9 cursor-pointer rounded-lg border text-sm disabled:cursor-not-allowed ${page === value ? "border-[#5D7BF5] bg-[#5D7BF5] font-medium text-white" : "border-[#DDE3F0] bg-white hover:bg-[#F5F6FF]"}`}>{value}</button>
          </span>)}
          <button type="button" aria-label="Next page" disabled={busy || page >= totalPages} onClick={() => changePage(page + 1)} className={paginationClass}><ChevronRight className="size-4" /></button>
        </nav>
      </div>
    </section>
    {modal && <TeamMemberModal key={`${modal.mode}-${modal.id ?? "new"}`} {...modal} onClose={() => setModal(null)} />}
  </div>;
}

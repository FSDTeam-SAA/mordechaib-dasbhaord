"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { organizations, planColors, statusColors } from "../organization-data";
import { ChevronLeft, ChevronRight, Eye, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

const pageSize = 9;

export default function OrganizationsTable() {
  const [search, setSearch] = useState("");
  const [plan, setPlan] = useState("all");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const searchRef = useRef<HTMLInputElement>(null);
  const query = search.trim().toLowerCase();
  const filtered = organizations.filter((item) => (!query || `${item.name} ${item.owner}`.toLowerCase().includes(query)) && (plan === "all" || item.plan === plan) && (status === "all" || item.status === status));
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const rows = filtered.slice((page - 1) * pageSize, page * pageSize);
  const pageNumbers = Array.from({ length: pageCount }, (_, index) => index + 1).filter((value) => value === 1 || value === pageCount || Math.abs(value - page) <= 1 || (page <= 2 && value <= 3) || (page >= pageCount - 1 && value >= pageCount - 2));

  useEffect(() => {
    const focusSearch = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); searchRef.current?.focus(); }
    };
    window.addEventListener("keydown", focusSearch);
    return () => window.removeEventListener("keydown", focusSearch);
  }, []);

  const paginationClass = "h-9 w-9 cursor-pointer rounded-[3px] border-[#B2BCDF] bg-transparent p-0 text-xs font-normal text-[#8C98C2] shadow-none hover:bg-[#E9EDFF] hover:text-[#597AFF]";

  return <section aria-label="Organizations">
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <div className="relative w-full sm:w-[300px]">
        <Search aria-hidden="true" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#929DC7]" strokeWidth={1.5} />
        <Input ref={searchRef} aria-label="Search organizations" placeholder="Search..." value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} className="h-10 rounded-md border-0 bg-white pl-10 pr-12 text-xs! text-[#252B43] shadow-none placeholder:text-[#939DC1] focus-visible:ring-[#BCC8FF]" />
        <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded bg-[#F9FAFF] px-1.5 py-1 text-[10px] text-[#939DC1]">⌘K</kbd>
      </div>
      <div className="flex gap-3 sm:gap-5">
        <Select value={plan} onValueChange={(value) => { setPlan(value); setPage(1); }}><SelectTrigger aria-label="Filter by plan" className="h-10! min-w-[110px] border-0 bg-white text-xs text-[#858593] shadow-none"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All Plans</SelectItem>{Object.keys(planColors).map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent></Select>
        <Select value={status} onValueChange={(value) => { setStatus(value); setPage(1); }}><SelectTrigger aria-label="Filter by status" className="h-10! min-w-[120px] border-0 bg-white text-xs text-[#858593] shadow-none"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All Status</SelectItem>{Object.keys(statusColors).map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent></Select>
      </div>
    </div>
    <div className="overflow-x-auto bg-white">
      <table className="w-full min-w-[850px] table-fixed border-collapse text-left text-xs text-[#222840]">
        <caption className="sr-only">Organizations, owners, employee counts, joining dates, plans and account statuses</caption>
        <thead><tr className="h-[68px] border-b border-[#EBEFFB] text-[14px] font-normal">
          <th scope="col" className="w-[18%] px-5 font-normal">Organization</th><th scope="col" className="w-[15%] px-3 font-normal">Owner</th><th scope="col" className="w-[14%] px-3 font-normal">Employees</th><th scope="col" className="w-[15%] px-3 font-normal">Joining date</th><th scope="col" className="w-[12%] px-3 text-center font-normal">Plan</th><th scope="col" className="w-[15%] px-3 text-center font-normal">Status</th><th scope="col" className="w-[11%] px-3 text-center font-normal">Action</th>
        </tr></thead>
        <tbody>
          {rows.map((organization) => <tr key={organization.id} className="h-[52px] hover:bg-[#FAFBFF]">
            <td className="px-5"><span title={organization.name} className="block truncate">{organization.name}</span></td><td className="px-3"><span className="block truncate" title={organization.owner}>{organization.owner}</span></td><td className="px-3 whitespace-nowrap">{organization.employees}</td><td className="px-3 whitespace-nowrap">{organization.joined}</td>
            <td className="px-2 text-center"><span className={cn("inline-flex whitespace-nowrap rounded-full px-2 py-1 text-xs leading-4", planColors[organization.plan])}>{organization.plan}</span></td>
            <td className="px-2 text-center"><span className={cn("inline-flex whitespace-nowrap rounded-full px-2 py-1 text-xs leading-4", statusColors[organization.status])}>{organization.status}</span></td>
            <td className="px-3 text-center"><Button asChild variant="outline" className="h-7 cursor-pointer gap-1 rounded-[10px] border-[#7891FF] bg-[#F8FAFF] px-2 text-[10px] font-normal text-[#597AFF] shadow-none hover:bg-[#EEF2FF] hover:text-[#3F60E8]"><Link href={`/organizations/${organization.id}`} aria-label={`Details for ${organization.name}`}><Eye className="size-3.5" strokeWidth={1.5} />Details</Link></Button></td>
          </tr>)}
          {!rows.length && <tr><td colSpan={7} className="h-52 text-center text-sm text-[#929AC0]">No organizations match your search or filters.</td></tr>}
        </tbody>
      </table>
      <div className="h-4" />
    </div>
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
      <p aria-live="polite" className="text-sm text-[#8D99C3]">Showing {filtered.length ? (page - 1) * pageSize + 1 : 0} to {Math.min(page * pageSize, filtered.length)} of {filtered.length} results</p>
      <nav aria-label="Organization pagination" className="flex items-center gap-1.5">
        <Button variant="outline" className={paginationClass} disabled={page === 1} aria-label="Previous page" onClick={() => setPage(page - 1)}><ChevronLeft className="size-4" /></Button>
        {pageNumbers.map((number, index) => <span key={number} className="flex gap-1.5">{index > 0 && number - pageNumbers[index - 1] > 1 && <span className={cn(paginationClass, "flex items-center justify-center border")} aria-hidden="true">...</span>}<Button variant="outline" className={cn(paginationClass, page === number && "border-[#5B7CF3] bg-[#5B7CF3] text-white hover:bg-[#4B6CE3] hover:text-white")} aria-label={`Page ${number}`} aria-current={page === number ? "page" : undefined} onClick={() => setPage(number)}>{number}</Button></span>)}
        <Button variant="outline" className={paginationClass} disabled={page === pageCount} aria-label="Next page" onClick={() => setPage(page + 1)}><ChevronRight className="size-4" /></Button>
      </nav>
    </div>

  </section>;
}

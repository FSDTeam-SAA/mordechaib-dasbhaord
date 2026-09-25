"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Download, Eye, Search, Trash2 } from "lucide-react";
import DeleteModal from "@/components/deleteModal/DeleteModal";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type Row = { id: string; organization: string; cycle: string; mrr: number; date: string; plan: string; status: string };
const organizations = ["NexaCore Solutions", "BrightWave Technologies", "QuantumLeap Systems", "Skyline Innovations", "BluePeak Dynamics", "Vertex Labs", "PulsePoint Software", "EchoStream Networks", "FusionGrid Corp"];
const planNames = ["Starter", "Growth", "Starter", "Growth", "Growth", "Enterprise", "Enterprise", "Starter", "Enterprise"];
const statuses = ["Active", "Active", "Suspended", "Active", "Suspended", "Active", "Suspended", "Pause for 30 days", "Active"];
const sampleRows: Row[] = Array.from({ length: 120 }, (_, index) => ({ id: `INV-${2847 + index}`, organization: `${organizations[index % 9]}${index < 9 ? "" : ` ${Math.floor(index / 9) + 1}`}`, cycle: index % 3 === 1 ? "Monthly" : "Annually", mrr: 200, date: "27 Aug 2020", plan: planNames[index % 9], status: statuses[index % 9] }));
const planColors: Record<string, string> = { Starter: "bg-[#EFF2FF] text-[#607AFF]", Growth: "bg-[#E5F8F5] text-[#00B5C7]", Enterprise: "bg-[#FCECFB] text-[#D94BDB]" };
const statusColors: Record<string, string> = { Active: "bg-[#E4F8F0] text-[#00B985]", Suspended: "bg-[#FFF0F0] text-[#FF5057]", "Pause for 30 days": "bg-[#FFF5E3] text-[#F5A000]" };
const actionClass = "inline-flex cursor-pointer items-center justify-center gap-1 rounded-md border border-[#8CA0FF] px-2 py-1 text-[10px] text-[#607AFF] hover:bg-[#EEF1FF] focus-visible:outline-2 focus-visible:outline-[#607AFF]";

function downloadInvoice(row: Row) {
  const content = ["Sample invoice — design preview", `Invoice: ${row.id}`, `Organization: ${row.organization}`, `Billing cycle: ${row.cycle}`, `Date: ${row.date}`, `Plan: ${row.plan}`, `MRR: $${row.mrr}`, `Status: ${row.status}`].join("\n");
  const url = URL.createObjectURL(new Blob([content], { type: "text/plain;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `${row.id}-preview.txt`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function BillingTable({ kind }: { kind: "subscriptions" | "invoices" }) {
  const invoices = kind === "invoices";
  const [rows, setRows] = useState(sampleRows);
  const [search, setSearch] = useState("");
  const [plan, setPlan] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [details, setDetails] = useState<Row | null>(null);
  const [deleting, setDeleting] = useState<Row | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const filtered = rows.filter(row => (!plan || row.plan === plan) && (!status || row.status === status) && `${row.organization} ${invoices ? row.id : ""}`.toLowerCase().includes(search.trim().toLowerCase()));
  const totalPages = Math.max(1, Math.ceil(filtered.length / 9));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * 9;
  const visible = filtered.slice(start, start + 9);
  const pages = Array.from(new Set([1, currentPage - 1, currentPage, currentPage + 1, 2, 3, totalPages])).filter(value => value > 0 && value <= totalPages).sort((a, b) => a - b);

  return <div className="rounded-lg bg-[#F5F6FF] p-2 sm:p-3">
    <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
      <div className="flex h-10 w-full items-center gap-2 rounded-md bg-white px-3 text-[#929AC0] sm:w-[280px]">
        <Search className="size-4 shrink-0" strokeWidth={1.5} />
        <input ref={searchRef} aria-label={invoices ? "Search invoices" : "Search organizations"} value={search} onChange={event => { setSearch(event.target.value); setPage(1); }} placeholder={invoices ? "Search invoices..." : "Search organizations..."} className="min-w-0 flex-1 bg-transparent text-xs text-[#30334C] outline-none placeholder:text-[#929AC0] focus-visible:ring-2 focus-visible:ring-[#607AFF]" />
      </div>
      <div className="flex gap-3">
        <select aria-label="Filter by plan" value={plan} onChange={event => { setPlan(event.target.value); setPage(1); }} className="h-10 cursor-pointer rounded-md border-0 bg-white px-3 text-xs text-[#85889B]"><option value="">All Plans</option>{Object.keys(planColors).map(value => <option key={value}>{value}</option>)}</select>
        <select aria-label="Filter by status" value={status} onChange={event => { setStatus(event.target.value); setPage(1); }} className="h-10 max-w-44 cursor-pointer rounded-md border-0 bg-white px-3 text-xs text-[#85889B]"><option value="">All Status</option>{Object.keys(statusColors).map(value => <option key={value}>{value}</option>)}</select>
      </div>
    </div>
    <div className="overflow-x-auto bg-white">
      <table className="w-full min-w-[800px] text-left text-xs text-[#30334C]">
        <caption className="sr-only">Sample {kind}</caption>
        <thead><tr className="border-b border-[#EDF0FA]">{[...(invoices ? ["Invoice ID"] : []), "Org Name", "Billing Cycle", "MRR", invoices ? "Date" : "Next Renewal", "Plan", "Status", "Action"].map(label => <th key={label} scope="col" className="whitespace-nowrap px-3 py-4 font-medium">{label}</th>)}</tr></thead>
        <tbody>{visible.map(row => <tr key={row.id} className="h-12 hover:bg-[#FAFBFF]">
          {invoices && <td className="px-3 py-3"><button onClick={() => setDetails(row)} className="cursor-pointer text-[#607AFF] hover:underline">{row.id}</button></td>}
          <td className="max-w-44 px-3 py-3"><span title={row.organization} className="block truncate">{row.organization}</span></td>
          <td className="px-3 py-3">{row.cycle}</td><td className="px-3 py-3 font-semibold text-[#00BB83]">${row.mrr}</td><td className="whitespace-nowrap px-3 py-3">{row.date}</td>
          <td className="px-3 py-3"><span className={`rounded-full px-2 py-1 text-[11px] ${planColors[row.plan]}`}>{row.plan}</span></td>
          <td className="whitespace-nowrap px-3 py-3"><span className={`rounded-full px-2 py-1 text-[11px] ${statusColors[row.status]}`}>{row.status}</span></td>
          <td className="px-3 py-3"><div className="flex items-center gap-2">
            {invoices ? <button aria-label={`Download ${row.id}`} onClick={() => downloadInvoice(row)} className={actionClass}><Download className="size-3" />Download</button> : <button aria-label={`View ${row.organization} details`} onClick={() => setDetails(row)} className={actionClass}><Eye className="size-3" />Details</button>}
            <button aria-label={`Delete ${invoices ? row.id : row.organization}`} onClick={() => setDeleting(row)} className="cursor-pointer rounded p-1 text-[#FF5057] hover:bg-red-50"><Trash2 className="size-3.5" /></button>
            {invoices && <button aria-label={`View ${row.id}`} onClick={() => setDetails(row)} className="cursor-pointer rounded-full bg-[#F0F3FF] p-1 text-[#607AFF]"><Eye className="size-3.5" /></button>}
          </div></td>
        </tr>)}</tbody>
      </table>
      {!visible.length && <div className="py-14 text-center text-sm text-[#929AC0]">No matching {kind} found.</div>}
    </div>
    <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-[#929AC0]">
      <p aria-live="polite">Showing {filtered.length ? start + 1 : 0} to {Math.min(start + 9, filtered.length)} of {filtered.length} results</p>
      <nav aria-label={`${kind} pagination`} className="flex items-center gap-1.5">
        <button aria-label="Previous page" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)} className="flex size-8 cursor-pointer items-center justify-center rounded border border-[#B8C2E9] bg-white disabled:cursor-not-allowed disabled:opacity-40"><ChevronLeft className="size-4" /></button>
        {pages.map((value, index) => <span key={value} className="flex items-center gap-1.5">{index > 0 && value - pages[index - 1] > 1 && <span className="px-1">…</span>}<button aria-label={`Page ${value}`} aria-current={currentPage === value ? "page" : undefined} onClick={() => setPage(value)} className={`size-8 cursor-pointer rounded border ${currentPage === value ? "border-[#5D7BF5] bg-[#5D7BF5] text-white" : "border-[#B8C2E9] hover:bg-white"}`}>{value}</button></span>)}
        <button aria-label="Next page" disabled={currentPage === totalPages} onClick={() => setPage(currentPage + 1)} className="flex size-8 cursor-pointer items-center justify-center rounded border border-[#B8C2E9] bg-white disabled:cursor-not-allowed disabled:opacity-40"><ChevronRight className="size-4" /></button>
      </nav>
    </div>
    <Dialog open={details !== null} onOpenChange={open => { if (!open) setDetails(null); }}><DialogContent><DialogHeader><DialogTitle>{invoices ? details?.id : details?.organization}</DialogTitle><DialogDescription>Sample {invoices ? "invoice" : "subscription"} details.</DialogDescription></DialogHeader>{details && <dl className="space-y-3 text-sm">{[["Organization", details.organization], ["Plan", details.plan], ["Billing cycle", details.cycle], ["MRR", `$${details.mrr}`], [invoices ? "Date" : "Next renewal", details.date], ["Status", details.status]].map(([label, value]) => <div key={label} className="flex justify-between gap-4 border-b border-[#EFF1FA] pb-2"><dt className="text-[#929AC0]">{label}</dt><dd className="text-right">{value}</dd></div>)}</dl>}</DialogContent></Dialog>
    <DeleteModal open={deleting !== null} onOpenChange={open => { if (!open) setDeleting(null); }} title={`Delete ${invoices ? "invoice" : "subscription"}?`} description="This removes the selected sample record from this preview only." onConfirm={() => { setRows(current => current.filter(row => row.id !== deleting?.id)); setDeleting(null); }} />
  </div>;
}

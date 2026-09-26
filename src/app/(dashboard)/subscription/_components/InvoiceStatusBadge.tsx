import { invoiceStatuses, type InvoiceStatus } from "@/lib/invoices-api";
const colors: Record<InvoiceStatus, string> = { PAID: "bg-[#E4F8F0] text-[#00865F]", OPEN: "bg-[#EEF2FF] text-[#526BD1]", DRAFT: "bg-[#F0F1F5] text-[#687087]", UNCOLLECTIBLE: "bg-[#FFF0F0] text-[#CF4249]", VOID: "bg-[#FFF4DF] text-[#A56B00]" };
export default function InvoiceStatusBadge({ status }: { status: InvoiceStatus }) {
  return <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${colors[status] ?? colors.DRAFT}`}><span className="size-1.5 rounded-full bg-current" />{invoiceStatuses[status] ?? status}</span>;
}

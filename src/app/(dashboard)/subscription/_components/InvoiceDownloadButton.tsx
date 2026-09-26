"use client";
import { useRef, useState } from "react";
import { Download, LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { safeInvoiceUrl } from "@/lib/invoices-api";

export default function InvoiceDownloadButton({ id, label }: { id: string; label: string }) {
  const [pending, setPending] = useState(false);
  const inFlight = useRef(false);
  async function download() {
    if (inFlight.current) return;
    inFlight.current = true;
    setPending(true);
    // Open within the click gesture so the eventual PDF is not popup-blocked.
    const tab = window.open("about:blank", "_blank");
    if (tab) tab.opener = null;
    try {
      const response = await fetch(`/api/invoices/${encodeURIComponent(id)}/download`, { cache: "no-store" });
      const result = await response.json();
      if (!response.ok || !result.url) throw new Error(result.message || "Unable to download the invoice.");
      const url = safeInvoiceUrl(result.url);
      if (tab) tab.location.replace(url);
      else window.location.assign(url);
    } catch (error) {
      tab?.close();
      toast.error(error instanceof Error ? error.message : "Unable to download the invoice.");
    } finally { inFlight.current = false; setPending(false); }
  }
  return <button type="button" title="Download invoice PDF" aria-label={`Download ${label}`} disabled={pending} onClick={download} className="inline-flex h-9 cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border border-[#DDE4FF] bg-[#F7F9FF] px-3 text-xs font-medium text-[#5D7BF5] hover:bg-[#EDF1FF] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#607AFF] disabled:cursor-wait disabled:opacity-60">{pending ? <LoaderCircle className="size-4 animate-spin" /> : <Download className="size-4" />}{pending ? "Preparing…" : "Download"}</button>;
}

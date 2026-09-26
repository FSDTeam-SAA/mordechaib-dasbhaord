import type { PlanType } from "./subscription-api";
export const invoiceStatuses = { DRAFT: "Draft", OPEN: "Open", PAID: "Paid", UNCOLLECTIBLE: "Uncollectible", VOID: "Void" } as const;
export type InvoiceStatus = keyof typeof invoiceStatuses;
export type Invoice = {
  id: string; invoiceId: string; organizationId: string; organizationName: string;
  planId?: string; planType?: PlanType; planName?: string; amountUsd: number;
  billingInterval?: string; status: InvoiceStatus; issuedAt: string;
  periodStart?: string; periodEnd?: string; invoicePdfUrl?: string; hostedInvoiceUrl?: string;
  stripeInvoiceId: string; stripeSubscriptionId?: string;
};
export type InvoicesPage = { items: Invoice[]; page: number; limit: number; total: number; totalPages: number };
export type InvoiceFilters = { search: string; planType: PlanType | ""; status: InvoiceStatus | ""; page: number; limit: number };
export function invoicesPath(filters: InvoiceFilters) {
  const params = new URLSearchParams({ page: String(filters.page), limit: String(filters.limit) });
  if (filters.search.trim()) params.set("search", filters.search.trim());
  if (filters.planType) params.set("planType", filters.planType);
  if (filters.status) params.set("status", filters.status);
  return `/invoices?${params}`;
}

export function safeInvoiceUrl(value: string): string {
  const url = new URL(value);
  if (url.protocol !== "https:" || url.username || url.password) throw new Error("The invoice download URL is invalid.");
  return url.href;
}

export class SubscriptionApiError extends Error {
  constructor(message: string, public status: number) { super(message); }
}

export async function subscriptionRequest<T>(path: string, token: string, options: { method?: "GET" | "POST" | "PATCH" | "DELETE"; body?: unknown; signal?: AbortSignal } = {}): Promise<T> {
  const base = process.env.NEXT_PUBLIC_BACKEND_API_URL?.replace(/\/+$/, "");
  if (!base) throw new Error("Backend API URL is not configured.");
  if (!token) throw new SubscriptionApiError("Please sign in to continue.", 401);
  const response = await fetch(`${base}/${path.replace(/^\/+/, "")}`, {
    method: options.method ?? "GET",
    headers: { Authorization: `Bearer ${token}`, ...(options.body !== undefined ? { "Content-Type": "application/json" } : {}) },
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    signal: options.signal,
    cache: "no-store",
  });
  const result = await response.json().catch(() => null);
  if (!response.ok || result?.success !== true) {
    const message = response.status === 401 ? "Your session has expired. Please sign in again."
      : response.status === 403 ? "Platform admin access is required."
      : Array.isArray(result?.message) ? result.message.join(". ")
      : typeof result?.message === "string" ? result.message : "Unable to load or save subscription data. Please try again.";
    throw new SubscriptionApiError(message, response.status);
  }
  if (result.data === undefined || result.data === null) throw new Error("The server returned an invalid response.");
  return result.data as T;
}

export type OverviewCards = {
  activeSubscriptions: { value: number; changePercentVsLastMonth: number | null };
  monthlyRevenueUsd: { value: number; changePercentVsLastMonth: number | null };
  annualRevenueUsd: { value: number; changePercentVsLastYear: number | null };
  renewalsThisMonth: { value: number; today: number };
};
export type RevenueOverviewData = {
  year: number;
  series: { month: string; mrrUsd: number }[];
  totals: { mrrUsd: number; arrUsd: number; growthPercent: number | null };
};
export type PlanDistribution = {
  totalSubscriptions: number;
  distribution: { planId: string; planType: string; name: string; count: number; percent: number }[];
  totalMrrUsd: number;
  mrrChangePercentVsLastMonth: number | null;
};
export type BillingCycle = "month" | "year";
export type PlanType = "STARTER" | "GROWTH" | "ENTERPRISE" | "CUSTOM";
export type PlanInput = {
  planType: PlanType;
  name: string;
  tagline?: string;
  priceUsd?: number;
  annualPriceUsd?: number;
  billingCycles: BillingCycle[];
  isInquiryOnly: boolean;
  aiActionsPerMonth?: number;
  crmContactsLimit?: number;
  callMinutesPerMonth?: number;
  meetingHoursPerMonth?: number;
  usersIncluded?: number;
  aiAgentsIncluded?: number;
  trialDays?: number;
  features: string[];
  isActive: boolean;
};
export type ApiPlan = PlanInput & {
  _id: string;
  activeSubscriberCount?: number;
  monthlyRevenueUsd?: number;
  annualRevenueUsd?: number;
};

export const usd = (value: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(value);
export const percent = (value: number | null) => value === null ? "N/A" : `${value > 0 ? "+" : ""}${value}%`;

export function planToCard(plan: ApiPlan) {
  const usage = [
    plan.aiActionsPerMonth != null ? `${plan.aiActionsPerMonth.toLocaleString("en-US")} AI Actions` : null,
    plan.crmContactsLimit != null ? `${plan.crmContactsLimit.toLocaleString("en-US")} CRM Contacts` : null,
    plan.callMinutesPerMonth != null ? `${plan.callMinutesPerMonth.toLocaleString("en-US")} call minutes` : null,
    plan.meetingHoursPerMonth != null ? `AI Meeting Capture - ${plan.meetingHoursPerMonth.toLocaleString("en-US")} hours` : null,
  ].filter((item): item is string => item !== null);
  return {
    id: plan._id, name: plan.name, description: plan.tagline ?? "",
    price: plan.isInquiryOnly ? null : plan.priceUsd ?? null,
    annualPrice: plan.annualPriceUsd,
    usage, capabilities: plan.features ?? [],
    support: plan.usersIncluded != null ? [`${plan.usersIncluded} ${plan.usersIncluded === 1 ? "user" : "users"} included`] : [],
    channels: [], isActive: plan.isActive,
    activeSubscriberCount: plan.activeSubscriberCount ?? 0,
    monthlyRevenueUsd: plan.monthlyRevenueUsd ?? 0,
  };
}

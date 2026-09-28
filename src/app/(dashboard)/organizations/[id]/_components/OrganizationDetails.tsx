"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useOrganizationsQuery } from "@/hooks/use-organizations-query";
import { businessSizeLabel, organizationDetailPath, organizationStatuses, updateOrganizationStatus, type OrganizationDetailsData } from "@/lib/organizations-api";
import { subscriptionDate } from "@/lib/subscriptions-admin";
import SubscriptionQueryState from "../../../_components/SubscriptionQueryState";
import { CalendarDays, CalendarRange, CircleDot, Cloud, Facebook, Instagram, Mail, Workflow } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ManagePlanDialog, { type BillingCycle } from "./ManagePlanDialog";
import type { Plan } from "../../organization-data";

import { cn } from "@/lib/utils";
import { planColors, statusColors } from "../../organization-data";

const tools = [
  { name: "Facebook", icon: Facebook, color: "text-[#1877F2]" },
  { name: "Instagram", icon: Instagram, color: "text-[#ED4092]" },
  { name: "Outlook Calendar", icon: CalendarDays, color: "text-[#008BEA]" },
  { name: "Google Calendar", icon: CalendarRange, color: "text-[#4285F4]" },
  { name: "Twilio", icon: CircleDot, color: "text-[#FF2847]" },
  { name: "Gmail", icon: Mail, color: "text-[#EA4335]" },
  { name: "Salesforce", icon: Cloud, color: "text-[#00A7E4]" },
  { name: "HubSpot CRM", icon: Workflow, color: "text-[#FF785B]" },
];

function DetailRow({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return <div className={cn("flex min-h-8 items-center justify-between gap-3 bg-[#F5F6FF] px-2 py-1.5", className)}><dt className="shrink-0 border-l-2 border-[#13C997] pl-2 text-[11px] text-[#929DC2]">{label}</dt><dd className="min-w-0 break-words text-right text-[11px] font-medium text-[#242940]">{children}</dd></div>;
}

export default function OrganizationDetails({ id }: { id: string }) {
  const query = useOrganizationsQuery<OrganizationDetailsData>(organizationDetailPath(id));
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  // Preserve the existing local-only interactions outside the three requested APIs.
  const [planSelection, setPlanSelection] = useState<{ plan: Plan; billing: BillingCycle } | null>(null);
  const [connectionSelections, setConnectionSelections] = useState<Record<string, boolean>>({});
  const mutation = useMutation({
    mutationFn: (status: "ACTIVE" | "SUSPENDED") => updateOrganizationStatus(id, status, session?.accessToken ?? ""),
    onSuccess: (data) => {
      queryClient.setQueryData(["organizations", session?.user.id, organizationDetailPath(id)], data);
      void queryClient.invalidateQueries({ queryKey: ["organizations"] });
      toast.success(`Organization ${data.organization.status === "ACTIVE" ? "activated" : "suspended"} successfully.`);
    },
    onError: (error) => toast.error(error.message),
  });
  if (query.isPending || query.error || !query.data) return <SubscriptionQueryState error={query.error} retry={() => void query.refetch()} />;
  const data = query.data;
  const organization = data.organization;
  const status = organizationStatuses[organization.status];
  const plan = planSelection?.plan ?? (data.subscription?.plan?.name || "—");
  const billingCycle = planSelection?.billing ?? (data.subscription?.billingInterval === "month" ? "Monthly" : data.subscription?.billingInterval === "year" ? "Yearly" : "—");
  const connections = data.connectedTools.items.map(item => ({ ...item, name: item.label, connected: connectionSelections[item.provider] ?? item.connected,
    icon: tools.find(tool => tool.name === item.label)?.icon ?? Workflow,
    color: tools.find(tool => tool.name === item.label)?.color ?? "text-[#597AFF]",
  }));
  const initials = organization.name.split(" ").slice(0, 2).map((word) => word[0]).join("");
  const fields = [
    { label: "Company Name", value: organization.name },
    { label: "Website", value: organization.website || "—" },
    { label: "Industry", value: organization.industry?.toLowerCase().replaceAll("_", " ") || "—" },
    { label: "Email address", value: organization.emailAddress || "—" },
    { label: "Phone", value: organization.phoneNumber || "—" },
    { label: "Team Size", value: businessSizeLabel(organization.businessSize) },
    { label: "Business hours", value: organization.businessHours ? `${organization.businessHours.start || "—"} to ${organization.businessHours.end || "—"}` : "—" },
    { label: "Language", value: organization.language === "en" ? "English" : organization.language || "—" },
    { label: "Owner", value: data.owner?.name || "—" },
    { label: "Company type", value: "—" },
  ];

  return <section aria-label={`${organization.name} details`}>
    <div className="mb-3 flex items-center justify-end gap-2">
      <Button variant="outline" disabled={mutation.isPending || query.isFetching} onClick={() => mutation.mutate(organization.status === "SUSPENDED" ? "ACTIVE" : "SUSPENDED")} className="h-9 cursor-pointer rounded-md border-[#FF6674] bg-white px-3 text-[11px] font-normal text-[#FF5665] shadow-none hover:bg-[#FFF0F2] hover:text-[#FF5665]">{mutation.isPending ? "Saving…" : status === "Suspended" ? "Activate" : "Suspend"}</Button>
      <ManagePlanDialog companyName={organization.name} currentPlan={plan} billingCycle={billingCycle} onApply={(nextPlan, nextBilling) => setPlanSelection({ plan: nextPlan, billing: nextBilling })} />
    </div>
    <div className="grid grid-cols-1 items-stretch gap-3 md:grid-cols-2">
      <Card className="min-w-0 gap-0 rounded-xl border-0 bg-white p-4 shadow-none md:p-5">
        <div className="mb-5 flex items-center justify-between gap-2"><h2 className="text-base font-medium">Company Details</h2><span aria-live="polite" className={cn("rounded-full px-2 py-1 text-[10px]", statusColors[status])}>{status}</span></div>
        <dl className="space-y-1.5">
          <DetailRow label="Company Logo" className="min-h-[62px]"><span aria-label={`${organization.name} logo`} className="flex h-10 w-10 -rotate-6 items-center justify-center rounded-lg border-2 border-[#FF6767] bg-white text-sm font-bold tracking-tight text-[#252B43]">{organization.logoUrl ? <Image unoptimized width={40} height={40} src={organization.logoUrl} alt={`${organization.name} logo`} className="h-full w-full rounded-lg object-contain" /> : initials}</span></DetailRow>
          {fields.map((field) => <DetailRow key={field.label} label={field.label}>{field.value}</DetailRow>)}
        </dl>
        <h3 className="mb-2 mt-3 text-xs font-medium">Service Address</h3>
        <dl className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
          <DetailRow label="City">{organization.address?.city || "—"}</DetailRow><DetailRow label="Street">{organization.address?.street || "—"}</DetailRow><DetailRow label="State">{organization.address?.state || "—"}</DetailRow><DetailRow label="State zip code">{organization.address?.postalCode || "—"}</DetailRow>
        </dl>
      </Card>
      <div className="flex min-w-0 flex-col gap-3">
        <Card className="gap-0 rounded-xl border-0 bg-white p-4 shadow-none md:p-5">
          <h2 className="mb-4 text-base font-medium">Subscription</h2>
          <dl className="space-y-1.5">
            <DetailRow label="Plan"><span aria-live="polite" className={cn("inline-block rounded-full px-3 py-0.5 text-[10px]", planColors[planSelection?.plan.toUpperCase() ?? data.subscription?.plan?.planType ?? ""])}>{plan}</span></DetailRow>
            <DetailRow label="Billing Cycle">{billingCycle}</DetailRow><DetailRow label="Joining Date">{subscriptionDate(organization.createdAt)}</DetailRow><DetailRow label="Renewal Date">{subscriptionDate(data.subscription?.nextRenewal)}</DetailRow>
          </dl>
        </Card>
        <Card className="flex-1 gap-0 rounded-xl border-0 bg-white p-4 shadow-none md:p-5">
          <h2 className="mb-3 text-base font-medium">Connected Tools</h2>
          <ul className="space-y-1.5">{connections.map((tool) => <li key={tool.provider} className="flex min-h-10 items-center justify-between gap-3 border-b border-[#F4F5FB] py-1 last:border-0"><span className="flex min-w-0 items-center gap-3 border-l-[3px] border-[#6282FF] py-1 pl-2"><tool.icon aria-hidden="true" className={cn("h-5 w-5 shrink-0", tool.color)} strokeWidth={2} /><span className="text-xs font-medium">{tool.name}</span></span><Button variant={tool.connected ? "default" : "outline"} aria-label={`${tool.connected ? "Disconnect" : "Connect"} ${tool.name}`} aria-pressed={tool.connected} onClick={() => setConnectionSelections((items) => ({ ...items, [tool.provider]: !tool.connected }))} className={cn("h-7 min-w-[76px] cursor-pointer rounded-md px-2 text-[10px] font-normal shadow-none", tool.connected ? "bg-[#5B7CFA] text-white hover:bg-[#4B6CEB]" : "border-[#A8B8FF] bg-white text-[#5B7CFA] hover:bg-[#F0F3FF]")}>{tool.connected ? "Connected" : "Connect"}</Button></li>)}</ul>
        </Card>
      </div>
    </div>
  </section>;
}

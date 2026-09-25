"use client";

import { useState, type ReactNode } from "react";
import { CalendarDays, CalendarRange, CircleDot, Cloud, Facebook, Instagram, Mail, Workflow } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ManagePlanDialog, { type BillingCycle } from "./ManagePlanDialog";
import { cn } from "@/lib/utils";
import { planColors, statusColors, type Organization, type Plan, type Status } from "../../organization-data";

const tools = [
  { name: "Facebook", icon: Facebook, color: "text-[#1877F2]", connected: true },
  { name: "Instagram", icon: Instagram, color: "text-[#ED4092]", connected: true },
  { name: "Outlook Calendar", icon: CalendarDays, color: "text-[#008BEA]", connected: true },
  { name: "Google Calendar", icon: CalendarRange, color: "text-[#4285F4]", connected: true },
  { name: "Twilio", icon: CircleDot, color: "text-[#FF2847]", connected: true },
  { name: "Gmail", icon: Mail, color: "text-[#EA4335]", connected: true },
  { name: "Salesforce", icon: Cloud, color: "text-[#00A7E4]", connected: true },
  { name: "HubSpot CRM", icon: Workflow, color: "text-[#FF785B]", connected: false },
];

function DetailRow({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return <div className={cn("flex min-h-8 items-center justify-between gap-3 bg-[#F5F6FF] px-2 py-1.5", className)}><dt className="shrink-0 border-l-2 border-[#13C997] pl-2 text-[11px] text-[#929DC2]">{label}</dt><dd className="min-w-0 break-words text-right text-[11px] font-medium text-[#242940]">{children}</dd></div>;
}

export default function OrganizationDetails({ organization }: { organization: Organization }) {
  const [status, setStatus] = useState<Status>(organization.status);
  const [plan, setPlan] = useState<Plan>(organization.plan);
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("Monthly");
  const [connections, setConnections] = useState(tools);
  const domain = `${organization.name.toLowerCase().replace(/[^a-z0-9]/g, "")}.com`;
  const initials = organization.name.split(" ").slice(0, 2).map((word) => word[0]).join("");
  const fields = [
    { label: "Company Name", value: organization.name },
    { label: "Website", value: `https://${domain}` },
    { label: "Industry", value: "Real Estate" },
    { label: "Email address", value: `john@${domain}` },
    { label: "Phone", value: "+1 (555) 123-4567" },
    { label: "Team Size", value: organization.employees },
    { label: "Business hours", value: "9:00 AM to 6:00 PM" },
    { label: "Language", value: "English" },
    { label: "Owner", value: organization.owner },
    { label: "Company type", value: "Private Company" },
  ];

  return <section aria-label={`${organization.name} details`}>
    <div className="mb-3 flex items-center justify-end gap-2">
      <Button variant="outline" onClick={() => setStatus(status === "Suspended" ? "Active" : "Suspended")} className="h-9 cursor-pointer rounded-md border-[#FF6674] bg-white px-3 text-[11px] font-normal text-[#FF5665] shadow-none hover:bg-[#FFF0F2] hover:text-[#FF5665]">{status === "Suspended" ? "Activate" : "Suspend"}</Button>
      <ManagePlanDialog companyName={organization.name} currentPlan={plan} billingCycle={billingCycle} onApply={(nextPlan, nextBilling) => { setPlan(nextPlan); setBillingCycle(nextBilling); }} />
    </div>
    <div className="grid grid-cols-1 items-stretch gap-3 md:grid-cols-2">
      <Card className="min-w-0 gap-0 rounded-xl border-0 bg-white p-4 shadow-none md:p-5">
        <div className="mb-5 flex items-center justify-between gap-2"><h2 className="text-base font-medium">Company Details</h2><span aria-live="polite" className={cn("rounded-full px-2 py-1 text-[10px]", statusColors[status])}>{status}</span></div>
        <dl className="space-y-1.5">
          <DetailRow label="Company Logo" className="min-h-[62px]"><span aria-label={`${organization.name} logo`} className="flex h-10 w-10 -rotate-6 items-center justify-center rounded-lg border-2 border-[#FF6767] bg-white text-sm font-bold tracking-tight text-[#252B43]">{initials}</span></DetailRow>
          {fields.map((field) => <DetailRow key={field.label} label={field.label}>{field.value}</DetailRow>)}
        </dl>
        <h3 className="mb-2 mt-3 text-xs font-medium">Service Address</h3>
        <dl className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
          <DetailRow label="City">Washington DC</DetailRow><DetailRow label="Street">821 road</DetailRow><DetailRow label="State">Washington DC</DetailRow><DetailRow label="State zip code">1234</DetailRow>
        </dl>
      </Card>
      <div className="flex min-w-0 flex-col gap-3">
        <Card className="gap-0 rounded-xl border-0 bg-white p-4 shadow-none md:p-5">
          <h2 className="mb-4 text-base font-medium">Subscription</h2>
          <dl className="space-y-1.5">
            <DetailRow label="Plan"><span aria-live="polite" className={cn("inline-block rounded-full px-3 py-0.5 text-[10px]", planColors[plan])}>{plan}</span></DetailRow>
            <DetailRow label="Billing Cycle">{billingCycle}</DetailRow><DetailRow label="Joining Date">{organization.joined}</DetailRow><DetailRow label="Renewal Date">27 Aug 2021</DetailRow>
          </dl>
        </Card>
        <Card className="flex-1 gap-0 rounded-xl border-0 bg-white p-4 shadow-none md:p-5">
          <h2 className="mb-3 text-base font-medium">Connected Tools</h2>
          <ul className="space-y-1.5">{connections.map((tool) => <li key={tool.name} className="flex min-h-10 items-center justify-between gap-3 border-b border-[#F4F5FB] py-1 last:border-0"><span className="flex min-w-0 items-center gap-3 border-l-[3px] border-[#6282FF] py-1 pl-2"><tool.icon aria-hidden="true" className={cn("h-5 w-5 shrink-0", tool.color)} strokeWidth={2} /><span className="text-xs font-medium">{tool.name}</span></span><Button variant={tool.connected ? "default" : "outline"} aria-label={`${tool.connected ? "Disconnect" : "Connect"} ${tool.name}`} aria-pressed={tool.connected} onClick={() => setConnections((items) => items.map((item) => item.name === tool.name ? { ...item, connected: !item.connected } : item))} className={cn("h-7 min-w-[76px] cursor-pointer rounded-md px-2 text-[10px] font-normal shadow-none", tool.connected ? "bg-[#5B7CFA] text-white hover:bg-[#4B6CEB]" : "border-[#A8B8FF] bg-white text-[#5B7CFA] hover:bg-[#F0F3FF]")}>{tool.connected ? "Connected" : "Connect"}</Button></li>)}</ul>
        </Card>
      </div>
    </div>
  </section>;
}

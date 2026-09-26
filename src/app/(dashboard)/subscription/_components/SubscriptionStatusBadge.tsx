import { subscriptionStatuses, type SubscriptionStatus } from "@/lib/subscriptions-admin";

const colors: Record<SubscriptionStatus, string> = {
  ACTIVE: "bg-[#E4F8F0] text-[#00865F]", TRIALING: "bg-[#EEF2FF] text-[#526BD1]",
  PAST_DUE: "bg-[#FFF4DF] text-[#A56B00]", CANCELED: "bg-[#FFF0F0] text-[#CF4249]", INCOMPLETE: "bg-[#F0F1F5] text-[#687087]",
};
export default function SubscriptionStatusBadge({ status }: { status: SubscriptionStatus }) {
  return <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${colors[status] ?? colors.INCOMPLETE}`}><span className="size-1.5 rounded-full bg-current" />{subscriptionStatuses[status] ?? status}</span>;
}

import { PlanProvider } from "./_components/PlanProvider";
import OverViewCard from "../_components/OverViewCard";
import RevenueOverview from "../_components/RevenueOverview";
import SubscriptionOverview from "../_components/SubscriptionOverview";
import SubscriptionContent from "./_components/SubscriptionContent";

export default function SubscriptionLayout({ children }: { children: React.ReactNode }) {
  return (
    <PlanProvider>
    <div className="-m-4 min-h-[calc(100dvh-76px)] bg-[#F5F6FF] p-3 text-[#171C35] md:-m-6 md:p-4">
      <div className="mx-auto flex w-full max-w-[1800px] flex-col gap-4">
        <OverViewCard />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <RevenueOverview />
          <SubscriptionOverview title="Plan Distribution" />
        </div>
        <SubscriptionContent />
        {children}
      </div>
    </div>
    </PlanProvider>
  );
}
 
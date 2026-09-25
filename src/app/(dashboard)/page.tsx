import OverViewCard from "./_components/OverViewCard";
import RevenueOverview from "./_components/RevenueOverview";
import SubscriptionOverview from "./_components/SubscriptionOverview";
import OrganizationGrowth from "./_components/OrganizationGrowth";
import AIWorkforce from "./_components/AIWorkforce";
import UpcomingMeeting from "./_components/UpcomingMeeting";
import RecentActivites from "./_components/RecentActivites";
import AlertsNotifications from "./_components/AlertsNotifications";

export default function DashboardPage() {
  return (
    <div className="-m-4 min-h-[calc(100dvh-76px)] bg-[#F5F6FF] p-3 text-[#171C35] md:-m-6 md:p-4">
      <div className="mx-auto flex w-full max-w-[1800px] flex-col gap-3">
        <OverViewCard />
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <RevenueOverview />
          <SubscriptionOverview />
          <OrganizationGrowth />
          <AIWorkforce />
        </div>
        <div className="grid grid-cols-1 items-stretch gap-3 xl:grid-cols-3">
          <UpcomingMeeting />
          <RecentActivites />
          <AlertsNotifications />
        </div>
      </div>
    </div>
  );
}

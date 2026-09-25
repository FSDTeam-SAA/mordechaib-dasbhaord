import { Card } from "@/components/ui/card";

const activities = [
  {
    title: "New org created — Acme Corp",
    description: "Acme Corporation joined the platform",
    time: "2m ago",
    border: "border-[#0BCB93]",
  },
  {
    title: "Subscription upgraded — TechFlow",
    description: "BlueStone Ltd Upgraded to Enterprise plan",
    time: "1h ago",
    border: "border-[#5B7CFF]",
  },
  {
    title: "User suspended — john@…",
    description: "John.doe@company.com was suspended",
    time: "2h ago",
    border: "border-[#D94BDB]",
  },
  {
    title: "AI Agent created",
    description: "Sales Assistant agent created by Admin",
    time: "3h ago",
    border: "border-[#0BCB93]",
  },
];

export default function RecentActivites() {
  return (
    <Card className="min-w-0 gap-0 rounded-xl border-0 bg-white p-5 shadow-none">
      <h2 className="border-b border-[#EFF1FA] pb-3 text-base font-medium text-[#171C35]">
        Recent Activities
      </h2>
      <ul className="mt-4 space-y-3">
        {activities.map((activity) => (
          <li
            key={activity.title}
            className={`min-w-0 rounded-xs border-l-[4px] py-0.5 pl-2 ${activity.border}`}
          >
            <div className="flex items-start justify-between gap-2">
              <p className="min-w-0 text-[11px] font-medium leading-4 text-[#171C35]">
                {activity.title}
              </p>
              <span className="shrink-0 text-[10px] leading-4 text-[#929AC0]">
                {activity.time}
              </span>
            </div>
            <p className="mt-1 text-[11px] leading-4 text-[#929AC0]">
              {activity.description}
            </p>
          </li>
        ))}
      </ul>
    </Card>
  );
}

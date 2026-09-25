import { BadgeCheck, ChartNoAxesCombined, LogIn } from "lucide-react";
import { Card } from "@/components/ui/card";

const alerts = [
  {
    id: 1,
    title: "High Error Rate Detected",
    description: "AI task failure rate is above 5%",
    time: "2m ago",
    icon: BadgeCheck,
    color: "bg-[#EEF1FF] text-[#5B7CFF]",
  },
  {
    id: 2,
    title: "Payment Failures",
    description: "3 Payments failed in the last hour",
    time: "1h ago",
    icon: LogIn,
    color: "bg-[#FFF7E7] text-[#FFAA17]",
  },
  {
    id: 3,
    title: "Payment Failures",
    description: "3 Payments failed in the last hour",
    time: "1h ago",
    icon: LogIn,
    color: "bg-[#FFF7E7] text-[#FFAA17]",
  },
  {
    id: 4,
    title: "Low Storage Warning",
    description: "Storage usage is above 85%",
    time: "2h ago",
    icon: ChartNoAxesCombined,
    color: "bg-[#FFF0F1] text-[#FF626B]",
  },
];

export default function AlertsNotifications() {
  return (
    <Card className="min-w-0 gap-0 rounded-xl border-0 bg-white p-5 shadow-none">
      <h2 className="border-b border-[#EFF1FA] pb-3 text-base font-medium text-[#171C35]">
        Alerts &amp; Notifications
      </h2>
      <ul className="mt-4 space-y-3">
        {alerts.map((alert) => (
          <li key={alert.id} className="flex items-start gap-2">
            <span
              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${alert.color}`}
            >
              <alert.icon className="h-3.5 w-3.5" strokeWidth={1.8} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex justify-between gap-2">
                <p className="text-[11px] font-medium leading-4 text-[#171C35]">
                  {alert.title}
                </p>
                <span className="shrink-0 text-[10px] leading-4 text-[#929AC0]">
                  {alert.time}
                </span>
              </div>
              <p className="mt-1 text-[11px] leading-4 text-[#929AC0]">
                {alert.description}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}

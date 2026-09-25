import { Card } from "@/components/ui/card";

const metrics = [
  { label: "AI Tasks Completed", value: "142,847", color: "text-[#597AFF]" },
  { label: "Calls Processed", value: "28,391", color: "text-[#D94BDB]" },
  { label: "CRM Automations", value: "67,234", color: "text-[#0BBC89]" },
  { label: "Emails Generated", value: "34,109", color: "text-[#F4A000]" },
  { label: "Meetings Scheduled", value: "12,903", color: "text-[#597AFF]" },
  { label: "Automation Rate", value: "87.3%", color: "text-[#0BBC89]" },
];

export default function AIWorkforce() {
  return (
    <Card className="min-w-0 gap-0 rounded-xl border-0 bg-white p-5 shadow-none">
      <h2 className="border-b border-[#EFF1FA] pb-3 text-base font-medium text-[#171C35]">
        AI Workforce Metrics
      </h2>
      <dl className="mt-3 flex flex-1 flex-col justify-between gap-2">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="flex min-h-8 items-center justify-between gap-3 bg-[#F5F6FF] py-2 pr-2.5"
          >
            <dt className="border-l-[3px] border-[#0BCB93] pl-2 text-[11px] text-[#929AC0]">
              {metric.label}
            </dt>
            <dd
              className={`text-[11px] font-medium tabular-nums ${metric.color}`}
            >
              {metric.value}
            </dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}

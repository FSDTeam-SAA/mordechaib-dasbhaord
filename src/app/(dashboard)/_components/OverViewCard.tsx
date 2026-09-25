"use client";

import {
  Building2,
  Crown,
  CircleDollarSign,
  ChartPie,
  TrendingUp,
} from "lucide-react";
import { Area, AreaChart } from "recharts";
import { Card } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";

const metrics = [
  {
    label: "Total Organizations",
    value: "312",
    change: "18%",
    icon: Building2,
    color: "#D94BDB",
    badge: "bg-[#FCEFFC] text-[#D94BDB]",
    points: [3, 12, 17, 14, 13, 31, 33, 28, 32, 52],
  },
  {
    label: "Active Subscriptions",
    value: "132",
    change: "18%",
    icon: Crown,
    color: "#5B7CFF",
    badge: "bg-[#ECF2FF] text-[#5B7CFF]",
    points: [4, 17, 14, 25, 19, 27, 24, 23, 38, 45, 58],
  },
  {
    label: "Monthly Revenue",
    value: "$48,291",
    change: "18%",
    icon: CircleDollarSign,
    color: "#0BBD89",
    badge: "bg-[#E8FAF3] text-[#0BBD89]",
    points: [4, 16, 14, 24, 19, 26, 23, 24, 38, 45, 57],
  },
  {
    label: "Monthly Churn Rate",
    value: "2.2%",
    change: "18%",
    icon: ChartPie,
    color: "#FF655E",
    badge: "bg-[#FFF6E8] text-[#FF655E]",
    points: [3, 15, 18, 15, 17, 34, 32, 28, 36, 59],
  },
];

export default function OverViewCard() {
  return (
    <section
      aria-label="Dashboard summary"
      className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 xl:grid-cols-4"
    >
      {metrics.map((metric) => (
        <Card
          key={metric.label}
          className="relative min-w-0 overflow-hidden rounded-xl border-0 bg-white p-4 shadow-none gap-0 min-h-[140px]"
        >
          <div
            className={`mb-2 flex h-9 w-9 items-center justify-center rounded-xl ${metric.badge}`}
          >
            <metric.icon className="h-[18px] w-[18px]" strokeWidth={1.5} />
          </div>
          <div className="relative z-10 w-fit">
            <p className="text-[22px] font-bold leading-7 tracking-tight text-[#171C35]">
              {metric.value}
            </p>
            <h2 className="mt-0.5 text-[12px] text-[#929AC0]">
              {metric.label}
            </h2>
            <div className="mt-1 flex items-center gap-1 text-[9px] text-[#929AC0]">
              <span
                className={`flex items-center rounded px-1 ${metric.badge}`}
              >
                <TrendingUp className="mr-0.5 h-2.5 w-2.5" />
                {metric.change}
              </span>
              <span>vs last week</span>
            </div>
          </div>
          <ChartContainer
            aria-label={`${metric.label} weekly trend`}
            config={{ value: { label: metric.label, color: metric.color } }}
            className="absolute bottom-3 right-3 h-[62px] w-[40%] aspect-auto"
          >
            <AreaChart
              data={metric.points.map((value) => ({ value }))}
              margin={{ top: 3, right: 1, bottom: 0, left: 1 }}
            >
              <Area
                dataKey="value"
                type={
                  metric.label === "Active Subscriptions" ||
                  metric.label === "Monthly Revenue"
                    ? "step"
                    : "monotone"
                }
                stroke={metric.color}
                fill={metric.color}
                fillOpacity={0.045}
                strokeWidth={1.1}
                isAnimationActive={false}
              />
            </AreaChart>
          </ChartContainer>
        </Card>
      ))}
    </section>
  );
}

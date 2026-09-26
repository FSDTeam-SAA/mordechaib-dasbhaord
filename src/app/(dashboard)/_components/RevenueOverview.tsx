"use client";

import { useState } from "react";
import { useSubscriptionQuery } from "@/hooks/use-subscription-query";
import { usd, percent, type RevenueOverviewData } from "@/lib/subscription-api";
import SubscriptionQueryState from "./SubscriptionQueryState";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function RevenueOverview() {
  const currentYear = new Date().getUTCFullYear();
  const [year, setYear] = useState(String(currentYear));
  const query = useSubscriptionQuery<RevenueOverviewData>(["analytics", "revenue", year], `/subscription-analytics/revenue-overview?year=${year}`);
  const data = query.data;
  return (
    <Card className="min-w-0 gap-0 rounded-xl border-0 bg-white p-5 shadow-none">
      <div className="flex items-start justify-between gap-2 border-b border-[#EFF1FA] pb-3">
        <div>
          <h2 className="text-base font-medium text-[#171C35]">
            Revenue Overview
          </h2>
          <p className="mt-0.5 text-[10px] text-[#929AC0]">
            Monthly recurring revenue
          </p>
        </div>
        <Select value={year} onValueChange={setYear}>
          <SelectTrigger
            aria-label="Revenue year"
            className="h-7! border-0 bg-[#F5F6FF] px-2 text-xs text-[#85889B] shadow-none"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 6 }, (_, index) => String(currentYear - index)).map(value => <SelectItem key={value} value={value}>{value}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="flex gap-5 py-3">
        {[
          { value: data ? usd(data.totals.mrrUsd) : "—", label: "MRR", color: "text-[#597AFF]" },
          { value: data ? usd(data.totals.arrUsd) : "—", label: "ARR", color: "text-[#D94BDB]" },
          { value: data ? percent(data.totals.growthPercent) : "—", label: "Growth", color: "text-[#0BBC89]" },
        ].map((metric) => (
          <div key={metric.label}>
            <p className={`text-sm font-semibold ${metric.color}`}>
              {metric.value}
            </p>
            <p className="text-[10px] text-[#929AC0]">{metric.label}</p>
          </div>
        ))}
      </div>
      {query.error || query.isPending ? <SubscriptionQueryState error={query.error} retry={() => void query.refetch()} /> : <ChartContainer
        config={{ mrrUsd: { label: "MRR (USD)", color: "#0BBC89" } }}
        className="h-[190px] w-full aspect-auto [&_.recharts-cartesian-axis-tick_text]:fill-[#939CC5]"
      >
        <AreaChart
          accessibilityLayer
          data={data?.series ?? []}
          margin={{ top: 5, right: 0, left: -20, bottom: 0 }}
        >
          <CartesianGrid vertical={false} stroke="#F2F4FB" />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10 }}
            interval={0}
            tickMargin={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10 }}
            domain={[0, "auto"]}
          />
          <ChartTooltip content={<ChartTooltipContent hideLabel />} />
          <Area
            type="monotone"
            dataKey="mrrUsd"
            stroke="#0BBC89"
            strokeWidth={1.3}
            fill="#0BBC89"
            fillOpacity={0.2}
            activeDot={{ r: 4 }}
            dot={{ r: 2, fill: "#0BBC89", strokeWidth: 0 }}
            isAnimationActive={false}
          />
        </AreaChart>
      </ChartContainer>}
    </Card>
  );
}

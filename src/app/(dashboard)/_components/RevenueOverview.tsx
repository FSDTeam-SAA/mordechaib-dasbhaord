"use client";

import { useState } from "react";
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

const monthly = [
  { period: "Jan", revenue: 0 },
  { period: "", revenue: 9200 },
  { period: "", revenue: 8700 },
  { period: "Feb", revenue: 18500 },
  { period: "", revenue: 17200 },
  { period: "", revenue: 22000 },
  { period: "Mar", revenue: 16200 },
  { period: "", revenue: 20000 },
  { period: "", revenue: 19500 },
  { period: "Apr", revenue: 18700 },
  { period: "", revenue: 28500 },
  { period: "", revenue: 30000 },
  { period: "May", revenue: 35500 },
  { period: "", revenue: 39000 },
  { period: "Jun", revenue: 47000 },
  { period: "", revenue: 48291 },
];
const quarterly = [
  { period: "Q1", revenue: 17200 },
  { period: "Q2", revenue: 26000 },
  { period: "Q3", revenue: 35500 },
  { period: "Q4", revenue: 48291 },
];

export default function RevenueOverview() {
  const [period, setPeriod] = useState("monthly");
  return (
    <Card className="min-w-0 gap-0 rounded-xl border-0 bg-white p-5 shadow-none">
      <div className="flex items-start justify-between gap-2 border-b border-[#EFF1FA] pb-3">
        <div>
          <h2 className="text-base font-medium text-[#171C35]">
            Revenue Overview
          </h2>
          <p className="mt-0.5 text-[10px] text-[#929AC0]">
            Estimated money saved overtime
          </p>
        </div>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger
            aria-label="Revenue period"
            className="h-7! border-0 bg-[#F5F6FF] px-2 text-xs text-[#85889B] shadow-none"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="quarterly">Quarterly</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex gap-5 py-3">
        {[
          { value: "$48,291", label: "MRR", color: "text-[#597AFF]" },
          { value: "$579,492", label: "ARR", color: "text-[#D94BDB]" },
          { value: "+23%", label: "Growth", color: "text-[#0BBC89]" },
        ].map((metric) => (
          <div key={metric.label}>
            <p className={`text-sm font-semibold ${metric.color}`}>
              {metric.value}
            </p>
            <p className="text-[10px] text-[#929AC0]">{metric.label}</p>
          </div>
        ))}
      </div>
      <ChartContainer
        config={{ revenue: { label: "Revenue", color: "#0BBC89" } }}
        className="h-[190px] w-full aspect-auto [&_.recharts-cartesian-axis-tick_text]:fill-[#939CC5]"
      >
        <AreaChart
          accessibilityLayer
          data={period === "monthly" ? monthly : quarterly}
          margin={{ top: 5, right: 0, left: -20, bottom: 0 }}
        >
          <CartesianGrid vertical={false} stroke="#F2F4FB" />
          <XAxis
            dataKey="period"
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
            ticks={[0, 10000, 20000, 30000, 48000]}
            domain={[0, 50000]}
          />
          <ChartTooltip content={<ChartTooltipContent hideLabel />} />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#0BBC89"
            strokeWidth={1.3}
            fill="#0BBC89"
            fillOpacity={0.2}
            activeDot={{ r: 4 }}
            dot={{ r: 2, fill: "#0BBC89", strokeWidth: 0 }}
            isAnimationActive={false}
          />
        </AreaChart>
      </ChartContainer>
    </Card>
  );
}

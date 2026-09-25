"use client";

import { ChevronRight, TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const growth = [
  { month: "Dec 24", organizations: 50 },
  { month: "Jan 25", organizations: 27 },
  { month: "Feb 25", organizations: 75 },
  { month: "Mar 25", organizations: 34 },
  { month: "Apr 25", organizations: 75 },
  { month: "May 25", organizations: 37 },
  { month: "May 26", organizations: 82 },
];
const stats = [
  { value: "18", label: "New This Week", change: "20%" },
  { value: "312", label: "Total Organization", change: "18%" },
  { value: "256", label: "Active Organizations", change: "82%" },
];

export default function OrganizationGrowth() {
  return (
    <Card className="min-w-0 gap-0 rounded-xl border-0 bg-white p-5 shadow-none">
      <div className="mb-3 flex items-center justify-between border-b border-[#EFF1FA] pb-3">
        <h2 className="text-base font-medium text-[#171C35]">
          Organization Growth
        </h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              className="h-auto gap-1 p-0 text-[11px] font-normal text-[#597AFF] hover:bg-transparent"
            >
              View All
              <ChevronRight className="size-3" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Organization growth</DialogTitle>
              <DialogDescription>
                Sample organization totals by reporting month.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2">
              {growth.map((row) => (
                <div
                  key={row.month}
                  className="flex justify-between rounded-md bg-[#F5F6FF] px-3 py-2 text-sm"
                >
                  <span>{row.month}</span>
                  <span className="font-medium text-[#597AFF]">
                    {row.organizations}
                  </span>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <ChartContainer
        config={{ organizations: { label: "Organizations", color: "#5B7CFA" } }}
        className="h-[180px] w-full aspect-auto [&_.recharts-cartesian-axis-tick_text]:fill-[#939CC5]"
      >
        <BarChart
          accessibilityLayer
          data={growth}
          margin={{ top: 0, right: 0, bottom: 0, left: -25 }}
        >
          <CartesianGrid vertical={false} stroke="#F2F4FB" />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 9 }}
            interval={0}
            tickMargin={10}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 10 }}
            ticks={[0, 20, 40, 60, 80]}
            domain={[0, 90]}
          />
          <ChartTooltip
            cursor={{ fill: "#F5F6FF" }}
            content={<ChartTooltipContent />}
          />
          <Bar
            dataKey="organizations"
            fill="#5B7CFA"
            maxBarSize={17}
            isAnimationActive={false}
          />
        </BarChart>
      </ChartContainer>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {stats.map((stat) => (
          <div key={stat.label} className="min-w-0 rounded-md bg-[#F5F6FF] p-2">
            <div className="flex items-center justify-between gap-1">
              <span className="text-xs font-semibold text-[#171C35]">
                {stat.value}
              </span>
              <span className="flex items-center gap-0.5 text-[8px] text-[#0BBC89]">
                <TrendingUp className="h-2.5 w-2.5" />
                {stat.change}
              </span>
            </div>
            <p className="mt-1 text-[9px] leading-3 text-[#929AC0]">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}

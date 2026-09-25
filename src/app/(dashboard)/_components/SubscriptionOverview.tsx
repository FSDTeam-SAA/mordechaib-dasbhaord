"use client";

import { ChevronRight } from "lucide-react";
import { Cell, Pie, PieChart } from "recharts";
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

const plans = [
  {
    name: "Starter",
    value: 200,
    color: "#0DBA87",
    text: "text-[#0DBA87]",
    dot: "bg-[#0DBA87]",
  },
  {
    name: "Growth",
    value: 52,
    color: "#5D7BF5",
    text: "text-[#5D7BF5]",
    dot: "bg-[#5D7BF5]",
  },
  {
    name: "Enterprise",
    value: 208,
    color: "#CD4ACF",
    text: "text-[#F3A000]",
    dot: "bg-[#F3A000]",
  },
];

export default function SubscriptionOverview({ title = "Subscription Overview" }: { title?: string }) {
  return (
    <Card className="min-w-0 gap-0 rounded-xl border-0 bg-white p-5 shadow-none">
      <div className="flex items-center justify-between gap-2 border-b border-[#EFF1FA] pb-3">
        <h2 className="text-base font-medium text-[#171C35]">
          {title}
        </h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              className="h-auto gap-1 p-0 text-[11px] font-normal text-[#597AFF] hover:bg-transparent hover:text-[#3E5FE8]"
            >
              View All
              <ChevronRight className="size-3" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Subscription overview</DialogTitle>
              <DialogDescription>
                Sample subscription breakdown across 460 accounts.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className="flex justify-between rounded-lg bg-[#F5F6FF] p-3 text-sm"
                >
                  <span>{plan.name}</span>
                  <span className={plan.text}>{plan.value} subscriptions</span>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex flex-1 items-center gap-3 py-4 min-[1400px]:gap-6">
        <div className="relative w-[44%] shrink-0">
          <ChartContainer
            config={{ value: { label: "Subscriptions" } }}
            className="aspect-square w-full max-h-[190px]"
          >
            <PieChart>
              <ChartTooltip
                content={<ChartTooltipContent nameKey="name" hideLabel />}
              />
              <Pie
                data={plans}
                dataKey="value"
                nameKey="name"
                innerRadius="58%"
                outerRadius="96%"
                startAngle={125}
                endAngle={485}
                stroke="#FFFFFF"
                strokeWidth={3}
                isAnimationActive={false}
              >
                {plans.map((plan) => (
                  <Cell key={plan.name} fill={plan.color} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-semibold text-[#171C35]">460</span>
            <span className="text-[10px] text-[#929AC0]">Total</span>
          </div>
        </div>
        <div className="min-w-0 flex-1 space-y-5">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="grid grid-cols-[1fr_auto_auto] items-center gap-3 text-[11px]"
            >
              <span className="flex items-center gap-1 text-[#30334C]">
                <span
                  className={`h-1.5 w-1.5 shrink-0 rounded-full ${plan.dot}`}
                />
                {plan.name}
              </span>
              <span className={plan.text}>{plan.value}</span>
              <span className={plan.text}>
                {Math.round((plan.value / 460) * 100)}%
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-auto border-t border-[#EFF1FA] pt-3">
        <div className="flex justify-between rounded-md bg-[#F5F6FF] p-2.5">
          <div>
            <p className="text-sm font-semibold text-[#597AFF]">$48,291</p>
            <p className="text-[10px] text-[#929AC0]">Total MRR</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-[#0BBC89]">+23%</p>
            <p className="text-[10px] text-[#929AC0]">Growth</p>
          </div>
        </div>
      </div>
    </Card>
  );
}

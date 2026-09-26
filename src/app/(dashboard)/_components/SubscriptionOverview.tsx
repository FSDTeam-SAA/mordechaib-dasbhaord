"use client";

import { useSubscriptionQuery } from "@/hooks/use-subscription-query";
import { percent, usd, type PlanDistribution } from "@/lib/subscription-api";
import SubscriptionQueryState from "./SubscriptionQueryState";
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

export default function SubscriptionOverview({ title = "Subscription Overview" }: { title?: string }) {
  const query = useSubscriptionQuery<PlanDistribution>(["analytics", "distribution"], "/subscription-analytics/plan-distribution");
  const data = query.data;
  const colors = ["#0DBA87", "#5D7BF5", "#CD4ACF", "#F3A000"];
  const plans = (data?.distribution ?? []).map((plan, index) => ({ ...plan, value: plan.count, color: colors[index % colors.length], text: "text-[#737D95]" }));
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
                {data?.totalSubscriptions ?? 0} total subscriptions.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              {plans.map((plan) => (
                <div
                  key={plan.planId}
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
      {query.error || query.isPending ? <SubscriptionQueryState error={query.error} retry={() => void query.refetch()} /> : <div className="flex flex-1 items-center gap-3 py-4 min-[1400px]:gap-6">
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
                  <Cell key={plan.planId} fill={plan.color} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-semibold text-[#171C35]">{data?.totalSubscriptions ?? "—"}</span>
            <span className="text-[10px] text-[#929AC0]">Total</span>
          </div>
        </div>
        <div className="min-w-0 flex-1 space-y-5">
          {plans.map((plan) => (
            <div
              key={plan.planId}
              className="grid grid-cols-[1fr_auto_auto] items-center gap-3 text-[11px]"
            >
              <span className="flex items-center gap-1 text-[#30334C]">
                <span
                  className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: plan.color }}
                />
                {plan.name}
              </span>
              <span className={plan.text}>{plan.value}</span>
              <span className={plan.text}>
                {plan.percent}%
              </span>
            </div>
          ))}
        </div>
      </div>
      }
      {data && data.distribution.length === 0 && <p className="pb-3 text-xs text-[#929AC0]">No plan distribution available.</p>}
      <div className="mt-auto border-t border-[#EFF1FA] pt-3">
        <div className="flex justify-between rounded-md bg-[#F5F6FF] p-2.5">
          <div>
            <p className="text-sm font-semibold text-[#597AFF]">{data ? usd(data.totalMrrUsd) : "—"}</p>
            <p className="text-[10px] text-[#929AC0]">Total MRR</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-[#0BBC89]">{data ? percent(data.mrrChangePercentVsLastMonth) : "—"}</p>
            <p className="text-[10px] text-[#929AC0]">Growth</p>
          </div>
        </div>
      </div>
    </Card>
  );
}

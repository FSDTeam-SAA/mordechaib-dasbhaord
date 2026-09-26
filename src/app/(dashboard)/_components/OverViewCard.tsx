"use client";

import { Crown, CircleDollarSign, CalendarDays, RefreshCw, TrendingUp, TrendingDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useSubscriptionQuery } from "@/hooks/use-subscription-query";
import { percent, usd, type OverviewCards } from "@/lib/subscription-api";
import SubscriptionQueryState from "./SubscriptionQueryState";

export default function OverViewCard() {
  const query = useSubscriptionQuery<OverviewCards>(["analytics", "overview"], "/subscription-analytics/overview-cards");
  const data = query.data;
  const metrics = [
    { label: "Active Subscriptions", value: data?.activeSubscriptions.value.toLocaleString("en-US"), change: data?.activeSubscriptions.changePercentVsLastMonth, period: "vs last month", icon: Crown, badge: "bg-[#ECF2FF] text-[#5B7CFF]" },
    { label: "Monthly Revenue", value: data ? usd(data.monthlyRevenueUsd.value) : undefined, change: data?.monthlyRevenueUsd.changePercentVsLastMonth, period: "vs last month", icon: CircleDollarSign, badge: "bg-[#E8FAF3] text-[#0BBD89]" },
    { label: "Annual Revenue", value: data ? usd(data.annualRevenueUsd.value) : undefined, change: data?.annualRevenueUsd.changePercentVsLastYear, period: "vs last year", icon: CalendarDays, badge: "bg-[#FCEFFC] text-[#D94BDB]" },
    { label: "Renewals This Month", value: data?.renewalsThisMonth.value.toLocaleString("en-US"), change: undefined, period: data ? `${data.renewalsThisMonth.today} today` : "", icon: RefreshCw, badge: "bg-[#FFF6E8] text-[#F3A000]" },
  ];
  return <div>
    {query.error && <div className="mb-3"><SubscriptionQueryState error={query.error} retry={() => void query.refetch()} /></div>}
    <section aria-label="Subscription summary" aria-busy={query.isPending} className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 xl:grid-cols-4">
      {metrics.map(metric => {
        const Trend = (metric.change ?? 0) < 0 ? TrendingDown : TrendingUp;
        return <Card key={metric.label} className="relative min-h-[140px] min-w-0 gap-0 overflow-hidden rounded-xl border-0 bg-white p-4 shadow-none">
          <div className={`mb-2 flex h-9 w-9 items-center justify-center rounded-xl ${metric.badge}`}><metric.icon className="h-[18px] w-[18px]" strokeWidth={1.5} /></div>
          <p className={`text-[22px] font-bold leading-7 tracking-tight text-[#171C35] ${query.isPending ? "animate-pulse" : ""}`}>{metric.value ?? "—"}</p>
          <h2 className="mt-0.5 text-xs text-[#929AC0]">{metric.label}</h2>
          <div className="mt-1 flex items-center gap-1 text-[9px] text-[#929AC0]">
            {metric.change !== undefined && <span className={`flex items-center rounded px-1 ${metric.change !== null && metric.change < 0 ? "bg-red-50 text-red-500" : metric.badge}`}>
              {metric.change !== null && <Trend className="mr-0.5 size-2.5" />}{percent(metric.change)}
            </span>}
            <span>{metric.period}</span>
          </div>
        </Card>;
      })}
    </section>
  </div>;
}

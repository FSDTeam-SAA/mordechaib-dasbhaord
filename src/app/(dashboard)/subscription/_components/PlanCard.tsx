import { CalendarDays, CircleCheck, Mic, Pencil, Phone, Rocket } from "lucide-react";

export type Plan = {
  id: string;
  name: string;
  description: string;
  price: number | null;
  annualPrice?: number;
  isActive?: boolean;
  activeSubscriberCount?: number;
  monthlyRevenueUsd?: number;
  channels?: string[];
  usage: string[];
  capabilities: string[];
  support: string[];
};

export default function PlanCard({ plan, yearly, onSelect, onEdit }: { plan: Plan; yearly: boolean; onSelect: (plan: Plan) => void; onEdit: (plan: Plan) => void }) {
  const monthlyPrice = plan.price;
  const annualPrice = plan.annualPrice ?? 0;
  return (
    <article className="flex h-full min-w-0 flex-col rounded-2xl border border-[#DDE3FF] bg-white p-5 shadow-[0_4px_20px_rgba(93,123,245,0.04)] transition-shadow hover:shadow-[0_8px_28px_rgba(93,123,245,0.1)] sm:p-6">
      <div className="flex items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#5D7BF5] text-white"><Rocket className="size-6" strokeWidth={1.6} /></span>
        <h3 className="text-xl font-bold tracking-tight text-[#101322]">{plan.name}</h3>
      </div>
      {plan.isActive === false && <span className="mt-2 text-xs text-amber-600">Inactive</span>}
      <p className="mt-4 min-h-12 text-sm leading-6 text-[#101322]">{plan.description}</p>
      <div className="mt-5 flex min-h-14 items-baseline gap-1">
        <span className={`${plan.price === null ? "text-3xl" : "text-[46px]"} font-bold leading-tight tracking-tight text-[#A761F5]`}>{plan.price === null ? "Let’s talk" : `$${(yearly ? annualPrice / 12 : monthlyPrice!).toFixed(2).replace(/\.00$/, "")}`}</span>
        {plan.price !== null && <span className="text-sm text-[#8890A2]">/mo</span>}
      </div>
      {yearly && plan.price !== null && <p className="mt-1 text-xs text-[#8890A2]">${annualPrice.toFixed(2)} billed yearly</p>}
      <div className="mt-6 space-y-6 border-t border-[#E2E5EF] pt-6">
        {[{ title: "Included monthly usage", items: plan.usage }, { title: "Core capabilities", items: plan.capabilities }, { title: "Support", items: plan.support }].map(group => (
          <section key={group.title}>
            <h4 className="mb-2 text-[10px] font-bold uppercase text-[#8992A8]">{group.title}</h4>
            <ul className="space-y-2.5">{group.items.map(item => <li key={item} className="flex items-start gap-2 text-sm leading-5 text-[#111827]"><CircleCheck className="mt-0.5 size-3.5 shrink-0 text-[#459CFF]" strokeWidth={1.7} />{item}</li>)}</ul>
          </section>
        ))}
      </div>
      <div className="mt-auto pt-5">
        {Boolean(plan.channels?.length) && <div className="mt-1 border-t border-[#E2E5EF] pt-5">
          <h4 className="text-base font-medium text-[#8992A8]">Communication channels</h4>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm text-[#737D95]">
            {(plan.channels ?? ["Calls", "Voice Notes", "Meetings"]).map((channel, index) => {
              const Icon = channel === "Calls" ? Phone : channel === "Meetings" ? CalendarDays : Mic;
              return <span key={`${channel}-${index}`} className="flex items-center gap-1"><Icon className="size-4 text-[#607AFF]" />{channel}</span>;
            })}
          </div>
        </div>
        }
        <div className="mt-4 flex justify-between gap-2 text-xs text-[#737D95]"><span>{plan.activeSubscriberCount ?? 0} active subscribers</span><span>${(plan.monthlyRevenueUsd ?? 0).toLocaleString("en-US")} MRR</span></div>
        <div className="mt-5 flex gap-2">
        <button type="button" onClick={() => onEdit(plan)} aria-label={`Edit ${plan.name} plan`} className="flex min-h-11 shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-[#DDE3FF] px-3 text-sm font-medium text-[#607AFF] transition-colors hover:bg-[#F0F3FF] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#607AFF]"><Pencil className="size-3.5" />Edit</button>
        <button type="button" onClick={() => onSelect(plan)} className="min-h-11 min-w-0 flex-1 cursor-pointer rounded-lg border border-[#607AFF] px-3 text-sm font-semibold text-[#607AFF] transition-colors hover:bg-[#F0F3FF] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#607AFF]">View Plan</button>
        </div>
      </div>
    </article>
  );
}

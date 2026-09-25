"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Plus } from "lucide-react";
import PlansTab from "./PlansTab";
import SubscriptionsTab from "./SubscriptionsTab";
import InvoicesTab from "./InvoicesTab";
import AddOnsTab from "./AddOnsTab";

const tabs = ["Plans", "Add-ons", "Subscriptions", "Invoices"] as const;

export default function SubscriptionContent() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Plans");
  const router = useRouter();

  return <>
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-white p-3">
      <div role="tablist" aria-label="Subscription management" className="flex max-w-full gap-1 overflow-x-auto">
        {tabs.map(item => <button
          key={item}
          id={`tab-${item}`}
          role="tab"
          aria-selected={tab === item}
          aria-controls={`panel-${item}`}
          tabIndex={tab === item ? 0 : -1}
          onClick={() => setTab(item)}
          onKeyDown={event => {
            const index = tabs.indexOf(item);
            const next = event.key === "ArrowRight" ? (index + 1) % tabs.length
              : event.key === "ArrowLeft" ? (index - 1 + tabs.length) % tabs.length
              : event.key === "Home" ? 0 : event.key === "End" ? tabs.length - 1 : null;
            if (next === null) return;
            event.preventDefault();
            setTab(tabs[next]);
            document.getElementById(`tab-${tabs[next]}`)?.focus();
          }}
          className={`cursor-pointer whitespace-nowrap rounded-md px-4 py-2 text-xs transition-colors sm:px-6 ${tab === item ? "bg-[#5D7BF5] text-white" : "text-[#929AC0] hover:bg-[#F5F6FF]"}`}
        >{item}</button>)}
      </div>
      <button onClick={() => { setTab("Plans"); router.push("/subscription/add"); }} className="flex cursor-pointer items-center gap-2 rounded-md bg-[#5D7BF5] px-4 py-2.5 text-xs text-white hover:bg-[#4968E8]"><Plus className="size-4" />Add New Plan</button>
    </div>
    <section id="panel-Plans" role="tabpanel" aria-labelledby="tab-Plans" hidden={tab !== "Plans"} tabIndex={0}>
      <PlansTab />
    </section>
    <section id="panel-Subscriptions" role="tabpanel" aria-labelledby="tab-Subscriptions" hidden={tab !== "Subscriptions"} tabIndex={0}>
      <SubscriptionsTab />
    </section>
    <section id="panel-Invoices" role="tabpanel" aria-labelledby="tab-Invoices" hidden={tab !== "Invoices"} tabIndex={0}>
      <InvoicesTab />
    </section>
    <section id="panel-Add-ons" role="tabpanel" aria-labelledby="tab-Add-ons" hidden={tab !== "Add-ons"} tabIndex={0}>
      <AddOnsTab />
    </section>
  </>;
}

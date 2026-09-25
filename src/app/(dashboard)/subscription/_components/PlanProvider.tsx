"use client";
import { createContext, useContext, useState, type ReactNode } from "react";
import type { Plan } from "./PlanCard";
const initialPlans: Plan[] = [
  { id: "starter", name: "Starter", description: "For solo operators and early-stage businesses.", price: 49, usage: ["500 AI Actions", "1,000 CRM Contacts", "50 call minutes", "AI Meeting Capture - 10 hours"], capabilities: ["6 AI agents - unlimited voice notes", "Call recording & AI summaries", "Core AI workflows"], support: ["Standard support - 1 user"] },
  { id: "growth", name: "Growth", description: "For teams scaling operations and revenue.", price: 149, usage: ["10,000 AI Actions", "20,000 CRM Contacts", "500 call minutes", "AI Meeting Capture - 50 hours"], capabilities: ["Everything in Starter", "Full ROI Dashboard", "API access & integrations"], support: ["Priority support - 5 users"] },
  { id: "enterprise", name: "Enterprise", description: "For companies running on AI-driven operations. No customization needed.", price: 349, usage: ["50,000 AI Actions", "Unlimited CRM Contacts", "2,000 call minutes", "Unlimited meeting capture"], capabilities: ["Unlimited AI agents", "Private model tuning", "Dedicated success manager"], support: ["SLA & compliance package - unlimited users"] },
  { id: "custom", name: "Customized (Variable Pricing)", description: "For organizations needing tailored AI systems or infrastructure.", price: null, usage: ["Custom AI agent development", "Custom integrations", "Private dataset training", "Dedicated AI engineer"], capabilities: ["Custom SLA", "SLA-backed reliability", "Private/hybrid deployment", "Industry-specific automations"], support: ["Engineering pods - dedicated support"] },
];

const PlanContext = createContext<{ plans: Plan[]; savePlan: (plan: Plan) => void } | null>(null);
export function PlanProvider({ children }: { children: ReactNode }) {
  const [plans, setPlans] = useState(initialPlans);
  const savePlan = (plan: Plan) => setPlans(current => current.some(item => item.id === plan.id) ? current.map(item => item.id === plan.id ? plan : item) : [...current, plan]);
  return <PlanContext.Provider value={{ plans, savePlan }}>{children}</PlanContext.Provider>;
}
export function usePlans() {
  const context = useContext(PlanContext);
  if (!context) throw new Error("PlanProvider is required");
  return context;
}

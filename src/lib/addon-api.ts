import { subscriptionRequest } from "./subscription-api";

export const addonCategories = {
  AI_ACTIONS: { style: "actions", label: "AI Actions · Blue" },
  VOICE_MINUTES: { style: "voice", label: "Voice Minutes · Pink" },
  OPERATIONS_BOOSTER: { style: "operations", label: "Operations · Orange" },
  AI_MEETING_CAPTURE: { style: "meetings", label: "Meetings · Green" },
} as const;
export type AddonCategory = keyof typeof addonCategories;
export type AddonTier = { label: string; quantity: number; priceUsd: number };
export type AddonInput = {
  category: AddonCategory;
  name: string;
  description: string;
  isInquiryOnly: boolean;
  isActive: boolean;
  sortOrder: number;
  tiers: AddonTier[];
};
export type AddonProduct = AddonInput & { _id: string };

// Build a DTO explicitly: never send database IDs or Stripe-managed tier fields.
export function addonPayload(input: AddonInput, original?: AddonProduct): Partial<AddonInput> {
  const tiers = input.tiers.map(({ label, quantity, priceUsd }) => ({ label: label.trim(), quantity, priceUsd }));
  if (!Object.hasOwn(addonCategories, input.category)) throw new Error("Select a valid add-on category.");
  const name = input.name.trim();
  if (name.length < 2 || name.length > 80) throw new Error("Add-on title must be between 2 and 80 characters.");
  if (input.description.trim().length > 200) throw new Error("Description must be 200 characters or fewer.");
  if (!Number.isSafeInteger(input.sortOrder)) throw new Error("Display order must be a whole number.");
  for (const tier of tiers) {
    if (tier.label.length < 2 || tier.label.length > 100) throw new Error("Each tier label must be between 2 and 100 characters.");
    if (!Number.isSafeInteger(tier.quantity) || tier.quantity < 1) throw new Error("Tier quantity must be a whole number greater than zero.");
    if (!Number.isFinite(tier.priceUsd) || tier.priceUsd < 0) throw new Error("Tier price must be zero or greater.");
  }
  const body: Partial<AddonInput> = {
    category: input.category, name, description: input.description.trim(),
    isInquiryOnly: input.isInquiryOnly, isActive: input.isActive, sortOrder: input.sortOrder, tiers,
  };
  // The backend creates Stripe prices whenever tiers are supplied. Keep prices
  // intact when editing only metadata; include tiers when inquiry mode changes.
  if (original && original.isInquiryOnly === input.isInquiryOnly && JSON.stringify(tiers) === JSON.stringify(original.tiers.map(({ label, quantity, priceUsd }) => ({ label, quantity, priceUsd })))) {
    delete body.tiers;
  }
  return body;
}

export function saveAddon(token: string, input: AddonInput, original?: AddonProduct) {
  return subscriptionRequest<AddonProduct>(original ? `/addon-products/${encodeURIComponent(original._id)}` : "/addon-products", token, {
    method: original ? "PATCH" : "POST", body: addonPayload(input, original),
  });
}
export function deleteAddon(token: string, id: string) {
  return subscriptionRequest<{ message: string }>(`/addon-products/${encodeURIComponent(id)}`, token, { method: "DELETE" });
}

export type Plan = "Starter" | "Growth" | "Enterprise";
export const planColors: Record<string, string> = { STARTER: "bg-[#EEF2FF] text-[#597AFF]", GROWTH: "bg-[#E6F8F5] text-[#00B9CF]", ENTERPRISE: "bg-[#FBEAFD] text-[#DA39E2]", CUSTOM: "bg-[#FBEAFD] text-[#DA39E2]" };
export const statusColors: Record<string, string> = { Active: "bg-[#E4F7F0] text-[#00BB87]", Suspended: "bg-[#FFF0F0] text-[#FF4D59]" };

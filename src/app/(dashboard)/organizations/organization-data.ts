export type Plan = "Starter" | "Growth" | "Enterprise";
export type Status = "Active" | "Suspended" | "Pause for 30 days";
export type Organization = { id: number; name: string; owner: string; employees: string; joined: string; plan: Plan; status: Status };
const sampleRows: Omit<Organization, "id" | "employees" | "joined">[] = [
  { name: "NexaCore Solutions", owner: "Robert Fox", plan: "Starter", status: "Active" },
  { name: "BrightWave Technologies", owner: "Cody Fisher", plan: "Growth", status: "Active" },
  { name: "QuantumLeap Systems", owner: "Courtney Henry", plan: "Starter", status: "Suspended" },
  { name: "Skyline Innovations", owner: "Arlene McCoy", plan: "Growth", status: "Active" },
  { name: "BluePeak Dynamics", owner: "Cameron Williamson", plan: "Growth", status: "Suspended" },
  { name: "Vertex Labs", owner: "Marvin McKinney", plan: "Enterprise", status: "Active" },
  { name: "PulsePoint Software", owner: "Theresa Webb", plan: "Enterprise", status: "Suspended" },
  { name: "EchoStream Networks", owner: "Floyd Miles", plan: "Starter", status: "Pause for 30 days" },
  { name: "FusionGrid Corp", owner: "Jenny Wilson", plan: "Enterprise", status: "Active" },
];
export const organizations: Organization[] = Array.from({ length: 120 }, (_, index) => {
  const sample = sampleRows[index % sampleRows.length];
  return { ...sample, id: index + 1, name: index < 9 ? sample.name : `${sample.name} ${Math.floor(index / 9) + 1}`, employees: "1-10 employees", joined: "27 Aug 2020" };
});
export const planColors: Record<Plan, string> = { Starter: "bg-[#EEF2FF] text-[#597AFF]", Growth: "bg-[#E6F8F5] text-[#00B9CF]", Enterprise: "bg-[#FBEAFD] text-[#DA39E2]" };
export const statusColors: Record<Status, string> = { Active: "bg-[#E4F7F0] text-[#00BB87]", Suspended: "bg-[#FFF0F0] text-[#FF4D59]", "Pause for 30 days": "bg-[#FFF6E5] text-[#F4A000]" };

export type AdminRole = {
  id: string;
  name: string;
  tone: "blue" | "orange" | "green";
  permissions: string[];
  members: string[];
  memberCount: number;
};

export const initialRoles: AdminRole[] = [
  {
    id: "super",
    name: "Super Admin",
    tone: "blue",
    permissions: [
      "Full System Control",
      "Settings Management",
      "Finance Management",
      "Organization Management",
      "Support Tickets",
      "Subscription Management",
    ],
    members: ["Nadia Islam", "Rafiq Ahmed"],
    memberCount: 2,
  },
  {
    id: "support",
    name: "Customer Support",
    tone: "orange",
    permissions: ["Support Tickets", "Complaint Handling"],
    members: ["Nadia Islam", "Rafiq Ahmed"],
    memberCount: 2,
  },
  {
    id: "finance",
    name: "Finance Admin",
    tone: "green",
    permissions: ["Subscription Management", "Revenue Management"],
    members: ["Arif Rahman"],
    memberCount: 3,
  },
];

export const loginActivity = [
  { email: "admin@noltra.ai", role: "Super Admin" },
  { email: "support@noltra.ai", role: "Support Manager" },
  { email: "billing@noltra.ai", role: "Finance Admin" },
];

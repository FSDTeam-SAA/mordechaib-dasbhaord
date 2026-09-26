export const teamRoles = { SUPER_ADMIN: "Super Admin", ADMIN: "Admin", SUB_ADMIN: "Sub Admin" } as const;
export const teamPermissions = {
  Dashborad: "Dashboard", Organization: "Organization", Subscription: "Subscription",
  "Revenue & Analytics": "Revenue & Analytics", "Meeting Calender": "Meeting Calendar",
  "Roles & Permissions": "Roles & Permissions", "opertional diagonistic": "Operational Diagnostic",
  "Help & Support": "Help & Support", Settings: "Settings", "All Access": "All Access",
} as const;
export type TeamRole = keyof typeof teamRoles;
export type TeamPermission = keyof typeof teamPermissions;
export type TeamMember = { _id: string; name: string; email: string; role: TeamRole; permissions: TeamPermission[]; status: "ACTIVE" | "SUSPENDED"; createdAt?: string; updatedAt?: string; invitationEmailSent?: boolean };
export type TeamPage = { items: TeamMember[]; total: number; page: number; limit: number; pages: number };
export type TeamInput = { name?: string; email?: string; role: TeamRole; permissions: TeamPermission[]; status?: TeamMember["status"] };
export function teamPayload(input: TeamInput, editing: boolean): TeamInput {
  if (!input.permissions.length) throw new Error("Select at least one permission.");
  if (!Object.hasOwn(teamRoles, input.role) || input.permissions.some(value => !Object.hasOwn(teamPermissions, value))) throw new Error("Select valid roles and permissions.");
  const base = { role: input.role, permissions: [...new Set(input.permissions)] };
  if (editing) return { ...base, status: input.status };
  const name = input.name?.trim() ?? "";
  if (name.length < 2 || name.length > 100) throw new Error("Name must be between 2 and 100 characters.");
  const email = input.email?.trim().toLowerCase() ?? "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Enter a valid email address.");
  return { ...base, name, email };
}

"use client";
import { useRef, useState, type FormEvent } from "react";
import { useSession } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useSubscriptionQuery } from "@/hooks/use-subscription-query";
import { subscriptionRequest } from "@/lib/subscription-api";
import { teamPayload, teamRoles, teamPermissions, type TeamMember, type TeamRole, type TeamPermission } from "@/lib/team-api";
import SubscriptionQueryState from "../../_components/SubscriptionQueryState";
import { subscriptionDate } from "@/lib/subscriptions-admin";

function MemberForm({ member, view, onClose }: { member?: TeamMember; view: boolean; onClose: () => void }) {
  const { data: session } = useSession();
  const client = useQueryClient();
  const [permissions, setPermissions] = useState<TeamPermission[]>(member?.permissions ?? []);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const lock = useRef(false);
  const field = "mt-1.5 w-full rounded-lg border-0 bg-[#F5F6FF] px-3 py-3 text-sm text-[#303650] outline-[#5B7CFA] disabled:opacity-75";
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (lock.current || view) return;
    const data = new FormData(event.currentTarget);
    lock.current = true; setPending(true); setError("");
    try {
      const body = teamPayload({ name: String(data.get("name") ?? ""), email: String(data.get("email") ?? ""), role: data.get("role") as TeamRole, permissions, ...(member ? { status: data.get("status") as TeamMember["status"] } : {}) }, Boolean(member));
      const saved = await subscriptionRequest<TeamMember>(member ? `/team/${encodeURIComponent(member._id)}` : "/team", session?.accessToken ?? "", { method: member ? "PATCH" : "POST", body });
      await client.invalidateQueries({ queryKey: ["subscription", session?.user.id, "team"] });
      if (!member && saved.invitationEmailSent === false) toast.warning("Member created, but the invitation email could not be sent.");
      else toast.success(member ? "Member updated successfully." : "Member invited successfully.");
      onClose();
    } catch (error) { setError(error instanceof Error ? error.message : "Unable to save member."); }
    finally { lock.current = false; setPending(false); }
  }
  return <form onSubmit={submit} className="space-y-4">
    <fieldset disabled={pending || view} className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2"><label className="block text-xs text-[#8994BF]">Name<input name="name" required minLength={2} maxLength={100} defaultValue={member?.name} readOnly={Boolean(member)} className={field} /></label><label className="block text-xs text-[#8994BF]">Email address<input name="email" type="email" required defaultValue={member?.email} readOnly={Boolean(member)} className={field} /></label></div>
      <div className="grid gap-3 sm:grid-cols-2"><label className="block text-xs text-[#8994BF]">Role<select name="role" defaultValue={member?.role ?? "SUB_ADMIN"} className={field}>{Object.entries(teamRoles).map(([value,label]) => <option key={value} value={value}>{label}</option>)}</select></label>{member && <label className="block text-xs text-[#8994BF]">Status<select name="status" defaultValue={member.status} className={field}><option value="ACTIVE">Active</option><option value="SUSPENDED">Suspended</option></select></label>}</div>
      <fieldset><legend className="mb-2 text-xs text-[#8994BF]">Permissions</legend><div className="grid gap-3 rounded-lg bg-[#F5F6FF] p-4 sm:grid-cols-2">{Object.entries(teamPermissions).map(([value, label]) => <label key={value} className="flex items-center gap-2 text-sm text-[#303650]"><input type="checkbox" checked={permissions.includes(value as TeamPermission)} onChange={event => setPermissions(current => event.target.checked ? [...current, value as TeamPermission] : current.filter(item => item !== value))} className="size-4 accent-[#5B7CFA]" />{label}</label>)}</div></fieldset>
    </fieldset>
    {view && member && <p className="text-xs text-[#929AC0]">Joined: {subscriptionDate(member.createdAt)} · Updated: {subscriptionDate(member.updatedAt)}</p>}
    {error && <p role="alert" className="text-sm text-red-500">{error}</p>}
    <div className="flex justify-end gap-3 border-t border-[#EDF0FA] pt-4"><button type="button" disabled={pending} onClick={onClose} className="cursor-pointer rounded-md border border-[#7D95FF] px-6 py-2.5 text-sm text-[#597CFF] disabled:opacity-50">{view ? "Close" : "Cancel"}</button>{!view && <button type="submit" disabled={pending} className="cursor-pointer rounded-md bg-[#5B7CF6] px-6 py-2.5 text-sm text-white disabled:opacity-50">{pending ? "Saving…" : member ? "Save Changes" : "Invite Member"}</button>}</div>
  </form>;
}
export default function TeamMemberModal({ id, mode, onClose }: { id?: string; mode: "invite" | "edit" | "view"; onClose: () => void }) {
  const query = useSubscriptionQuery<TeamMember>(["team", "detail", id], `/team/${encodeURIComponent(id ?? "")}`, Boolean(id));
  // Dismiss using the form buttons so an in-flight invitation cannot be hidden.
  return <Dialog open onOpenChange={() => {}}><DialogContent showCloseButton={false} overlayClassName="bg-[#171C35]/20 backdrop-blur-[3px]" className="max-h-[90dvh] overflow-y-auto rounded-xl border-0 bg-white p-5 sm:max-w-[640px]">
    <DialogHeader className="border-b border-[#EDF0FA] pb-3 text-left"><DialogTitle className="text-base font-medium text-[#171C35]">{mode === "invite" ? "Invite Member" : mode === "edit" ? "Edit Member" : "Member Details"}</DialogTitle><DialogDescription className="text-xs text-[#929AC0]">{mode === "invite" ? "An invitation with sign-in credentials will be emailed to the member." : "Team member role, permissions, and account status."}</DialogDescription></DialogHeader>
    {query.error || (id && query.isPending) ? <><SubscriptionQueryState error={query.error} retry={() => void query.refetch()} /><button onClick={onClose} className="text-sm text-[#597CFF]">Close</button></> : <MemberForm member={id ? query.data : undefined} view={mode === "view"} onClose={onClose} />}
  </DialogContent></Dialog>;
}

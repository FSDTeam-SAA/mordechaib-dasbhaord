"use client";

import { type FormEvent } from "react";
import { ChevronDown } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import type { AdminRole } from "./role-data";

export default function InviteAdminModal({ roles, onClose, onAdd }: { roles: AdminRole[]; onClose: () => void; onAdd: (email: string, role: string) => void }) {
  const fieldClass = "mt-1.5 h-10 w-full rounded-lg border-0 bg-[#F5F6FF] px-3 text-xs text-[#303650] outline-[#5B7CFA] placeholder:text-[#929AC0]";
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    onAdd(String(data.get("email")).trim(), String(data.get("role")));
  }
  return <Dialog open onOpenChange={open => { if (!open) onClose(); }}>
    <DialogContent overlayClassName="bg-[#202538]/15 backdrop-blur-[5px]" className="gap-0 rounded-xl border-0 bg-white p-[18px] pt-[60px] shadow-none sm:max-w-[438px] [&>button]:top-5 [&>button]:right-5 [&>button]:rounded-full [&>button]:border [&>button]:border-[#929AC0] [&>button]:p-0.5 [&>button]:text-[#929AC0] [&>button_svg]:size-3">
      <DialogTitle className="sr-only">Invite Admin User</DialogTitle>
      <DialogDescription className="sr-only">Enter an email address, role, and password to add an admin to this preview. Changes reset on refresh.</DialogDescription>
      <form onSubmit={submit} className="space-y-2">
        <label className="block text-xs text-[#8994BF]">Email address<input name="email" type="email" required placeholder="admi@gmail.com" autoComplete="off" className={fieldClass} /></label>
        <label className="block text-xs text-[#8994BF]">Role<span className="relative block"><select name="role" required defaultValue="" className={`${fieldClass} appearance-none pr-10`}><option value="" disabled>Select role</option>{roles.map(role => <option key={role.id} value={role.id}>{role.name}</option>)}</select><ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#262B40]" /></span></label>
        <label className="block text-xs text-[#8994BF]">Password<input name="password" type="password" required minLength={8} placeholder="****************" autoComplete="new-password" className={fieldClass} /></label>
        <div className="grid grid-cols-2 gap-3 pt-2"><button type="button" onClick={onClose} className="h-10 cursor-pointer rounded-md border border-[#7D95FF] text-xs text-[#597CFF] hover:bg-[#F5F6FF]">Cancel</button><button type="submit" className="h-10 cursor-pointer rounded-md bg-[#5B7CF6] text-xs text-white hover:bg-[#4B6CE6]">Add Admin</button></div>
      </form>
    </DialogContent>
  </Dialog>;
}

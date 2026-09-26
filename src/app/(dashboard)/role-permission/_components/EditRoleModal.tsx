"use client";

import { useState, type FormEvent } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { initialRoles, type AdminRole } from "./role-data";

const availablePermissions = [...new Set(initialRoles.flatMap(role => role.permissions))];

export default function EditRoleModal({ role, onClose, onSave }: {
  role: AdminRole;
  onClose: () => void;
  onSave: (role: AdminRole) => void;
}) {
  const [name, setName] = useState(role.name);
  const [permissions, setPermissions] = useState(role.permissions);
  const [error, setError] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim()) { setError("Enter a role name."); return; }
    if (!permissions.length) { setError("Select at least one permission."); return; }
    onSave({ ...role, name: name.trim(), permissions });
  }

  return (
    <Dialog open onOpenChange={open => { if (!open) onClose(); }}>
      <DialogContent
        overlayClassName="bg-[#202538]/15 backdrop-blur-[5px]"
        className="max-h-[90dvh] overflow-y-auto rounded-xl border-0 bg-white p-5 sm:max-w-[438px] [&>button]:rounded-full [&>button]:border [&>button]:border-[#929AC0] [&>button]:text-[#929AC0]"
      >
        <div className="border-b border-[#EDF0FA] pb-3 pr-6">
          <DialogTitle className="text-base font-medium text-[#171C35]">Edit Role</DialogTitle>
          <DialogDescription className="mt-1 text-xs text-[#929AC0]">Update the role name and its permissions.</DialogDescription>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <label className="block text-xs text-[#8994BF]">
            Role name
            <input required maxLength={80} value={name} onChange={event => setName(event.target.value)} className="mt-1.5 h-10 w-full rounded-lg border-0 bg-[#F5F6FF] px-3 text-sm text-[#303650] outline-[#5B7CFA]" />
          </label>
          <fieldset>
            <legend className="mb-2 text-xs text-[#8994BF]">Permissions</legend>
            <div className="space-y-2 rounded-lg bg-[#F5F6FF] p-3">
              {[...new Set([...availablePermissions, ...role.permissions])].map(permission => (
                <label key={permission} className="flex cursor-pointer items-center gap-2.5 py-1 text-xs text-[#303650]">
                  <input type="checkbox" checked={permissions.includes(permission)} onChange={event => setPermissions(current => event.target.checked ? [...current, permission] : current.filter(item => item !== permission))} className="size-4 cursor-pointer rounded accent-[#5B7CFA]" />
                  {permission}
                </label>
              ))}
            </div>
          </fieldset>
          {error && <p role="alert" className="text-xs text-red-500">{error}</p>}
          <div className="grid grid-cols-2 gap-3">
            <button type="button" onClick={onClose} className="h-10 cursor-pointer rounded-md border border-[#7D95FF] text-xs text-[#597CFF] hover:bg-[#F5F6FF]">Cancel</button>
            <button type="submit" className="h-10 cursor-pointer rounded-md bg-[#5B7CF6] text-xs text-white hover:bg-[#4B6CE6]">Save Changes</button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { useState, type FormEvent } from "react";
import { CircleCheck, Plus, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { packStyles, type AddOnPack } from "./AddOnPacks";

export default function AddOnModal({ pack, onClose, onSave }: { pack?: AddOnPack; onClose: () => void; onSave: (pack: AddOnPack) => void }) {
  const [items, setItems] = useState(() => (pack?.items ?? [""]).map((value, index) => ({ id: String(index), value })));
  const [error, setError] = useState("");
  const fieldClass = "mt-1.5 block w-full rounded-lg border-0 bg-[#F5F6FF] px-3 py-3 text-sm text-[#30334C] placeholder:text-[#929AC0] focus-visible:outline-2 focus-visible:outline-[#607AFF]";
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const benefits = items.map(item => item.value.trim()).filter(Boolean);
    if (!name || !benefits.length) { setError("Enter an add-on title and at least one benefit or price option."); return; }
    onSave({ id: pack?.id ?? crypto.randomUUID(), name, style: String(data.get("style")) as AddOnPack["style"], items: benefits });
  }
  return <Dialog open onOpenChange={open => { if (!open) onClose(); }}>
    <DialogContent overlayClassName="bg-[#171C35]/15 backdrop-blur-[3px]" className="max-h-[90dvh] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden rounded-xl border-0 bg-white p-5 sm:max-w-[664px] [&>button]:flex [&>button]:size-6 [&>button]:items-center [&>button]:justify-center [&>button]:rounded-full [&>button]:border [&>button]:border-[#929AC0] [&>button]:text-[#929AC0]">
      <DialogHeader className="border-b border-[#F0F2FA] pb-3 text-left"><DialogTitle className="pr-7 text-base font-medium text-[#171C35]">{pack ? "Edit Add-on" : "Add New Add-on"}</DialogTitle><DialogDescription className="text-xs text-[#929AC0]">Add benefits and pricing options for this pack. Preview changes reset on refresh.</DialogDescription></DialogHeader>
      <form onSubmit={submit} className="space-y-4">
        <label className="block text-xs text-[#929AC0]">Add-on Title<input autoFocus name="name" required maxLength={80} defaultValue={pack?.name} placeholder="e.g. AI Actions Packs" className={fieldClass} /></label>
        <label className="block text-xs text-[#929AC0]">Icon & Color<select name="style" defaultValue={pack?.style ?? "actions"} className={fieldClass}>{Object.entries(packStyles).map(([value, style]) => <option key={value} value={value}>{style.label}</option>)}</select></label>
        <fieldset className="space-y-2">
          <legend className="mb-2 w-full"><span className="flex items-center justify-between gap-2 text-xs text-[#929AC0]">Benefits & Pricing Options<button type="button" onClick={() => setItems(current => [...current, { id: crypto.randomUUID(), value: "" }])} className="flex cursor-pointer items-center gap-1 rounded-md bg-[#5D7BF5] px-3 py-2 text-xs text-white hover:bg-[#4968E8]"><Plus className="size-3.5" />Add Field</button></span></legend>
          {items.map((item, index) => <div key={item.id} className="flex items-center gap-2 rounded border border-[#F0F2FA] px-2.5 py-1.5">
            <CircleCheck className="size-3.5 shrink-0 text-[#607AFF]" />
            <input aria-label={`Benefit or pricing option ${index + 1}`} value={item.value} maxLength={180} onChange={event => setItems(current => current.map(entry => entry.id === item.id ? { ...entry, value: event.target.value } : entry))} placeholder="e.g. 1,000 AI Actions - $25" className="min-w-0 flex-1 rounded px-1 py-2 text-sm outline-[#607AFF] placeholder:text-[#929AC0]" />
            <button type="button" aria-label={`Add field after option ${index + 1}`} onClick={() => setItems(current => [...current.slice(0, index + 1), { id: crypto.randomUUID(), value: "" }, ...current.slice(index + 1)])} className="cursor-pointer rounded p-1.5 text-[#607AFF] hover:bg-[#F5F6FF]"><Plus className="size-4" /></button>
            <button type="button" aria-label={`Delete option ${index + 1}`} onClick={() => setItems(current => current.filter(entry => entry.id !== item.id))} className="cursor-pointer rounded p-1.5 text-[#FF5057] hover:bg-red-50"><Trash2 className="size-4" /></button>
          </div>)}
        </fieldset>
        {error && <p role="alert" className="text-sm text-red-500">{error}</p>}
        <div className="sticky -bottom-5 grid grid-cols-2 gap-3 border-t border-[#F0F2FA] bg-white py-3"><button type="button" onClick={onClose} className="min-h-10 cursor-pointer rounded-md border border-[#607AFF] text-sm text-[#607AFF] hover:bg-[#F5F6FF]">Cancel</button><button type="submit" className="min-h-10 cursor-pointer rounded-md bg-[#5D7BF5] text-sm text-white hover:bg-[#4968E8]">{pack ? "Save Changes" : "Add Add-on"}</button></div>
      </form>
    </DialogContent>
  </Dialog>;
}

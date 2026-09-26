"use client";

import { useRef, useState, type FormEvent } from "react";
import { CircleCheck, Plus, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { addonCategories, type AddonCategory, type AddonInput, type AddonProduct } from "@/lib/addon-api";

type TierDraft = { id: string; label: string; quantity: string; priceUsd: string };
const newTier = (): TierDraft => ({ id: crypto.randomUUID(), label: "", quantity: "", priceUsd: "" });

export default function AddOnModal({ pack, onClose, onSave }: {
  pack?: AddonProduct;
  onClose: () => void;
  onSave: (input: AddonInput) => Promise<void>;
}) {
  const [items, setItems] = useState<TierDraft[]>(() => pack ? pack.tiers.map((tier, index) => ({ id: String(index), label: tier.label, quantity: String(tier.quantity), priceUsd: String(tier.priceUsd) })) : [{ id: "initial", label: "", quantity: "", priceUsd: "" }]);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const submitting = useRef(false);
  const fieldClass = "mt-1.5 block w-full rounded-lg border-0 bg-[#F5F6FF] px-3 py-3 text-sm text-[#30334C] placeholder:text-[#929AC0] focus-visible:outline-2 focus-visible:outline-[#607AFF]";
  const updateTier = (id: string, field: keyof Omit<TierDraft, "id">, value: string) => setItems(current => current.map(tier => tier.id === id ? { ...tier, [field]: value } : tier));
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;
    const data = new FormData(event.currentTarget);
    const input: AddonInput = {
      name: String(data.get("name") ?? ""),
      category: String(data.get("category")) as AddonCategory,
      description: String(data.get("description") ?? ""),
      isInquiryOnly: data.get("isInquiryOnly") === "on",
      isActive: data.get("isActive") === "on",
      sortOrder: Number(data.get("sortOrder")),
      tiers: items.map(tier => ({ label: tier.label, quantity: tier.quantity.trim() ? Number(tier.quantity) : NaN, priceUsd: tier.priceUsd.trim() ? Number(tier.priceUsd) : NaN })),
    };
    submitting.current = true;
    setPending(true);
    setError("");
    try { await onSave(input); }
    catch (error) { setError(error instanceof Error ? error.message : "Unable to save the add-on. Please try again."); }
    finally { submitting.current = false; setPending(false); }
  }
  return <Dialog open onOpenChange={open => { if (!open && !submitting.current) onClose(); }}>
    <DialogContent showCloseButton={!pending} onEscapeKeyDown={event => { if (pending) event.preventDefault(); }} onInteractOutside={event => { if (pending) event.preventDefault(); }} overlayClassName="bg-[#171C35]/15 backdrop-blur-[3px]" className="max-h-[90dvh] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden rounded-xl border-0 bg-white p-5 sm:max-w-[664px] [&>button]:flex [&>button]:size-6 [&>button]:items-center [&>button]:justify-center [&>button]:rounded-full [&>button]:border [&>button]:border-[#929AC0] [&>button]:text-[#929AC0]">
      <DialogHeader className="border-b border-[#F0F2FA] pb-3 text-left"><DialogTitle className="pr-7 text-base font-medium text-[#171C35]">{pack ? "Edit Add-on" : "Add New Add-on"}</DialogTitle><DialogDescription className="text-xs text-[#929AC0]">Add benefits and pricing options for this pack.</DialogDescription></DialogHeader>
      <form onSubmit={submit} className="space-y-4">
        <fieldset disabled={pending} className="space-y-4 disabled:opacity-60">
          <label className="block text-xs text-[#929AC0]">Add-on Title<input autoFocus name="name" required minLength={2} maxLength={80} defaultValue={pack?.name} placeholder="e.g. AI Actions Packs" className={fieldClass} /></label>
          <label className="block text-xs text-[#929AC0]">Category, Icon & Color<select name="category" defaultValue={pack?.category ?? "AI_ACTIONS"} className={fieldClass}>{Object.entries(addonCategories).map(([value, category]) => <option key={value} value={value}>{category.label}</option>)}</select></label>
          <label className="block text-xs text-[#929AC0]">Description<textarea name="description" maxLength={200} defaultValue={pack?.description ?? ""} placeholder="Describe this add-on pack" rows={2} className={fieldClass} /></label>
          <fieldset className="space-y-2">
            <legend className="mb-2 w-full"><span className="flex items-center justify-between gap-2 text-xs text-[#929AC0]">Benefits & Pricing Options<button type="button" onClick={() => setItems(current => [...current, newTier()])} className="flex cursor-pointer items-center gap-1 rounded-md bg-[#5D7BF5] px-3 py-2 text-xs text-white hover:bg-[#4968E8]"><Plus className="size-3.5" />Add Field</button></span></legend>
            {items.map((item, index) => <div key={item.id} className="flex items-start gap-2 rounded border border-[#F0F2FA] px-2.5 py-2">
              <CircleCheck className="mt-8 size-3.5 shrink-0 text-[#607AFF]" />
              <div className="grid min-w-0 flex-1 grid-cols-2 gap-2 sm:grid-cols-[2fr_1fr_1fr]">
                <label className="col-span-2 text-[11px] text-[#929AC0] sm:col-span-1">Label<input aria-label={`Tier ${index + 1} label`} required minLength={2} maxLength={100} value={item.label} onChange={event => updateTier(item.id, "label", event.target.value)} placeholder="1,000 AI Actions" className={fieldClass} /></label>
                <label className="text-[11px] text-[#929AC0]">Quantity<input aria-label={`Tier ${index + 1} quantity`} type="number" min={1} step={1} required value={item.quantity} onChange={event => updateTier(item.id, "quantity", event.target.value)} placeholder="1000" className={fieldClass} /></label>
                <label className="text-[11px] text-[#929AC0]">Price ($)<input aria-label={`Tier ${index + 1} price`} type="number" min={0} step="0.01" required value={item.priceUsd} onChange={event => updateTier(item.id, "priceUsd", event.target.value)} placeholder="25" className={fieldClass} /></label>
              </div>
              <div className="mt-6 flex shrink-0 flex-col sm:flex-row">
                <button type="button" aria-label={`Add field after option ${index + 1}`} onClick={() => setItems(current => [...current.slice(0, index + 1), newTier(), ...current.slice(index + 1)])} className="cursor-pointer rounded p-1.5 text-[#607AFF] hover:bg-[#F5F6FF]"><Plus className="size-4" /></button>
                <button type="button" aria-label={`Delete option ${index + 1}`} onClick={() => setItems(current => current.filter(entry => entry.id !== item.id))} className="cursor-pointer rounded p-1.5 text-[#FF5057] hover:bg-red-50"><Trash2 className="size-4" /></button>
              </div>
            </div>)}
            {!items.length && <p className="py-2 text-xs text-[#929AC0]">No pricing options. Use Add Field to add a tier.</p>}
          </fieldset>
          <div className="grid items-end gap-4 sm:grid-cols-2">
            <label className="block text-xs text-[#929AC0]">Display Order<input name="sortOrder" type="number" step={1} required defaultValue={pack?.sortOrder ?? 0} className={fieldClass} /></label>
            <div className="space-y-3 pb-2 text-xs text-[#929AC0]">
              <label className="flex items-center gap-2"><input name="isActive" type="checkbox" defaultChecked={pack?.isActive ?? true} className="accent-[#5D7BF5]" />Active add-on</label>
              <label className="flex items-center gap-2"><input name="isInquiryOnly" type="checkbox" defaultChecked={pack?.isInquiryOnly ?? false} className="accent-[#5D7BF5]" />Contact Sales only</label>
            </div>
          </div>
        </fieldset>
        {error && <p role="alert" className="text-sm text-red-500">{error}</p>}
        <div className="sticky -bottom-5 grid grid-cols-2 gap-3 border-t border-[#F0F2FA] bg-white py-3"><button type="button" disabled={pending} onClick={onClose} className="min-h-10 cursor-pointer rounded-md border border-[#607AFF] text-sm text-[#607AFF] hover:bg-[#F5F6FF] disabled:opacity-50">Cancel</button><button type="submit" disabled={pending} className="min-h-10 cursor-pointer rounded-md bg-[#5D7BF5] text-sm text-white hover:bg-[#4968E8] disabled:opacity-50">{pending ? "Saving…" : pack ? "Save Changes" : "Add Add-on"}</button></div>
      </form>
    </DialogContent>
  </Dialog>;
}

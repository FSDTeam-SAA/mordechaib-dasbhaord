"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import AddOnPacks, { initialPacks, type AddOnPack } from "./AddOnPacks";
import AddOnModal from "./AddOnModal";
import DeleteModal from "@/components/deleteModal/DeleteModal";

export default function AddOnsTab() {
  const [packs, setPacks] = useState(initialPacks);
  const [editor, setEditor] = useState<{ pack?: AddOnPack } | null>(null);
  const [deleting, setDeleting] = useState<AddOnPack | null>(null);
  return <div className="rounded-xl bg-[#FAF8FC] p-3 sm:p-4">
    <div className="mb-4 flex items-center justify-between gap-3"><h2 className="text-sm font-medium text-[#171C35]">Add-on Packs</h2><button type="button" onClick={() => setEditor({})} className="flex cursor-pointer items-center gap-2 rounded-md bg-[#5D7BF5] px-4 py-2.5 text-xs text-white hover:bg-[#4968E8]"><Plus className="size-4" />Add Add-on</button></div>
    {packs.length ? <AddOnPacks packs={packs} onEdit={pack => setEditor({ pack })} onDelete={setDeleting} /> : <p className="rounded-lg bg-white py-12 text-center text-sm text-[#929AC0]">No add-ons yet. Add a pack to get started.</p>}
    {editor && <AddOnModal pack={editor.pack} onClose={() => setEditor(null)} onSave={pack => { setPacks(current => current.some(item => item.id === pack.id) ? current.map(item => item.id === pack.id ? pack : item) : [...current, pack]); setEditor(null); }} />}
    <DeleteModal open={deleting !== null} onOpenChange={open => { if (!open) setDeleting(null); }} title="Delete add-on?" description={`Remove ${deleting?.name ?? "this pack"} from the preview?`} onConfirm={() => { setPacks(current => current.filter(pack => pack.id !== deleting?.id)); setDeleting(null); }} />
  </div>;
}

"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { useSubscriptionQuery } from "@/hooks/use-subscription-query";
import { deleteAddon, saveAddon, type AddonInput, type AddonProduct } from "@/lib/addon-api";
import AddOnPacks from "./AddOnPacks";
import AddOnModal from "./AddOnModal";
import DeleteModal from "@/components/deleteModal/DeleteModal";
import SubscriptionQueryState from "../../_components/SubscriptionQueryState";

export default function AddOnsTab() {
  const { data: session } = useSession();
  const client = useQueryClient();
  const query = useSubscriptionQuery<AddonProduct[]>(["addons"], "/addon-products/admin?includeInactive=true");
  const [editor, setEditor] = useState<{ pack?: AddonProduct } | null>(null);
  const [deleting, setDeleting] = useState<AddonProduct | null>(null);
  const refresh = () => client.invalidateQueries({ queryKey: ["subscription", session?.user.id, "addons"] });
  const save = useMutation({
    mutationFn: ({ input, original }: { input: AddonInput; original?: AddonProduct }) => saveAddon(session?.accessToken ?? "", input, original),
    onSuccess: refresh,
  });
  const remove = useMutation({
    mutationFn: (id: string) => deleteAddon(session?.accessToken ?? "", id),
    onSuccess: refresh,
  });
  const packs = query.data ?? [];
  return <div className="rounded-xl bg-[#FAF8FC] p-3 sm:p-4">
    <div className="mb-4 flex items-center justify-between gap-3"><h2 className="text-sm font-medium text-[#171C35]">Add-on Packs</h2><button type="button" disabled={!session?.accessToken} onClick={() => setEditor({})} className="flex cursor-pointer items-center gap-2 rounded-md bg-[#5D7BF5] px-4 py-2.5 text-xs text-white hover:bg-[#4968E8] disabled:opacity-50"><Plus className="size-4" />Add Add-on</button></div>
    {query.isPending || query.error ? <SubscriptionQueryState error={query.error} retry={() => void query.refetch()} /> : packs.length ? <AddOnPacks packs={packs} onEdit={pack => setEditor({ pack })} onDelete={setDeleting} /> : <p className="rounded-lg bg-white py-12 text-center text-sm text-[#929AC0]">No add-ons yet. Add a pack to get started.</p>}
    {editor && <AddOnModal pack={editor.pack} onClose={() => setEditor(null)} onSave={async input => {
      await save.mutateAsync({ input, original: editor.pack });
      toast.success(editor.pack ? "Add-on updated successfully." : "Add-on created successfully.");
      setEditor(null);
    }} />}
    {deleting && <DeleteModal open onOpenChange={open => { if (!open) setDeleting(null); }} title="Delete add-on?" description={`Delete “${deleting.name}”? This action cannot be undone.`} onConfirm={async () => {
      const result = await remove.mutateAsync(deleting._id);
      toast.success(result.message || "Add-on deleted successfully.");
    }} />}
  </div>;
}

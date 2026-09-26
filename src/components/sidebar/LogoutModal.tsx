"use client";

import { useRef, useState } from "react";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function LogoutModal({ open, onOpenChange }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const inFlight = useRef(false);
  const cancelRef = useRef<HTMLButtonElement>(null);

  function close(next: boolean) {
    if (inFlight.current) return;
    setError("");
    onOpenChange(next);
  }

  async function confirm() {
    if (inFlight.current) return;
    inFlight.current = true;
    setPending(true);
    setError("");
    try {
      await signOut({ callbackUrl: "/signin" });
    } catch {
      setError("Could not log out. Please try again.");
      inFlight.current = false;
      setPending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent
        overlayClassName="z-[60] bg-[#202538]/20 backdrop-blur-[4px]"
        className="z-[61] rounded-xl border-0 bg-white p-6 sm:max-w-[420px]"
        showCloseButton={!pending}
        onOpenAutoFocus={event => { event.preventDefault(); cancelRef.current?.focus(); }}
        onEscapeKeyDown={event => { if (pending) event.preventDefault(); }}
        onInteractOutside={event => { if (pending) event.preventDefault(); }}
      >
        <div className="flex size-12 items-center justify-center rounded-full bg-red-50 text-[#EF4444]"><LogOut className="size-6" /></div>
        <DialogHeader className="text-left">
          <DialogTitle className="text-lg font-medium text-[#171C35]">Log out?</DialogTitle>
          <DialogDescription className="text-sm leading-6 text-[#929AC0]">Are you sure you want to log out of your account?</DialogDescription>
        </DialogHeader>
        {error && <p role="alert" className="text-sm text-red-500">{error}</p>}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button ref={cancelRef} type="button" disabled={pending} onClick={() => close(false)} className="h-10 cursor-pointer rounded-md border border-[#7D95FF] text-sm text-[#597CFF] hover:bg-[#F5F6FF] disabled:cursor-not-allowed disabled:opacity-60">Cancel</button>
          <button type="button" disabled={pending} onClick={confirm} className="h-10 cursor-pointer rounded-md bg-[#EF4444] text-sm text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60">{pending ? "Logging out…" : "Confirm Logout"}</button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

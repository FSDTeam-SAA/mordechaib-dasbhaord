import Link from "next/link";
import { SubscriptionApiError } from "@/lib/subscription-api";

export default function SubscriptionQueryState({ error, retry }: { error?: Error | null; retry: () => void }) {
  return <div role={error ? "alert" : "status"} className="rounded-lg bg-[#F5F6FF] p-4 text-sm text-[#737D95]">
    {error ? <><p>{error.message}</p>{error instanceof SubscriptionApiError && error.status === 401
      ? <Link href="/signin" className="mt-2 inline-block text-[#597AFF] underline">Sign in</Link>
      : <button type="button" onClick={retry} className="mt-2 cursor-pointer text-[#597AFF] underline">Try again</button>}</>
      : <span className="animate-pulse">Loading…</span>}
  </div>;
}

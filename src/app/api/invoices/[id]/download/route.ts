import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { safeInvoiceUrl } from "@/lib/invoices-api";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) return NextResponse.json({ message: "Please sign in to download invoices." }, { status: 401 });
  const { id } = await params;
  if (!/^[a-f\d]{24}$/i.test(id)) return NextResponse.json({ message: "Invalid invoice ID." }, { status: 400 });
  const base = process.env.NEXT_PUBLIC_BACKEND_API_URL?.replace(/\/+$/, "");
  if (!base) return NextResponse.json({ message: "Backend API URL is not configured." }, { status: 500 });
  try {
    const response = await fetch(`${base}/invoices/${encodeURIComponent(id)}/download`, {
      headers: { Authorization: `Bearer ${session.accessToken}` }, redirect: "manual", cache: "no-store", signal: AbortSignal.timeout(30_000),
    });
    if ([301, 302, 303, 307, 308].includes(response.status)) {
      const location = response.headers.get("location");
      if (!location) throw new Error("Missing download URL");
      return NextResponse.json({ url: safeInvoiceUrl(location) }, { headers: { "Cache-Control": "no-store" } });
    }
    const data = await response.json().catch(() => null);
    const message = response.status === 401 ? "Your session has expired. Please sign in again."
      : response.status === 403 ? "Platform admin access is required."
      : typeof data?.message === "string" ? data.message : "Invoice PDF is not available.";
    return NextResponse.json({ message }, { status: response.ok ? 502 : response.status });
  } catch {
    return NextResponse.json({ message: "Unable to download the invoice. Please try again." }, { status: 502 });
  }
}

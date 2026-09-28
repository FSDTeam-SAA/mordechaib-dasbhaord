import { redirect } from "next/navigation";
import OverViewCard from "../../_components/OverViewCard";
import OrganizationDetails from "./_components/OrganizationDetails";

export default async function OrganizationDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // Old demo URLs used numeric IDs; the API requires a MongoDB ObjectId.
  if (!/^[a-fA-F0-9]{24}$/.test(id)) redirect("/organizations");

  return (
    <div className="-m-4 min-h-[calc(100dvh-76px)] bg-[#F5F6FF] p-3 text-[#171C35] md:-m-6 md:p-4">
      <div className="mx-auto flex w-full max-w-[1800px] flex-col gap-3">
        <OverViewCard />
        <OrganizationDetails key={id} id={id} />
      </div>
    </div>
  );
}

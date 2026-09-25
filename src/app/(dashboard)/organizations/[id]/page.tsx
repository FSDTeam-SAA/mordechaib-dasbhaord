import { notFound } from "next/navigation";
import OverViewCard from "../../_components/OverViewCard";
import { organizations } from "../organization-data";
import OrganizationDetails from "./_components/OrganizationDetails";

export default async function OrganizationDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const organization = organizations.find((item) => String(item.id) === id);
  if (!organization) notFound();

  return (
    <div className="-m-4 min-h-[calc(100dvh-76px)] bg-[#F5F6FF] p-3 text-[#171C35] md:-m-6 md:p-4">
      <div className="mx-auto flex w-full max-w-[1800px] flex-col gap-3">
        <OverViewCard />
        <OrganizationDetails key={organization.id} organization={organization} />
      </div>
    </div>
  );
}

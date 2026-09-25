import OverViewCard from "../_components/OverViewCard";
import OrganizationsTable from "./_components/OrganizationsTable";

export default function OrganizationsPage() {
  return (
    <div className="-m-4 min-h-[calc(100dvh-76px)] bg-[#F5F6FF] p-3 text-[#171C35] md:-m-6 md:p-4">
      <div className="mx-auto flex w-full max-w-[1800px] flex-col gap-5">
        <OverViewCard />
        <OrganizationsTable />
      </div>
    </div>
  );
}

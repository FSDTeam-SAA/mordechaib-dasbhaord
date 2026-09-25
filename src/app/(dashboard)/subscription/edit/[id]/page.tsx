import PlanModal from "../../_components/PlanModal";
export default async function EditPlanPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PlanModal planId={id} />;
}

import AssessmentDetails from "./_components/AssessmentDetails";

export default async function AssessmentDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <AssessmentDetails id={id} />;
}

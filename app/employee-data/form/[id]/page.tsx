import EmployeeForm from "@/app/_components/employeeForm";

export default async function EditEmployeePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <EmployeeForm employeeId={id} />;
}

export default function SectionCard({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 bg-white rounded-lg shadow p-4">{children}</div>
  );
}

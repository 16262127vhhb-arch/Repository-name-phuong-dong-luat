import AdminNav from "@/components/AdminNav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-layout">
      <AdminNav />

      <main className="admin-main">
        {children}
      </main>
    </div>
  );
}
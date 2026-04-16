// src/app/admin/layout.tsx
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/helpers";
import AdminSidebar from "@/components/admin/AdminSidebar";
import s from "./admin.module.css";

export const metadata = { title: "Admin Panel | Lat Shop" };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session || session.user.role !== "ADMIN") redirect("/");

  return (
    <div className={s.adminRoot}>
      <AdminSidebar user={session.user} />
      <main className={s.adminMain}>
        <div className={s.adminContent}>{children}</div>
      </main>
    </div>
  );
}

import { AdminLayout } from "@/components/admin/AdminLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Super Admin Panel | Skokka India Classifieds",
  description: "Skokka Super Admin Dashboard & Management System",
};

export default function AdminPage() {
  return <AdminLayout />;
}

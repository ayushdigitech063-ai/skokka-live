import { AdminLayout } from "@/components/admin/AdminLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Super Admin Panel | MyCityQueen India Classifieds",
  description: "MyCityQueen Super Admin Dashboard & Management System",
};

export default function AdminPage() {
  return <AdminLayout />;
}

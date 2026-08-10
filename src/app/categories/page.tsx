import type { Metadata } from "next";
import { buildCategoriesSEO } from "@/lib/seo/seoEngine";
import CategoriesClientPage from "./CategoriesClient";

export const metadata: Metadata = buildCategoriesSEO();

export default function CategoriesPage() {
  return <CategoriesClientPage />;
}

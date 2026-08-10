import type { Metadata } from "next";
import { buildContactSEO } from "@/lib/seo/seoEngine";
import ContactClientPage from "./ContactClient";

export const metadata: Metadata = buildContactSEO();

export default function ContactPage() {
  return <ContactClientPage />;
}

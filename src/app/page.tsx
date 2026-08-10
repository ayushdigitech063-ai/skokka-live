import type { Metadata } from "next";
import { buildHomeSEO } from "@/lib/seo/seoEngine";
import HomeClient from "./HomeClient";

export const metadata: Metadata = buildHomeSEO();

export default function Home() {
  return <HomeClient />;
}
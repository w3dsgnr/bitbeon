import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { imprint } from "@/lib/legal/imprint";

export const metadata: Metadata = {
  title: imprint.metaTitle,
  description: imprint.metaDescription,
};

export default function ImprintPage() {
  return <LegalPage doc={imprint} />;
}

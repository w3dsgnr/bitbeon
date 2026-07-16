import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { amlKycPolicy } from "@/lib/legal/amlKyc";

export const metadata: Metadata = {
  title: amlKycPolicy.metaTitle,
  description: amlKycPolicy.metaDescription,
};

export default function AmlKycPage() {
  return <LegalPage doc={amlKycPolicy} />;
}

import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { termsOfService } from "@/lib/legal/terms";

export const metadata: Metadata = {
  title: termsOfService.metaTitle,
  description: termsOfService.metaDescription,
};

export default function TermsOfServicePage() {
  return <LegalPage doc={termsOfService} />;
}

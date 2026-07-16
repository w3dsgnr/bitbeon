import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { privacyPolicy } from "@/lib/legal/privacy";

export const metadata: Metadata = {
  title: privacyPolicy.metaTitle,
  description: privacyPolicy.metaDescription,
};

export default function PrivacyPolicyPage() {
  return <LegalPage doc={privacyPolicy} />;
}

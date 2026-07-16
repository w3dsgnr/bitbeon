import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { cookiePolicy } from "@/lib/legal/cookies";

export const metadata: Metadata = {
  title: cookiePolicy.metaTitle,
  description: cookiePolicy.metaDescription,
};

export default function CookiePolicyPage() {
  return <LegalPage doc={cookiePolicy} />;
}

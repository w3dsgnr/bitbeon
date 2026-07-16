import Hero from "@/components/Hero";
import Act2 from "@/components/Act2";
import Act3 from "@/components/Act3";
import Act4 from "@/components/Act4";
import SiteHeader from "@/components/SiteHeader";
import CryptoHero from "@/components/CryptoHero";
import CryptoHighlights from "@/components/CryptoHighlights";
import Security from "@/components/Security";
import Trust from "@/components/Trust";
import GetStarted from "@/components/GetStarted";
import Faq from "@/components/Faq";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";
import ScrollMemory from "@/components/ScrollMemory";

export default function Home() {
  return (
    <>
      {/* back/forward navs: re-apply the saved scroll once pins rebuild the
          page height — see ScrollMemory.tsx for the why */}
      <ScrollMemory />
      {/* keyboard users can jump the fixed header + scroll narrative */}
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      {/* page-level fixed overlay — must stay OUTSIDE every pinned stage */}
      <SiteHeader />
      <main id="main">
        <Hero />
        <Act2 />
        <Act3 />
        <Act4 />
        <CryptoHero />
        <CryptoHighlights />
        <Security />
        <Trust />
        <GetStarted />
        <Faq />
      </main>
      <Footer />
      {/* EU consent banner — fixed overlay above the header; nothing
          non-essential may run before a stored choice (CookieConsent.tsx) */}
      <CookieConsent />
    </>
  );
}

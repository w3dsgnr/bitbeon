import type { Metadata } from "next";
import { DM_Sans, Inter } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BitBeon — One wallet. Every currency. Total freedom.",
  description:
    "Fiat and crypto in one app — move it instantly, spend it anywhere.",
  openGraph: {
    title: "BitBeon — One wallet. Every currency. Total freedom.",
    description:
      "Fiat and crypto in one app — move it instantly, spend it anywhere.",
    siteName: "BitBeon",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "BitBeon — One wallet. Every currency. Total freedom.",
    description:
      "Fiat and crypto in one app — move it instantly, spend it anywhere.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}

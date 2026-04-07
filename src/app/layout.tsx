import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.scss";
import { LanguageProvider } from "@/components/providers/LanguageProvider";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { ThemeProvider } from "next-themes";
import Header from "@/components/layout/Header";
import CookieBanner from "@/components/ui/CookieBanner/CookieBanner";
import Analytics from "@/components/Analytics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.sparkplanapp.com"),
  title: {
    default: "SparkPlan - Transform Your Ideas Into Business Plans",
    template: "%s | SparkPlan",
  },
  description:
    "Generate professional business plans with AI in seconds. Define your strategy, financials, and go-to-market plan effortlessly.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "SparkPlan - Transform Your Ideas Into Business Plans",
    description:
      "Generate professional business plans with AI in seconds. Define your strategy, financials, and go-to-market plan effortlessly.",
    url: "https://www.sparkplanapp.com",
    siteName: "SparkPlan",
    type: "website",
    images: [
      {
        url: "/globe.svg",
        width: 1200,
        height: 630,
        alt: "SparkPlan - AI Business Plan Generator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SparkPlan - Transform Your Ideas Into Business Plans",
    description:
      "Generate professional business plans with AI in seconds.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Analytics />
        <SessionProvider>
          <LanguageProvider>
            <ThemeProvider attribute="data-theme" defaultTheme="system">
              <Header />
              {children}
              <CookieBanner />
            </ThemeProvider>
          </LanguageProvider>
        </SessionProvider>
      </body>
    </html>
  );
}

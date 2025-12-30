import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.scss";
import { LanguageProvider } from "@/components/providers/LanguageProvider";
import { SessionProvider } from "@/components/providers/SessionProvider";
import Header from "@/components/layout/Header";
import { ThemeProvider } from "next-themes";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SparkPlan - Transform Your Ideas",
  description: "Transform your ideas into actionable plans using AI and automation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <SessionProvider>
          <LanguageProvider>
            <ThemeProvider attribute="data-theme" defaultTheme="system">
              <Header />
              {children}
            </ThemeProvider>
          </LanguageProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
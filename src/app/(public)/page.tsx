import type { Metadata } from "next";
import styles from "./page.module.scss";
import Hero from "@/components/home/Hero/Hero";
import HowItWorks from "@/components/home/HowItWorks/HowItWorks";
import Features from "@/components/home/Features/Features";
import PricingSection from "@/components/home/PricingSection/PricingSection";
import CTA from "@/components/home/CTA/CTA";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ROUTES } from "@/config";

export const metadata: Metadata = {
  title: "SparkPlan - AI Business Plan Generator",
  description:
    "Turn your business idea into a complete, professional plan in seconds. AI-powered strategy, financials, and go-to-market roadmap.",
  alternates: {
    canonical: "/",
  },
};

export default async function Home() {
  const session = await getServerSession(authOptions);
  
  if (session && session.user) {
    redirect(ROUTES.DASHBOARD);
  }

  return (
    <main className={styles.home}>
      <Hero />
      <HowItWorks />
      <Features />
      <PricingSection />
      <CTA />
    </main>
  );
}
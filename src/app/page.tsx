import styles from "./page.module.scss";
import Hero from "@/components/home/Hero/Hero";
import HowItWorks from "@/components/home/HowItWorks/HowItWorks";
import Features from "@/components/home/Features/Features";
import CTA from "@/components/home/CTA/CTA";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ROUTES } from "@/constants/routes";

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
      <CTA />
    </main>
  );
}
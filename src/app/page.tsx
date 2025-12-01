import styles from "./page.module.scss";
import Hero from "@/components/home/Hero/Hero";
import HowItWorks from "@/components/home/HowItWorks/HowItWorks";
import Features from "@/components/home/Features/Features";
import CTA from "@/components/home/CTA/CTA";

export default async function Home() {

  return (
    <main className={styles.home}>
      <Hero />
      <HowItWorks />
      <Features />
      <CTA />
    </main>
  );
}
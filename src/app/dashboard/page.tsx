import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ROUTES } from "@/constants/routes";
import styles from "./page.module.scss";
import WelcomeCard from "./components/WelcomeCard/WelcomeCard";
import IdeaForm from "./components/IdeaForm/IdeaForm";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect(ROUTES.HOME);
  }

  return (
    <main className={styles.dashboard}>
      <div className={styles.dashboard__container}>
        <WelcomeCard user={session.user} />
        <IdeaForm />
      </div>
    </main>
  );
}
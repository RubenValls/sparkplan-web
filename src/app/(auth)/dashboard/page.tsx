import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import styles from "./page.module.scss";
import WelcomeCard from "./components/WelcomeCard/WelcomeCard";
import IdeaForm from "./components/IdeaForm/IdeaForm";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  return (
    <main className={styles.dashboard}>
      <div className={styles.dashboard__container}>
        <WelcomeCard user={session?.user?.name} />
        <IdeaForm />
      </div>
    </main>
  );
}
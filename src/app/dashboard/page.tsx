import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ROUTES } from "@/constants/routes";
import styles from "./page.module.scss";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect(ROUTES.HOME);
  }

  return (
    <main className={styles.dashboard}>
      <div className={styles.dashboard__container}>
        <h1 className={styles.dashboard__title}>Dashboard</h1>
        <p className={styles.dashboard__welcome}>
          Welcome, {session.user?.name || "User"}!
        </p>
        <p className={styles.dashboard__email}>{session.user?.email}</p>
      </div>
    </main>
  );
}
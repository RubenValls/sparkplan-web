import styles from "./page.module.scss";

export default function Home() {
  return (
    <section className={styles.home}>
      <div className={styles.home__content}>
        <h1 className={styles.home__title}>Bienvenido a SparkPlan</h1>
        <p className={styles.home__subtitle}>
          Transforma tus ideas en planes accionables utilizando IA y automatización.
        </p>
      </div>
    </section>
  );
}

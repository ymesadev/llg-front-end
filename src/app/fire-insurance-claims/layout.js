import styles from "./layout.module.css";

export default function FireInsuranceClaimsLayout({ children }) {
  return (
    <div className={styles.fireHub}>
      {children}
      <footer className={styles.disclaimer}>
        <p>
          The information on this page is for general informational purposes only and does not
          constitute legal advice. Past results do not guarantee future outcomes. This is attorney
          advertising. Louis Law Group, PLLC is a Florida law firm.
        </p>
      </footer>
    </div>
  );
}

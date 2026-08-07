import type { MyPageSummary } from "../types";
import styles from "./MyPage.module.css";

type Props = {
	summary: MyPageSummary | null;
};

export default function ProfileSection({ summary }: Props) {
	return (
		<section className={styles.profileBlock} aria-label="Profile">
			<p className={styles.profileText}>
				<span className={styles.profileLabel}>Login ID</span>
				<span className={styles.profileValue}>{summary?.loginId ?? "-"}</span>
			</p>
			<p className={styles.profileText}>
				<span className={styles.profileLabel}>Name</span>
				<span className={styles.profileValue}>{summary?.realName ?? "-"}</span>
			</p>
			<p className={styles.profileText}>
				<span className={styles.profileLabel}>Phone</span>
				<span className={styles.profileValue}>{summary?.phone ?? "-"}</span>
			</p>
		</section>
	);
}

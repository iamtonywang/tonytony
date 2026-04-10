import type { MyPageSummary } from "../types";
import styles from "./MyPage.module.css";

type Props = {
	summary: MyPageSummary | null;
};

export default function ProfileSection({ summary }: Props) {
	return (
		<section>
			<h2 className={styles.profileTitle}>Profile</h2>
			<div>
				<p className={styles.profileText}>login_ {summary?.loginId ?? "-"}</p>
				<p className={styles.profileText}>Name {summary?.realName ?? "-"}</p>
				<p className={styles.profileText}>Email {summary?.email ?? "-"}</p>
				<p className={styles.profileText}>Partner: {summary?.isPartner ? "YES" : "NO"}</p>
			</div>
		</section>
	);
}


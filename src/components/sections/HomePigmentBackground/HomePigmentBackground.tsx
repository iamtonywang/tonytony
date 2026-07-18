import styles from "./HomePigmentBackground.module.css";

/**
 * Home 전용 장식 배경. 기존 배경색(#5f5f5f) 위에서
 * 7가지 안료가 벽을 타고 아래로 흐르는 모션 레이어만 담당한다.
 */
export default function HomePigmentBackground() {
  return (
    <div className={styles.pigmentLayer} aria-hidden="true">
      <span className={`${styles.stream} ${styles.mineralBlue}`} />
      <span className={`${styles.stream} ${styles.antiqueGold}`} />
      <span className={`${styles.stream} ${styles.silverGray}`} />
      <span className={`${styles.stream} ${styles.boneWhite}`} />
      <span className={`${styles.stream} ${styles.deepEmerald}`} />
      <span className={`${styles.stream} ${styles.darkCrimson}`} />
      <span className={`${styles.stream} ${styles.amber}`} />
    </div>
  );
}

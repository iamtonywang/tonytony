import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.text}>
        <p>Corporate name / TONY WANG</p>
        <p>CEO YUN SE EUN</p>
        <p>Business Number / 355 86 03352</p>
        <p>mail-order business : 제2024-경북경산-0885호</p>
        <br />
        <p>1 Laboratory Republic of Room</p>
        <p>18808, Gumi-do Bundang-gu, Seongnam-si,</p>
        <p>2 Research Institute</p>
        <p>738 Samsung Hyun-ro, Gyeongsan-si, Global Business Center</p>
        <br />
        <p>고객센터 070 4488 8800</p>
        <p>평일 오전 10:00~ 오후 06:00 토/일요일, 공휴일 휴무</p>
        <p>email : hello@iamtonywang.com</p>
        <p>개인정보관리책임 :윤세라(tonywangscience@gmail.com)</p>
      </div>
      <div className={styles.policyLinks}>
        <Link href="/terms" className={styles.policyLink}>
          Terms
        </Link>
        <Link href="/privacy" className={styles.policyLink}>
          Privacy
        </Link>
      </div>
      <p className={styles.copyright}>Copyright ⓒ TONYWANG All Rights Reserved.</p>
    </footer>
  );
}

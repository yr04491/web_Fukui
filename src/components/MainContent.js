import React from 'react';
import styles from '../styles/Main.module.css';

const MainContent = () => {
  return (
    <div className={styles.mainContent}>
      {/* タイトルセクション */}
      <div className={styles.titleSection}>
        {/* タイトルテキスト */}
        <p className={styles.mainTitle}>当事者たちでつくる、不登校情報サイト</p>
        {/* ロゴ（グレーの長方形で代用） */}
        <div className={styles.mainLogo}></div>
      </div>
      
      {/* オープニングセクション */}
      <div className={styles.opening}>
        <p className={styles.openingText}>
          当事者のお子さん、保護者のみなさん、このページまでたどり着いていただき、ありがとうございます。
          このサイトは、元不登校生やその保護者達が、「本当にほしかった情報」を集めて、専門家のアドバイスをいただきながら作った、不登校支援サイトです。
          今の自分とお子さんに合いそうな解決策を、たくさんの事例から見つけていってもらえたらと思っています。
        </p>
        <button className={styles.projectButton}>
          <span>プロジェクトについて</span>
        </button>
      </div>
      
      {/* ここに他のコンテンツセクションを追加 */}
    </div>
  );
};

export default MainContent;

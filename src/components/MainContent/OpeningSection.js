import React from 'react';
import styles from './OpeningSection.module.css';
import newWindowIcon from '../../assets/images/newwindow.png';

const OpeningSection = () => {
  return (
    <div className={styles.opening}>
      <p className={styles.openingText}>
        当事者のお子さん、保護者のみなさん、このページまでたどり着いていただき、ありがとうございます。
        このサイトは、元不登校生やその保護者達が、「本当にほしかった情報」を集めて、専門家のアドバイスをいただきながら作った、不登校支援サイトです。
        今の自分とお子さんに合いそうな解決策を、たくさんの事例から見つけていってもらえたらと思っています。
      </p>
      <button className={styles.projectButton}>
        <img src={newWindowIcon} alt="新しいウィンドウ" className={styles.newWindowIcon} />
        <span>プロジェクトについて</span>
      </button>
    </div>
  );
};

export default OpeningSection;

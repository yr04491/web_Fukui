// src/components/MainContent/02/Section02Content.js

import React from 'react';
/* --- 修正箇所 開始 --- */
import layoutStyles from '../commonPageLayout.module.css'; // 共通CSS（外枠）をインポート
/* --- 修正箇所 終了 --- */
import styles from './Section02Content.module.css'; // 固有CSS（内側）
import yubiIcon from '../../../assets/images/yubi.png';
import Footer from '../../common/Footer';
import roadNumberImage from '../../../assets/icons/02.png';

const Section02Content = () => {
  return (
    /* --- 修正箇所 開始 --- */
    // 共通の「外枠」と、02ページ固有の「内側」のスタイルを両方適用
    <div className={`${layoutStyles.pageContainer} ${styles.section02Content}`}>
    {/* --- 修正箇所 終了 --- */ }
      {/* セクション1: タイトル部分 */}
      <div className={styles.section02Top}>
        <div className={styles.titleContainer}>
          <div className={styles.roadNumberContainer}>
            {/* カラーナビ（縦線） */}
            <div className={styles.colorNavi}>
              <div className={styles.colorBar} style={{background: 'linear-gradient(145deg, #FDF9D5, #F5F1C8)'}}></div>
              <div className={styles.colorBar} style={{background: 'linear-gradient(145deg, #A3D0FA, #85C1E9)'}}></div>
              <div className={styles.colorBar} style={{background: 'linear-gradient(145deg, #88D3BC, #76C7C0)'}}></div>
              <div className={styles.colorBar} style={{background: 'linear-gradient(145deg, #F4BED3, #F1A7C7)'}}></div>
              <div className={styles.colorBar} style={{background: 'linear-gradient(145deg, #EFAB94, #E99578)'}}></div>
              <div className={styles.colorBar} style={{background: 'linear-gradient(145deg, #B695CE, #A37FB8)'}}></div>
            </div>
            <div className={styles.roadNumber}>
              <img src={roadNumberImage} alt="02" className={styles.roadNumberImage} />
            </div>
          </div>
          <h1 className={styles.mainTitle}>行政が行う公的支援</h1>
        </div>
        <h2 className={styles.subtitle}>
          学校以外で支援や相談に乗ってくれるところです。<br />
          まずは各窓口へ。※すべて無料
        </h2>
        
        {/* チャレンジきょうしつ */}
        <div className={styles.supportBox}>
          <h4 className={styles.supportTitle}>チャレンジきょうしつ</h4>
          <p className={styles.supportDescription}>
            県内５０校に設置　詳しくはどこにかいてあるのかな？
          </p>
          <button className={styles.projectButton}>
            <img src={yubiIcon} alt="アイコン" className={styles.buttonIcon} />
            <span>チャレンジ教室の情報を見る</span>
          </button>
        </div>

        <p className={styles.description}>
          ◯ちゃれんじ教室 ◯ソーシャルワーカー　など
        </p>

        <button className={styles.projectButtonHighlight}>
          <img src={yubiIcon} alt="アイコン" className={styles.buttonIcon} />
          <span>窓口の紹介です。嶺南にもあるので、<br />利用しやすいところ選んでください。</span>
        </button>
      </div>

      {/* フッター */}
      <Footer />
    </div>
  );
};

export default Section02Content;
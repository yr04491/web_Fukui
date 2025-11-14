// src/components/MainContent/05/Section05Content.js

import React from 'react';
import layoutStyles from '../commonPageLayout.module.css'; // 共通CSS（外枠）
import styles from './Section05Content.module.css'; // 05ページ固有CSS
import commonStyles from '../SectionCommon.module.css'; // 共通CSS（コンポーネント）
import Footer from '../../common/Footer';
import roadNumberImage from '../../../assets/icons/05_0.png'; // 05の画像に変更

const Section05Content = () => {
  return (
    // ページレイアウト (styles)
    <div className={`${layoutStyles.pageContainer} ${styles.section05Content}`}>

      {/* セクション1: タイトル部分 (styles) */}
      <div className={styles.section05Top}>
        {/* titleContainer (commonStyles) */}
        <div className={commonStyles.titleContainer}>
          {/* roadNumberContainer (commonStyles) */}
          <div className={commonStyles.roadNumberContainer}>

            {/* colorNavi (styles - 05固有の玉ずれ) (一旦01のものを流用) */}
            <div className={styles.colorNavi}>
              <div className={styles.colorBar} style={{background: 'linear-gradient(145deg, #FDF9D5, #F5F1C8)'}}></div>
              <div className={styles.colorBar} style={{background: 'linear-gradient(145deg, #A3D0FA, #85C1E9)'}}></div>
              <div className={styles.colorBar} style={{background: 'linear-gradient(145deg, #88D3BC, #76C7C0)'}}></div>
              <div className={styles.colorBar} style={{background: 'linear-gradient(145deg, #F4BED3, #F1A7C7)'}}></div>
              <div className={styles.colorBar} style={{background: 'linear-gradient(145deg, #EFAB94, #E99578)'}}></div>
              <div className={styles.colorBar} style={{background: 'linear-gradient(145deg, #B695CE, #A37FB8)'}}></div>
            </div>
            {/* roadNumber (commonStyles) */}
            <div className={commonStyles.roadNumber}>
              <img src={roadNumberImage} alt="05" className={commonStyles.roadNumberImage} />
            </div>
          </div>
          {/* mainTitle (commonStyles) */}
          <h1 className={commonStyles.mainTitle}>中学卒業のこと</h1>
        </div>
        {/* subtitle (commonStyles) */}
        <h2 className={commonStyles.subtitle}>義務教育後の選択肢</h2>
        {/* description (commonStyles) */}
        <p className={commonStyles.description}>
          ここには Section05（中学卒業のこと）に関するコンテンツが入ります。
          (デザインは一旦なし)
        </p>
      </div>

      {/* セクション2: (デザイン一旦なしのため最小限) */}
      <div className={styles.section05Middle}>
        {/* sectionTitle (commonStyles) */}
        <h3 className={commonStyles.sectionTitle}>
          コンテンツエリア
        </h3>
        <p className={commonStyles.sectionDescription}>
          （ここに詳細コンテンツが入ります）
        </p>
      </div>

      {/* フッター */}
      <Footer />
    </div>
  );
};

export default Section05Content;
// src/components/MainContent/03/Section03Content.js

import React from 'react';
import layoutStyles from '../commonPageLayout.module.css'; // 共通CSS（外枠）
import styles from './Section03Content.module.css'; // 03ページ固有CSS
import commonStyles from '../SectionCommon.module.css'; // 共通CSS（コンポーネント）
// import yubiIcon from '../../../assets/images/yubi.png'; // 一旦不要
import Footer from '../../common/Footer';
import Breadcrumbs from '../../common/Breadcrumbs';
import roadNumberImage from '../../../assets/icons/03_0.png'; // 03の画像に変更

const Section03Content = () => {
  return (
    // ページレイアウト (styles)
    <div className={`${layoutStyles.pageContainer} ${styles.section03Content}`}>

      {/* パンくずリスト */}
      <Breadcrumbs sectionNumber="03" sectionTitle="まだまだある！みんなの居場所" />

      {/* セクション1: タイトル部分 (styles) */}
      <div className={styles.section03Top}>
        {/* titleContainer (commonStyles) */}
        <div className={commonStyles.titleContainer}>
          {/* roadNumberContainer (commonStyles) */}
          <div className={commonStyles.roadNumberContainer}>
            {/* roadNumber (commonStyles) */}
            <div className={commonStyles.roadNumber}>
              <img src={roadNumberImage} alt="03" className={commonStyles.roadNumberImage} />
            </div>
          </div>
          {/* mainTitle (commonStyles) */}
          <h1 className={commonStyles.mainTitle}>まだまだある！ みんなの居場所</h1>
        </div>
        {/* subtitle (commonStyles) */}
        <h2 className={commonStyles.subtitle}>こどもや保護者の居場所</h2>
        {/* description (commonStyles) */}
        <p className={commonStyles.description}>
          ここには Section03（こどもや保護者の居場所）に関するコンテンツが入ります。
          (デザインは一旦なし)
        </p>
      </div>

      {/* セクション2: (デザイン一旦なしのため最小限) */}
      <div className={styles.section03Middle}>
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

export default Section03Content;
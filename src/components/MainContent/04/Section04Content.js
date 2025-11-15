// src/components/MainContent/04/Section04Content.js

import React from 'react';
import layoutStyles from '../commonPageLayout.module.css'; // 共通CSS（外枠）
import styles from './Section04Content.module.css'; // 04ページ固有CSS
import commonStyles from '../SectionCommon.module.css'; // 共通CSS（コンポーネント）
import Footer from '../../common/Footer';
import Breadcrumbs from '../../common/Breadcrumbs';
import roadNumberImage from '../../../assets/icons/04_0.png'; // 04の画像に変更

const Section04Content = () => {
  return (
    // ページレイアウト (styles)
    <div className={`${layoutStyles.pageContainer} ${styles.section04Content}`}>

      {/* パンくずリスト */}
      <Breadcrumbs sectionNumber="04" sectionTitle="インタビュー 不登校とぼくら" />

      {/* セクション1: タイトル部分 (styles) */}
      <div className={styles.section04Top}>
        {/* titleContainer (commonStyles) */}
        <div className={commonStyles.titleContainer}>
          {/* roadNumberContainer (commonStyles) */}
          <div className={commonStyles.roadNumberContainer}>
            {/* roadNumber (commonStyles) */}
            <div className={commonStyles.roadNumber}>
              <img src={roadNumberImage} alt="04" className={commonStyles.roadNumberImage} />
            </div>
          </div>
          {/* mainTitle (commonStyles) */}
          <h1 className={commonStyles.mainTitle}>インタビュー 不登校とぼくら</h1>
        </div>
        {/* subtitle (commonStyles) */}
        <h2 className={commonStyles.subtitle}>当事者の声を聞いてみよう</h2>
        {/* description (commonStyles) */}
        <p className={commonStyles.description}>
          ここには Section04（インタビュー）に関するコンテンツが入ります。
          (デザインは一旦なし)
        </p>
      </div>

      {/* セクション2: (デザイン一旦なしのため最小限) */}
      <div className={styles.section04Middle}>
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

export default Section04Content;
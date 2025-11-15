// src/components/MainContent/03/Section03Content.js

import React from 'react';
import layoutStyles from '../commonPageLayout.module.css';
import styles from './Section03Content.module.css';
import Footer from '../../common/Footer';
import Breadcrumbs from '../../common/Breadcrumbs';
import PlaceCard from '../../common/PlaceCard/PlaceCard';
import road03Image from '../../../assets/icons/ROAD03.png';
import dotlineImage from '../../../assets/images/dotline.png';
import vectorRB from '../../../assets/images/vectorRB.png';

const Section03Content = () => {
  return (
    <div className={`${layoutStyles.pageContainer} ${styles.section03Content}`}>

      {/* パンくずリスト */}
      <Breadcrumbs sectionNumber="03" sectionTitle="まだまだある！みんなの居場所" />

      {/* タイトル部分 */}
      <div className={styles.titleSection}>
        <img src={road03Image} alt="ROAD 03" className={styles.roadImage} />
        <h1 className={styles.mainTitle}>まだまだある！<br />みんなの居場所</h1>
        <img src={dotlineImage} alt="点線" className={styles.dotline} />
      </div>

      {/* 説明セクション */}
      <div className={styles.descriptionSection}>
        <h2 className={styles.descriptionTitle}>
          子どもだけじゃない。<br />
          保護者のみなさんの居場所もあります。
        </h2>
        <div className={styles.dividerLine}></div>
        <p className={styles.descriptionText}>
          多くの民間団体やサークルが、不登校の子どもたちや保護者の居場所を作ってくれています。保護者のみなさんが、子どもたちにと思う場所をまず見つけてください。
        </p>
      </div>

      {/* みんなの居場所一覧セクション */}
      <div className={styles.placeListSection}>
        <h3 className={styles.placeListTitle}>みんなの居場所一覧</h3>
        <div className={styles.dividerLine}></div>
        <div className={styles.placeCardArea}>
          <PlaceCard cardId={1} />
          <PlaceCard cardId={2} />
          <PlaceCard cardId={3} />
        </div>
      </div>

      {/* みんなの居場所検索ページボタン */}
      <button className={styles.searchButton}>
        <img src={vectorRB} alt="アイコン" className={styles.playIcon} />
        <span>みんなの居場所の検索ページ</span>
      </button>

      {/* フッター */}
      <Footer />
    </div>
  );
};

export default Section03Content;
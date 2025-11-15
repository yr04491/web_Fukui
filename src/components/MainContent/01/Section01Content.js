// src/components/MainContent/01/Section01Content.js

import React from 'react';
import layoutStyles from '../commonPageLayout.module.css'; // 共通CSS（外枠）
import styles from './Section01Content.module.css'; // 01ページ固有CSS
import Footer from '../../common/Footer';
import Breadcrumbs from '../../common/Breadcrumbs';
import InterviewCard from '../../common/InterviewCard/InterviewCard';
import TweetCard from '../../common/TweetCard/TweetCard';
import road01Image from '../../../assets/icons/ROAD01.png';
import dotlineImage from '../../../assets/images/dotline.png';
import vectorRB from '../../../assets/images/vectorRB.png';

const Section01Content = () => {
  return (
    <div className={`${layoutStyles.pageContainer} ${styles.section01Content}`}>

      {/* パンくずリスト */}
      <Breadcrumbs sectionNumber="01" sectionTitle="学校に相談してみよう" />

      {/* タイトル部分（00ページと同様） */}
      <div className={styles.titleSection}>
        <img src={road01Image} alt="ROAD 01" className={styles.roadImage} />
        <h1 className={styles.mainTitle}>学校に相談してみよう</h1>
        <img src={dotlineImage} alt="点線" className={styles.dotline} />
      </div>

      {/* 説明セクション */}
      <div className={styles.descriptionSection}>
        <h2 className={styles.descriptionTitle}>
          学校は解決するためではなく「利用するもの」<br />
          そう思っていろいろ相談してみてください。
        </h2>
        <div className={styles.dividerLine}></div>
        <p className={styles.descriptionText}>
          まずは、担任の先生や学年主任の先生、養護の先生に現状を相談するのが良いかもしれません。 ただ、全ての先生が不登校に詳しいというわけではありません。そして子どもも親も先生も人間です。合う・合わないは必ずあります。 なので、一番大変な時期だと思いますが、様々な人に相談してみてください。お子さんが一緒に行ければ良いですが、無理して連れて行くことはありません。
        </p>
        <p className={styles.descriptionText}>
          学校での様子、家での様子、情報を交換しあって、「原因探し」ではなく、お子さんを応援する「チームメンバー」になっていただくのが良いかもしれません。 学校は、「利用するもの」という意識を持つと少し楽になるかもしれません。
        </p>
      </div>

      {/* 経験談セクション */}
      <div className={styles.interviewSection}>
        <div className={styles.dottedBorder}></div>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>
            <span className={styles.titleLine1}>専門家の先生にお聞きしました</span>
            <span className={styles.titleLine2}>不登校の原因って</span>
          </h3>
        </div>
        <InterviewCard cardId={1} />
        <div className={styles.dottedBorder}></div>
      </div>

      {/* 学校の支援セクション */}
      <div className={styles.supportSection}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>
            <span className={styles.titleLine2Support}>みんなの体験談を見てみよう！</span>
            <span className={styles.titleLine1Support}>不登校初期、学校側とどのような対応した？</span>
          </h3>
        </div>
        <div className={styles.tweetCardArea}>
          <TweetCard cardId={1} />
          <TweetCard cardId={2} />
        </div>
        <button className={styles.moreButton}>
          <img src={vectorRB} alt="アイコン" className={styles.playIcon} />
          <span>体験談をもっと見る</span>
        </button>
      </div>

      {/* フッター */}
      <Footer />
    </div>
  );
};

export default Section01Content;
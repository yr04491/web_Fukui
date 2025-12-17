// src/components/MainContent/00/Section00Content.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import layoutStyles from '../commonPageLayout.module.css'; // 共通CSS（外枠）
import styles from './Section00Content.module.css'; // 00ページ固有CSS
import commonStyles from '../SectionCommon.module.css'; // 共通CSS（コンポーネント）
import Footer from '../../common/Footer';
import Breadcrumbs from '../../common/Breadcrumbs';
import TweetCard from '../../common/TweetCard/TweetCard';
import road00Image from '../../../assets/icons/ROAD00.png';
import dotlineImage from '../../../assets/images/dotline.png';
import vectorRB from '../../../assets/images/vectorRB.png';

const Section00Content = () => {
  const navigate = useNavigate();
  return (
    // ページレイアウト (styles)
    <div className={`${layoutStyles.pageContainer} ${styles.section00Content}`}>
      
      {/* パンくずリスト */}
      <Breadcrumbs sectionNumber="00" sectionTitle="まずは、どうする？" />
      
      {/* セクション1: タイトル部分 (styles) */}
      <div className={styles.section00Top}>
        {/* ROAD 00 画像 */}
        <div className={styles.roadImageContainer}>
          <img src={road00Image} alt="ROAD 00" className={styles.roadImage} />
        </div>
        
        {/* サブタイトル */}
        <p className={styles.topSubtitle}>子どもが不登校に・・・</p>
        
        {/* メインタイトル */}
        <h1 className={styles.topMainTitle}>まずは、どうする？</h1>
        
        {/* ドットライン装飾 */}
        <div className={styles.dotlineContainer}>
          <img src={dotlineImage} alt="" className={styles.dotline} />
        </div>
        
        {/* 説明テキスト */}
        <h2 className={styles.topDescription}>
          ＼　大丈夫です。なんとかなります。／<br />
          まずは慌てず落ち着きましょう。
        </h2>
        
        {/* description (commonStyles) */}
        <p className={commonStyles.description}>
          お子さんの急な不登校宣言。驚きますよね。<br />
          どうしたの？何かあったの？いじめ！？聞きたくなる気持ちはわかります。<br />
          ただ、お子さんは今、傷ついた自分の心を守るため、必死に戦っています。<br />
          お子さんの心が回復できるように、まずはお父さん、お母さんが、慌てず落ち着いて、子どもが安心できる家庭を維持する事を意識してください。<br /><br />
          「甘えとの境界線がわからない。」<br />
          そうですよね。多くの保護者が悩まれるところだと思います。<br />
          ただ、サボりたいが為に不登校になる子どもはほとんどいないそうです。<br />
          お子さんも悩みに悩んだ末の決断なのです。<br />
          お子さんの気持ちを尊重し、親が動じず、例え何が起きても大丈夫、という姿勢を見せることも大事かもしれません。
        </p>
      </div>

      {/* セクション2: 体験談 */}
      <div className={styles.section00Middle}>
        <div className={styles.experienceTitle}>
          <div className={styles.titleLine1}>みんなの体験談をみてみよう！</div>
          <div className={styles.titleLine2}>不登校になったきっかけは？</div>
        </div>
        
        {/* TweetCardを2つ横並びで表示 */}
        <div className={styles.tweetCardsContainer}>
          <TweetCard cardId={1} />
          <TweetCard cardId={2} />
        </div>
        
        {/* ボタン */}
        <button 
          className={styles.experienceButton}
          onClick={() => navigate('/experiences')}
        >
          <img src={vectorRB} alt="" className={styles.buttonIcon} />
          <span>不登校になったきっかけの体験談を見る</span>
        </button>
      </div>

      {/* フッター */}
      <Footer />
    </div>
  );
};

export default Section00Content;
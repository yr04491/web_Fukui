// src/components/MainContent/02/Section02Content.js

import React from 'react';
import layoutStyles from '../commonPageLayout.module.css'; // 共通CSS（外枠）
import styles from './Section02Content.module.css'; // 02ページ固有CSS
import commonStyles from '../SectionCommon.module.css'; // 共通CSS（コンポーネント）
import yubiIcon from '../../../assets/images/yubi.png';
import Footer from '../../common/Footer';
import roadNumberImage from '../../../assets/icons/02.png';

const Section02Content = () => {
  return (
    // ページレイアウト (styles)
    <div className={`${layoutStyles.pageContainer} ${styles.section02Content}`}>

      {/* セクション1: タイトル部分 (styles) */}
      <div className={styles.section02Top}>
        {/* titleContainer (commonStyles) */}
        <div className={commonStyles.titleContainer}>
          {/* roadNumberContainer (commonStyles) */}
          <div className={commonStyles.roadNumberContainer}>

            {/* colorNavi (styles - 02固有の玉ずれ) */}
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
              <img src={roadNumberImage} alt="02" className={commonStyles.roadNumberImage} />
            </div>
          </div>
          {/* mainTitle (commonStyles) */}
          <h1 className={commonStyles.mainTitle}>行政が行う公的支援</h1>
        </div>
        {/* subtitle (commonStyles) */}
        <h2 className={commonStyles.subtitle}>
          学校以外で支援や相談に乗ってくれるところです。<br />
          まずは各窓口へ。※すべて無料
        </h2>
        
        {/* supportBox (commonStyles) */}
        <div className={commonStyles.supportBox}>
          <h4 className={commonStyles.supportTitle}>チャレンジきょうしつ</h4>
          <p className={commonStyles.supportDescription}>
            県内５０校に設置　詳しくはどこにかいてあるのかな？
          </p>
          <button className={commonStyles.projectButton}>
            <img src={yubiIcon} alt="アイコン" className={commonStyles.buttonIcon} />
            <span>チャレンジ教室の情報を見る</span>
          </button>
        </div>

        {/* description (commonStyles) */}
        <p className={commonStyles.description}>
          ◯ちゃれんじ教室 ◯ソーシャルワーカー{'\u3000'}など
        </p>

        {/* projectButtonHighlight (commonStyles) */}
        <button className={commonStyles.projectButtonHighlight}>
          <img src={yubiIcon} alt="アイコン" className={commonStyles.buttonIcon} />
          <span>窓口の紹介です。嶺南にもあるので、<br />利用しやすいところ選んでください。</span>
        </button>
      </div>

      {/* フッター */}
      <Footer />
    </div>
  );
};

export default Section02Content;
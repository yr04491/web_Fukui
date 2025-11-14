// src/components/MainContent/01/Section01Content.js

import React from 'react';
import layoutStyles from '../commonPageLayout.module.css'; // 共通CSS（外枠）
import styles from './Section01Content.module.css'; // 01ページ固有CSS
import commonStyles from '../SectionCommon.module.css'; // 共通CSS（コンポーネント）
import yubiIcon from '../../../assets/images/yubi.png';
import Footer from '../../common/Footer';
import roadNumberImage from '../../../assets/icons/01.png';

const Section01Content = () => {
  return (
    // ページレイアウト (styles)
    <div className={`${layoutStyles.pageContainer} ${styles.section01Content}`}>

      {/* セクション1: タイトル部分 (styles) */}
      <div className={styles.section01Top}>
        {/* titleContainer (commonStyles) */}
        <div className={commonStyles.titleContainer}>
          {/* roadNumberContainer (commonStyles) */}
          <div className={commonStyles.roadNumberContainer}>

            {/* colorNavi (styles - 01固有の玉ずれ) */}
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
              <img src={roadNumberImage} alt="01" className={commonStyles.roadNumberImage} />
            </div>
          </div>
          {/* mainTitle (commonStyles) */}
          <h1 className={commonStyles.mainTitle}>学校に相談</h1>
        </div>
        {/* subtitle (commonStyles) */}
        <h2 className={commonStyles.subtitle}>まずは学校に相談してみよう</h2>
        {/* description (commonStyles) */}
        <p className={commonStyles.description}>
          学校に電話して、「学校に行けない状態になってしまった」事を伝え、相談に行ってください。
        </p>
        
        {/* quoteBox (commonStyles) */}
        <div className={commonStyles.quoteBox}>
          <p className={commonStyles.quoteText}>
            体験談…不登校は先生にとっても神経を使う問題なので、親に不登校という言葉を使う事を遠慮し支援案が伝わらない場合もあります。親側から積極的に、支援を求めてください。
          </p>
        </div>

        {/* encouragementText (commonStyles) */}
        <h3 className={commonStyles.encouragementText}>
          考えるのは子どもの笑顔。<br />
          プライドは捨てて、いろんなところに相談して
        </h3>
      </div>

      {/* セクション2: 学校支援の種類 (styles) */}
      <div className={styles.section01Middle}>
        {/* sectionTitle (commonStyles) */}
        <h3 className={commonStyles.sectionTitle}>
          学校の中にどんな支援があるの？ 支援の種類
        </h3>
        {/* sectionDescription (commonStyles) */}
        <p className={commonStyles.sectionDescription}>
          福井県や各市町が提供している不登校支援には主に以下のものがあります。 ※すべて無料
        </p>
        
        {/* supportBox (commonStyles) */}
        <div className={commonStyles.supportBox}>
          <h4 className={commonStyles.supportTitle}>スクールカウンセラーの紹介</h4>
          <p className={commonStyles.supportDescription}>
            悩みを聞く専門家であるカウンセラーが、児童生徒の悩みや思いを聞いたり、アドバイスしたりします。先生には言えない（言いにくい）ことも話せます。保護者も相談できます。<br />
            ※相談依頼は、各学校へお問い合わせください。
          </p>
        </div>

        <div className={commonStyles.supportBox}>
          <h4 className={commonStyles.supportTitle}>校内サポートルーム</h4>
          <p className={commonStyles.supportDescription}>
            県内５０校に設置　詳しくはどこにかいてあるのかな？
          </p>
          <button className={commonStyles.projectButton}>
            <img src={yubiIcon} alt="アイコン" className={commonStyles.buttonIcon} />
            <span>校内サポートルーム情報を見る</span>
          </button>
        </div>

        <div className={commonStyles.supportBox}>
          <h4 className={commonStyles.supportTitle}>ライフパートナー制度</h4>
          <p className={commonStyles.supportDescription}>
            大学生が一人ひとりをサポートしてくれる　詳しくはこちら（リンクはないのか？）
          </p>
          <button className={commonStyles.projectButton}>
            <img src={yubiIcon} alt="アイコン" className={commonStyles.buttonIcon} />
            <span>ライフパートナー制度の情報を見る</span>
          </button>
        </div>

        {/* projectButtonHighlight (commonStyles) */}
        <button className={commonStyles.projectButtonHighlight}>
          <img src={yubiIcon} alt="アイコン" className={commonStyles.buttonIcon} />
          <span>体験談をみてみよう</span>
        </button>
      </div>

      {/* フッター */}
      <Footer />
    </div>
  );
};

export default Section01Content;
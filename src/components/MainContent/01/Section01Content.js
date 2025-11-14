// src/components/MainContent/01/Section01Content.js
// （変更不要・確認用）

import React from 'react';
import styles from './Section01Content.module.css'; // ← 自身のCSSのみをインポート
import yubiIcon from '../../../assets/images/yubi.png';
import Footer from '../../common/Footer';
import roadNumberImage from '../../../assets/icons/01.png';

const Section01Content = () => {
  return (
    <div className={styles.section01Content}> {/* ← 自身のクラス名を使用 */}
      {/* セクション1: タイトル部分 */}
      <div className={styles.section01Top}>
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
              <img src={roadNumberImage} alt="01" className={styles.roadNumberImage} />
            </div>
          </div>
          <h1 className={styles.mainTitle}>学校に相談</h1>
        </div>
        <h2 className={styles.subtitle}>まずは学校に相談してみよう</h2>
        <p className={styles.description}>
          学校に電話して、「学校に行けない状態になってしまった」事を伝え、相談に行ってください。
        </p>
        
        {/* 体験談 */}
        <div className={styles.quoteBox}>
          <p className={styles.quoteText}>
            体験談…不登校は先生にとっても神経を使う問題なので、親に不登校という言葉を使う事を遠慮し支援案が伝わらない場合もあります。親側から積極的に、支援を求めてください。
          </p>
        </div>

        <h3 className={styles.encouragementText}>
          考えるのは子どもの笑顔。<br />
          プライドは捨てて、いろんなところに相談して
        </h3>
      </div>

      {/* セクション2: 学校支援の種類 */}
      <div className={styles.section01Middle}>
        <h3 className={styles.sectionTitle}>
          学校の中にどんな支援があるの？ 支援の種類
        </h3>
        <p className={styles.sectionDescription}>
          福井県や各市町が提供している不登校支援には主に以下のものがあります。 ※すべて無料
        </p>
        
        {/* スクールカウンセラーの紹介 */}
        <div className={styles.supportBox}>
          <h4 className={styles.supportTitle}>スクールカウンセラーの紹介</h4>
          <p className={styles.supportDescription}>
            悩みを聞く専門家であるカウンセラーが、児童生徒の悩みや思いを聞いたり、アドバイスしたりします。先生には言えない（言いにくい）ことも話せます。保護者も相談できます。<br />
            ※相談依頼は、各学校へお問い合わせください。
          </p>
        </div>

        {/* 校内サポートルーム */}
        <div className={styles.supportBox}>
          <h4 className={styles.supportTitle}>校内サポートルーム</h4>
          <p className={styles.supportDescription}>
            県内５０校に設置　詳しくはどこにかいてあるのかな？
          </p>
          <button className={styles.projectButton}>
            <img src={yubiIcon} alt="アイコン" className={styles.buttonIcon} />
            <span>校内サポートルーム情報を見る</span>
          </button>
        </div>

        {/* ライフパートナー制度 */}
        <div className={styles.supportBox}>
          <h4 className={styles.supportTitle}>ライフパートナー制度</h4>
          <p className={styles.supportDescription}>
            大学生が一人ひとりをサポートしてくれる　詳しくはこちら（リンクはないのか？）
          </p>
          <button className={styles.projectButton}>
            <img src={yubiIcon} alt="アイコン" className={styles.buttonIcon} />
            <span>ライフパートナー制度の情報を見る</span>
          </button>
        </div>

        <button className={styles.projectButtonHighlight}>
          <img src={yubiIcon} alt="アイコン" className={styles.buttonIcon} />
          <span>体験談をみてみよう</span>
        </button>
      </div>

      {/* フッター */}
      <Footer />
    </div>
  );
};

export default Section01Content;
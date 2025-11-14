// src/components/MainContent/00/Section00Content.js
// （変更不要・確認用）

import React from 'react';
import styles from './Section00Content.module.css'; // ← 自身のCSSのみをインポート
import yubiIcon from '../../../assets/images/yubi.png';
import Footer from '../../common/Footer';
import roadNumberImage from '../../../assets/icons/00.png';

const Section00Content = () => {
  return (
    <div className={styles.section00Content}> {/* ← 自身のクラス名を使用 */}
      {/* セクション1: タイトル部分 */}
      <div className={styles.section00Top}>
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
            <div className={styles.roadNumber}><img src={roadNumberImage} alt="00" className={styles.roadNumberImage} /></div>
          </div>
          <h1 className={styles.mainTitle}>まずどうする</h1>
        </div>
        <h2 className={styles.subtitle}>
          ＼　大丈夫です。なんとかなります。／<br />
          ご家族が落ち着くことが第一です
        </h2>
        <p className={styles.description}>
          不登校になっても人生が終わる訳ではありません。<br />
          お子さんは今、自分の心を守るため、必死に戦っているところです。<br />
          サボりたいが為に不登校になる子どもはほとんどいません。<br />
          お子さんの心が回復できるように、周囲が慌てず、落ち着いて、子どもが安心できる家庭を維持する事を意識してください。
        </p>
      </div>

      {/* セクション2: 不登校と引きこもりの違い */}
      <div className={styles.section00Middle}>
        <h3 className={styles.sectionTitle}>
          注意…不登校から引きこもりへ悪化させてはいけない
        </h3>
        <p className={styles.sectionDescription}>
          不登校と引きこもりの違いはなんでしょう？「不登校」は学校に行かない事。外出が出来る元気な子どもたちも含まれます。
        </p>
        
        {/* 不登校の定義 */}
        <div className={styles.quoteBox}>
          <p className={styles.quoteText}>
            文部科学省の定義によると、<br />
            「年間30日以上、病気や経済的な理由ではなく、何らかの心理的・情緒的、あるいは社会的な要因・背景により登校しない、あるいはできない児童生徒」を指します。
          </p>
        </div>

        <p className={styles.sectionDescription}>
          一方「引きこもり」は自分の部屋や家から出ない状態の事
        </p>

        {/* 引きこもりの定義 */}
        <div className={styles.quoteBox}>
          <p className={styles.quoteText}>
            厚生労働省の定義によると、<br />
            「仕事や学校に行かず、家庭以外の人との交流をほとんどせず、原則6か月以上にわたって続けて自宅にとどまり続けている状態」を指します。
          </p>
        </div>

        <p className={styles.sectionDescription}>
          こちらは深刻です。家族の関係性が破綻している事も多く、近年社会問題とされている「8050問題」にもなりかねません。
        </p>

        {/* 8050問題の説明 */}
        <div className={styles.quoteBox}>
          <p className={styles.quoteText}>
            8050問題…80代の親が、自宅にひきこもる50代の子どもの生活を支え、経済的にも精神的にも行き詰まってしまう状態のこと。
          </p>
        </div>

        <p className={styles.longDescription}>
          そうならせないためには、不登校になったお子さんへの接し方が何より大切です。<br />
          まず覚えておいていただきたいのは、小学校・中学校は登校しなくても卒業できます。高校の受験にも登校日数は関係ありません。<br />
          焦らなくても、大丈夫です。勉強くらい、その気になればいくらでも巻き返せます。
        </p>

        <button className={styles.projectButton}>
          <img src={yubiIcon} alt="アイコン" className={styles.buttonIcon} />
          <span>小中学校の卒業について</span>
        </button>
      </div>

      {/* セクション3: 子どもへの接し方 */}
      <div className={styles.section00Bottom}>
        <h3 className={styles.sectionTitle}>
          まずは、子どもを責めないこと。
        </h3>
        <p className={styles.longDescription}>
          「なんで行かないの？」「いつまで休むの？」と問い詰められると、子どもはますます自信を失い、自分の居場所を見失ってしまいます。今は「心を回復する時間」だととらえて、そっと見守ってあげてください。<br /><br />
          そして、リビングなど家族の集まる場所を、子どもにとって「過ごしやすい場所」にしておくことも大切です。話しかけなくてもいい、一緒にテレビを見るだけでもいい、安心していられる空間があるだけで、子どもは少しずつ外の世界に目を向ける力を取り戻していきます。<br /><br />
          どこにも居場所がないと感じてしまうと、子どもは自分の部屋に閉じこもりがちになります。そうならないように、「ここにいていいよ」「何も話さなくていいよ」というメッセージを、日々の関わりの中で伝えていきましょう。家庭の中に、ほっとできる場所があること。それが、子どもの回復への第一歩になります。
        </p>

        <button className={styles.projectButton}>
          <img src={yubiIcon} alt="アイコン" className={styles.buttonIcon} />
          <span>体験談をみてみよう</span>
        </button>
      </div>

      {/* フッター */}
      <Footer />
    </div>
  );
};

export default Section00Content;
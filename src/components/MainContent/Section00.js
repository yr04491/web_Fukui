import React from 'react';
import styles from './Section00.module.css';
import dotlineImage from '../../assets/images/dotline.png';
import vector0_1 from '../../assets/icons/vector0.png';
import vector0_2 from '../../assets/icons/vector0.png';
import vectorRB from '../../assets/images/vectorRB.png';

const Section00 = () => {
  return (
    <div className={styles.section00}>
      <div className={styles.titleWrapper}>
        <div className={styles.logoContainer}>
          <span className={styles.roadText}>ROAD</span>
          <img src={vector0_1} alt="0" className={styles.logoChar} />
          <img src={vector0_2} alt="0" className={styles.logoChar} />
        </div>
        <h2 className={styles.mainTitle}>まずどうする</h2>
        <div className={styles.dotline} style={{ backgroundImage: `url(${dotlineImage})` }}></div>
      </div>

      <div className={styles.contentFrame}>
        <h3 className={styles.contentTitle}>＼　大丈夫です。なんとかなります。／</h3>
        <p className={styles.contentText}>
          お子さんは今、自分の心を守るため、必死に戦っているところです。サボりたいが為に不登校になる子どもはほとんどいません。お子さんの心が回復できるように、周囲が慌てず、落ち着いて、子どもが安心できる家庭を維持する事を意識してください。
        </p>
        <button className={styles.projectButton}>
          <div className={styles.bookIcon}></div>
          <span>心が落ち着くかも。私たちの想いを読んでみてください</span>
        </button>
      </div>

      <div className={styles.experienceSection}>
        <h3 className={styles.experienceTitle}>みんなの体験談を見てみよう</h3>
        <div className={styles.tweetArea}>
          {/* ツイートカード1 */}
          <div className={styles.tweetCard}>
            <p className={styles.tweetText}>毎日学校の先生と、UNOや雑談をして30分すごしてます。</p>
            <div className={styles.tweetDivider}></div>
            <div className={styles.tagArea}>
              <span className={styles.tag}>#小学生</span>
              <span className={styles.tag}>#学校活用術</span>
              <span className={styles.tag}>#学校活用術</span>
            </div>
            <div className={styles.tweetFooter}>
              <div className={styles.authorInfo}>
                <div className={styles.authorAvatar}>
                  <span>R</span>
                </div>
                <span className={styles.authorName}>ひろまま</span>
              </div>
              <span className={styles.tweetDate}>2025.07.03</span>
            </div>
          </div>

          {/* ツイートカード2（同じ構造を複製） */}
          <div className={styles.tweetCard}>
            <p className={styles.tweetText}>毎日学校の先生と、UNOや雑談をして30分すごしてます。</p>
            <div className={styles.tweetDivider}></div>
            <div className={styles.tagArea}>
              <span className={styles.tag}>#小学生</span>
              <span className={styles.tag}>#学校活用術</span>
              <span className={styles.tag}>#学校活用術</span>
            </div>
            <div className={styles.tweetFooter}>
              <div className={styles.authorInfo}>
                <div className={styles.authorAvatar}>
                  <span>R</span>
                </div>
                <span className={styles.authorName}>ひろまま</span>
              </div>
              <span className={styles.tweetDate}>2025.07.03</span>
            </div>
          </div>
        </div>

        <button className={styles.moreButton}>
          <img src={vectorRB} alt="アイコン" className={styles.playIcon} />
          <span>みんなの体験談をもっと見てみる</span>
        </button>
      </div>
    </div>
  );
};

export default Section00;

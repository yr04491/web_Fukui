import React from 'react';
import styles from './Section02.module.css';
import dotlineImage from '../../assets/images/dotline.png';
import vectorRB from '../../assets/images/vectorRB.png';
import vector0 from '../../assets/icons/vector0.png';
import vector2 from '../../assets/icons/vector2.png';

const Section02 = () => {
  return (
    <div className={styles.section02}>
      <div className={styles.titleWrapper}>
        <div className={styles.logoContainer}>
          <span className={styles.roadText}>ROAD</span>
          <img src={vector0} alt="0" className={styles.logoChar} />
          <img src={vector2} alt="2" className={styles.logoChar} />
        </div>
        <h2 className={styles.mainTitle}>行政が行う公的支援</h2>
        <div className={styles.dotline} style={{ backgroundImage: `url(${dotlineImage})` }}></div>
      </div>

      <div className={styles.contentFrame}>
        <h3 className={styles.contentTitle}>公的な支援機関はいくつかあります</h3>
        <div className={styles.contentText}>
          <p>◯ちゃれんじ教室</p>
          <p>◯ソーシャルワーカー</p>
          <p>など</p>
        </div>
        <button className={styles.projectButton}>
          <img src={vectorRB} alt="アイコン" className={styles.playIcon} />
          <span>相談の窓口などご紹介。福井県内各所、利用しやすいところを選んでください。</span>
        </button>
      </div>

      <div className={styles.experienceSection}>
        <div className={styles.experienceHeader}>
          <span className={styles.experienceTag}>実際に活用している話を見てみよう！</span>
          <h3 className={styles.experienceTitle}>公的支援を利用してどうだった？</h3>
        </div>
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

export default Section02;

import React from 'react';
import styles from './Section01.module.css';
import dotlineImage from '../../assets/images/dotline.png';
import vectorRB from '../../assets/images/vectorRB.png';
import vector0 from '../../assets/icons/vector0.png';
import vector1 from '../../assets/icons/vector1.png';


const Section01 = () => {
  return (
    <div className={styles.section01}>
      <div className={styles.titleWrapper}>
        <div className={styles.logoContainer}>
          <span className={styles.roadText}>ROAD</span>
          <img src={vector0} alt="1" className={styles.logoChar} />
          <img src={vector1} alt="1" className={styles.logoChar} />
        </div>
        <h2 className={styles.mainTitle}>学校に相談</h2>
        <div className={styles.dotline} style={{ backgroundImage: `url(${dotlineImage})` }}></div>
      </div>

      <div className={styles.contentFrame}>
        <h3 className={styles.contentTitle}>学校には いろんなサポートがあります</h3>
        <p className={styles.contentText}>
          ◯スクールカウンセラー紹介 ◯校内サポートルーム ◯ライフパートナー制度　など
        </p>
        <button className={styles.projectButton}>
          <img src={vectorRB} alt="アイコン" className={styles.playIcon} />
          <span>親側から積極的に支援を求めて下さい。サポートについて詳しく紹介しています。</span>
        </button>
      </div>

      <div className={styles.experienceSection}>
        <div className={styles.experienceHeader}>
          <span className={styles.experienceTag}>学校もみんなのペースで活用！</span>
          <h3 className={styles.experienceTitle}>みんなの学校活用術</h3>
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
          <span>みんなの学校活用術をもっと見てみる</span>
        </button>
      </div>
    </div>
  );
};

export default Section01;

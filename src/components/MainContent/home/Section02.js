import React from 'react';
import styles from './Section02.module.css';
import dotlineImage from '../../../assets/images/dotline.png';
import vectorRB from '../../../assets/images/vectorRB.png';
import vector0 from '../../../assets/icons/vector0.png';
import vector2 from '../../../assets/icons/vector2.png';
import TweetCard from '../../common/TweetCard/TweetCard';

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
          {/* カードID指定でツイートカードを表示 */}
          <TweetCard cardId={5} />
          <TweetCard cardId={6} />
          <TweetCard cardId={1} />
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

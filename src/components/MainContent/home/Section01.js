import React from 'react';
import styles from './Section01.module.css';
import dotlineImage from '../../../assets/images/dotline.png';
import vectorRB from '../../../assets/images/vectorRB.png';
import vector0 from '../../../assets/icons/vector0.png';
import vector1 from '../../../assets/icons/vector1.png';
import TweetCard from '../../common/TweetCard/TweetCard';


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
        <h3 className={styles.contentTitle}>学校にはいろんなサポートがあります</h3>
        <div className={styles.contentText}>
          <p>◯スクールカウンセラー紹介</p>
          <p>◯校内サポートルーム</p>
          <p>◯ライフパートナー制度 など</p>
        </div>
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
          {/* カードID指定でツイートカードを表示 */}
          <TweetCard cardId={3} />
          <TweetCard cardId={4} />
          <TweetCard cardId={5} />
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

import React from 'react';
import styles from './ExperienceSection.module.css';
import vectorRB from '../../../assets/images/vectorRB.png';
import TweetCard from '../TweetCard/TweetCard';

/**
 * 体験談セクションコンポーネント
 * ツイートカードと「もっと見る」ボタンを表示する共通コンポーネント
 * 
 * @param {string} tag - タグテキスト (オプショナル、Section01のみ使用)
 * @param {string} title - セクションタイトル
 * @param {Array<number>} tweetCardIds - 表示するTweetCardのID配列
 * @param {string} moreButtonText - 「もっと見る」ボタンのテキスト
 */
const ExperienceSection = ({ tag, title, tweetCardIds, moreButtonText }) => {
  return (
    <div className={styles.experienceSection}>
      {tag && (
        <div className={styles.experienceHeader}>
          <span className={styles.experienceTag}>{tag}</span>
          <h3 className={styles.experienceTitle}>{title}</h3>
        </div>
      )}
      {!tag && <h3 className={styles.experienceTitle}>{title}</h3>}
      
      <div className={styles.tweetArea}>
        {tweetCardIds.map(id => (
          <TweetCard key={id} cardId={id} />
        ))}
      </div>

      <button className={styles.moreButton}>
        <img src={vectorRB} alt="アイコン" className={styles.playIcon} />
        <span>{moreButtonText}</span>
      </button>
    </div>
  );
};

export default ExperienceSection;

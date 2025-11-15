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
 * @param {string} customClass - カスタムCSSクラス (オプショナル)
 * @param {Function} onMoreClick - 「もっと見る」ボタンのクリックハンドラ (オプショナル)
 */
const ExperienceSection = ({ tag, title, tweetCardIds, moreButtonText, customClass, onMoreClick }) => {
  // titleを改行で分割
  const titleLines = title.split('\n');
  
  return (
    <div className={`${styles.experienceSection} ${customClass || ''}`}>
      {tag && (
        <div className={styles.experienceHeader}>
          <span className={styles.experienceTag}>{tag}</span>
          <div className={styles.experienceTitle}>
            {titleLines.map((line, index) => (
              <div key={index} className={index === 0 ? styles.titleLine1 : styles.titleLine2}>
                {line}
              </div>
            ))}
          </div>
        </div>
      )}
      {!tag && (
        <div className={styles.experienceTitle}>
          {titleLines.map((line, index) => (
            <div key={index} className={index === 0 ? styles.titleLine1 : styles.titleLine2}>
              {line}
            </div>
          ))}
        </div>
      )}
      
      <div className={styles.tweetArea}>
        {tweetCardIds.map(id => (
          <TweetCard key={id} cardId={id} />
        ))}
      </div>

      <button className={styles.moreButton} onClick={onMoreClick}>
        <img src={vectorRB} alt="アイコン" className={styles.playIcon} />
        <span>{moreButtonText}</span>
      </button>
    </div>
  );
};

export default ExperienceSection;

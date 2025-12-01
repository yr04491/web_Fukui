import React from 'react';
import { Link } from 'react-router-dom';
import styles from './TweetCard.module.css';
import tweetCards from '../../../data/tweetCards';

const TweetCard = ({ 
  cardId, 
  text, 
  tags = ['#小学生', '#学校活用術', '#学校活用術'], 
  authorName = 'ひろまま', 
  authorInitial = 'R', 
  date = '2025.07.03'
}) => {
  // カードIDが指定された場合は、データからカード情報を取得
  let actualCardId = cardId;
  if (cardId) {
    const cardData = tweetCards.find(card => card.id === cardId);
    if (cardData) {
      text = cardData.text;
      tags = cardData.tags;
      authorName = cardData.authorName;
      authorInitial = cardData.authorInitial;
      date = cardData.date;
    }
  }

  return (
    <Link to={`/tweets/${actualCardId || 1}`} className={styles.cardLink}>
      <div className={styles.tweetCard}>
        <p className={styles.tweetText}>{text}</p>
        <div className={styles.tweetDivider}></div>
{/*       <div className={styles.tagArea}>
          {tags.map((tag, index) => (
            <span key={index} className={styles.tag}>{tag}</span>
          ))}
        </div>
  */}
        <div className={styles.tweetFooter}>
          <div className={styles.authorInfo}>
            <div className={styles.authorAvatar}>
              <span>{authorInitial}</span>
            </div>
            <span className={styles.authorName}>{authorName}</span>
          </div>
          <span className={styles.tweetDate}>{date}</span>
        </div>
      </div>
    </Link>
  );
};

export default TweetCard;

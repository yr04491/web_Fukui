import React from 'react';
import { Link } from 'react-router-dom';
import styles from './ReviewCard.module.css';
import reviewCards from '../../../data/reviewCards';

const ReviewCard = ({ 
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
    const cardData = reviewCards.find(card => card.id === cardId);
    if (cardData) {
      text = cardData.text;
      tags = cardData.tags;
      authorName = cardData.authorName;
      authorInitial = cardData.authorInitial;
      date = cardData.date;
    }
  }

  return (
    <Link to={`/reviews/${actualCardId || 1}`} className={styles.cardLink}>
      <div className={styles.reviewCard}>
        <p className={styles.reviewText}>{text}</p>
        <div className={styles.reviewDivider}></div>
{/*       <div className={styles.tagArea}>
          {tags.map((tag, index) => (
            <span key={index} className={styles.tag}>{tag}</span>
          ))}
        </div>
  */}
        <div className={styles.reviewFooter}>
          <div className={styles.authorInfo}>
            <div className={styles.authorAvatar}>
              <span>{authorInitial}</span>
            </div>
            <span className={styles.authorName}>{authorName}</span>
          </div>
          <span className={styles.reviewDate}>{date}</span>
        </div>
      </div>
    </Link>
  );
};

export default ReviewCard;

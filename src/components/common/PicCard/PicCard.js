import React from 'react';
import styles from './PicCard.module.css';
import tweetCards from '../../../data/tweetCards';
import dotline2Image from '../../../assets/images/dotline2.png';

const PicCard = ({ 
  cardId, 
  text, 
  image,
  tags = ['#小学生', '#学校活用術', '#学校活用術'], 
  authorName = 'ひろまま', 
  authorInitial = 'R', 
  date = '2025.07.03'
}) => {
  // カードIDが指定された場合は、データからカード情報を取得
  if (cardId) {
    const cardData = tweetCards.find(card => card.id === cardId);
    if (cardData) {
      text = cardData.text;
      tags = cardData.tags;
      authorName = cardData.authorName || 'ユーザー';
      authorInitial = cardData.authorInitial || 'U';
      date = cardData.date || '2025.07.03';
      image = cardData.image || null;
    }
  }

  return (
    <div className={styles.picCard}>
      {/* 画像エリア */}
      {image && (
        <div className={styles.imageContainer} style={{ backgroundImage: `url(${image})` }}></div>
      )}

      <div className={styles.contentContainer}>
        {/* タグエリア */}
        <div className={styles.tagArea}>
          {tags.map((tag, index) => (
            <span key={index} className={styles.tag}>{tag}</span>
          ))}
        </div>
        
        {/* 仕切り線 (画像) */}
        <div className={styles.dotline} style={{ backgroundImage: `url(${dotline2Image})` }}></div>
        
        {/* テキストエリア */}
        <p className={styles.picText}>{text}</p>
        
        {/* 仕切り線 (画像) */}
        <div className={styles.dotline} style={{ backgroundImage: `url(${dotline2Image})` }}></div>
        
        {/* フッターエリア */}
        <div className={styles.cardFooter}>
          <div className={styles.authorInfo}>
            <div className={styles.authorAvatar}>
              <span>{authorInitial}</span>
            </div>
            <span className={styles.authorName}>{authorName}</span>
          </div>
          <span className={styles.cardDate}>{date}</span>
        </div>
      </div>
    </div>
  );
};

export default PicCard;

import React from 'react';
import styles from './PlaceCard.module.css';
import placeCards from '../../../data/placeCards';
import dotline2Image from '../../../assets/images/dotline2.png';

const PlaceCard = ({ cardId, image, tags, title, description }) => {
  // カードIDが指定された場合は、データからカード情報を取得
  if (cardId) {
    const cardData = placeCards.find(card => card.id === cardId);
    if (cardData) {
      image = cardData.image;
      tags = cardData.tags;
      title = cardData.title;
      description = cardData.description;
    }
  }

  return (
    <div className={styles.placeCard}>
      <div className={styles.imageContainer} style={{ backgroundImage: `url(${image})` }}></div>

      <div className={styles.contentContainer}>
        <div className={styles.tagArea}>
          {tags.map((tag, index) => (
            <div key={index} className={styles.tag}>
              <span>{tag}</span>
            </div>
          ))}
        </div>

        <div className={styles.dotline} style={{ backgroundImage: `url(${dotline2Image})` }}></div>
        <div className={styles.placeTitle}>{title}</div>
        <div className={styles.dotline} style={{ backgroundImage: `url(${dotline2Image})` }}></div>

      </div>
    </div>
  );
};

export default PlaceCard;

// src/components/common/FlexiCard/FlexiCard.js
// FlexiCard - 柔軟に使える汎用カードコンポーネント
// どんなコンテンツも入れられる自由度の高いカード

import React from 'react';
import styles from './FlexiCard.module.css';

const FlexiCard = ({ title, description, buttonText, onButtonClick }) => {
  return (
    <div className={styles.flexiCard}>
      <h4 className={styles.flexiCardTitle} dangerouslySetInnerHTML={{ __html: title }} />
      <div className={styles.flexiCardDivider}></div>
      <p className={styles.flexiCardDescription}>{description}</p>
      {buttonText && (
        <button className={styles.flexiCardButton} onClick={onButtonClick}>
          {buttonText}
        </button>
      )}
    </div>
  );
};

export default FlexiCard;

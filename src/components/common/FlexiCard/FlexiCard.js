// src/components/common/FlexiCard/FlexiCard.js
// FlexiCard - 柔軟に使える汎用カードコンポーネント
// どんなコンテンツも入れられる自由度の高いカード

import React from 'react';
import styles from './FlexiCard.module.css';
import newwindowIcon from '../../../assets/images/newwindow.png';

const FlexiCard = ({ title, description, buttonText, onButtonClick, phone, phones, url }) => {
  // \nを改行に変換（タイトル・説明文で共用）
  const renderMultiline = (text) => {
    return text.split('\n').map((line, index, array) => (
      <React.Fragment key={index}>
        {line}
        {index < array.length - 1 && <br />}
      </React.Fragment>
    ));
  };

  // 電話番号リスト（number: 番号 / note: 補足）を、番号だけリンクにして表示
  const renderPhoneList = () => (
    <p className={styles.flexiCardPhoneList}>
      {phones.map((item, index) => (
        <React.Fragment key={index}>
          <a className={styles.flexiCardPhoneLink} href={`tel:${item.number}`}>
            {item.number}
          </a>
          {item.note && <><br />{item.note}</>}
          {index < phones.length - 1 && <br />}
        </React.Fragment>
      ))}
    </p>
  );

  const handleButtonClick = () => {
    if (url) {
      window.open(url, '_blank', 'noopener noreferrer');
    } else if (onButtonClick) {
      onButtonClick();
    }
  };

  return (
    <div className={styles.flexiCard}>
      <h4 className={styles.flexiCardTitle}>{renderMultiline(title)}</h4>
      <div className={styles.flexiCardDivider}></div>
      {description && (
        <p className={styles.flexiCardDescription}>{renderMultiline(description)}</p>
      )}
      {phones && phones.length > 0 && renderPhoneList()}
      {phone ? (
        <a className={styles.flexiCardButton} href={`tel:${phone}`}>
          <img src={newwindowIcon} alt="" className={styles.buttonIcon} />
          {phone}
        </a>
      ) : (
        buttonText && (
          <button className={styles.flexiCardButton} onClick={handleButtonClick}>
            <img src={newwindowIcon} alt="" className={styles.buttonIcon} />
            {buttonText}
          </button>
        )
      )}
    </div>
  );
};

export default FlexiCard;

import React from 'react';
import styles from './Section03.module.css';
import dotlineImage from '../../../assets/images/dotline.png';
import roadNumberImage from '../../../assets/icons/03_0.png';
import PlaceCard from '../../common/PlaceCard/PlaceCard';

const Section03 = () => {
  return (
    <div className={styles.section03}>
      <div className={styles.titleWrapper}>
        <div className={styles.logoContainer}>
          <span className={styles.roadText}>ROAD</span>
          <img src={roadNumberImage} alt="03" className={styles.logoChar} />
        </div>
        <h1 className={styles.mainTitle}>まだまだある！ みんなの居場所</h1>
        <div className={styles.dotline} style={{ backgroundImage: `url(${dotlineImage})` }}></div>
      </div>

      {/* こどもの居場所セクション */}
      <div className={styles.placeSection}>
        <div className={styles.placeHeader}>
          <span className={styles.placeTag}>平日・休日参加できるところ</span>
          <h3 className={styles.placeTitle}>こどもの居場所</h3>
        </div>
        <div className={styles.placeCardArea}>
          {/* カードID指定でプレースカードを表示 */}
          <PlaceCard cardId={1} />
          <PlaceCard cardId={2} />
          <PlaceCard cardId={3} />
        </div>

        <button className={styles.projectButton}>
          <div className={styles.buttonIconContainer}>
            <svg className={styles.playArrowIcon} viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <span>こどもの居場所をもっと見る</span>
        </button>
      </div>

      {/* 保護者の居場所セクション */}
      <div className={styles.placeSection}>
        <div className={styles.placeHeader}>
          <span className={styles.placeTag}>悩みや解決策など、みんなで話してみよう！</span>
          <h3 className={styles.placeTitle}>保護者の居場所</h3>
        </div>
        <div className={styles.placeCardArea}>
          {/* カードID指定でプレースカードを表示 */}
          <PlaceCard cardId={4} />
          <PlaceCard cardId={5} />
          <PlaceCard cardId={6} />
        </div>

        <button className={styles.projectButton}>
          <div className={styles.buttonIconContainer}>
            <svg className={styles.playArrowIcon} viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <span>保護者の居場所をもっと見る</span>
        </button>
      </div>
    </div>
  );
};

export default Section03;

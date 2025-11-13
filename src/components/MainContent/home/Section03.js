import React from 'react';
import styles from './Section03.module.css';
import roadNumberImage from '../../../assets/icons/03_0.png';
import PlaceCard from '../../common/PlaceCard/PlaceCard';
import SectionTitle from '../../common/SectionTitle';

const Section03 = () => {
  return (
    <div className={styles.section03}>
      <SectionTitle 
        roadNumber="03" 
        title="まだまだある！ みんなの居場所" 
        roadNumberImage={roadNumberImage} 
      />

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

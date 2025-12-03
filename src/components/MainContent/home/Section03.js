import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Section03.module.css';
import roadNumberImage from '../../../assets/icons/03_0.png';
import PlaceCard from '../../common/PlaceCard/PlaceCard';
import SectionTitle from '../../common/SectionTitle';

const Section03 = () => {
  const navigate = useNavigate();
  return (
    <div className={styles.section03}>
      <SectionTitle 
        roadNumber="03" 
        title="まだまだある！
みんなの居場所" 
        roadNumberImage={roadNumberImage} 
      />
      
      {/* 説明テキスト */}
      <div className={styles.description}>
        <p className={styles.descriptionTitle}>
          子どもだけじゃない。<br />
          保護者のみなさんの居場所もあります。
        </p>
        <p className={styles.descriptionText}>
          多くの民間団体やサークルが、不登校の子どもたちや保護者の居場所を作ってくれています。保護者のみなさんや、子どもたちに合う場所を見つけてみてください。
        </p>
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

        <button 
          className={styles.projectButton}
          onClick={() => navigate('/places')}
        >
          <div className={styles.playIcon}></div>
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

        <button 
          className={styles.projectButton}
          onClick={() => navigate('/places')}
        >
          <div className={styles.playIcon}></div>
          <span>保護者の居場所をもっと見る</span>
        </button>
      </div>
    </div>
  );
};

export default Section03;

import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import layoutStyles from '../../components/MainContent/commonPageLayout.module.css';
import styles from './PlaceDetailPage.module.css';
import placeCards from '../../data/placeCards';
import PlaceCard from '../../components/common/PlaceCard/PlaceCard';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import Footer from '../../components/common/Footer';
import newwindowIcon from '../../assets/images/newwindow.png';

const PlaceDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const card = placeCards.find(c => String(c.id) === String(id));
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const breadcrumbItems = [
    { label: 'TOP', path: '/' },
    { label: '居場所を探す', path: '/places' },
    { label: `みんなの居場所${id}`, path: `/places/${id}` }
  ];

  if (!card) {
    return (
      <div className={layoutStyles.pageContainer}>
        <Breadcrumbs items={breadcrumbItems} />
        <div className={styles.contentArea}>
          <button className={styles.backButton} onClick={() => navigate(-1)}>戻る</button>
          <p>該当の居場所が見つかりません。</p>
        </div>
        <Footer />
      </div>
    );
  }

  // Related: show other place cards (exclude current)
  const related = placeCards.filter(c => c.id !== card.id).slice(0,4);

  // 画像スライダー用の関数
  const images = card.images || [card.image];
  const totalImages = images.length;

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? totalImages - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === totalImages - 1 ? 0 : prev + 1));
  };

  return (
    <div className={layoutStyles.pageContainer}>
      <Breadcrumbs items={breadcrumbItems} />
      
      <div className={styles.contentArea}>
        {/* タブナビゲーション */}
        <div className={styles.tabNav}>
          <div className={`${styles.tab} ${styles.tabActive}`}>
            <img src={newwindowIcon} alt="" className={styles.tabIcon} />
            居場所情報
          </div>
          <Link to={`/places/${id}/reviews`} className={styles.tab}>
            <img src={newwindowIcon} alt="" className={styles.tabIcon} />
            口コミ
          </Link>
        </div>

        {/* タイトルとタグ */}
        <section className={styles.titleSection}>
          <h1 className={styles.pageTitle}>
            {card.title ? card.title.split('\n').map((line, i) => (
              <React.Fragment key={i}>
                {line}
                {i < card.title.split('\n').length - 1 && <br />}
              </React.Fragment>
            )) : 'タイトル'}
          </h1>
          <div className={styles.tagArea}>
            {card.tags && card.tags.map((tag, index) => (
              <div key={index} className={styles.tag}>
                {tag}
              </div>
            ))}
          </div>
        </section>

        {/* 画像スライダー */}
        <section className={styles.imageSlider}>
          <div className={styles.imageContainer}>
            <img src={images[currentImageIndex]} alt={`${card.title} ${currentImageIndex + 1}`} className={styles.image} />
          </div>
          <div className={styles.pagination}>
            <button onClick={handlePrevImage} className={styles.paginationBtn}>←</button>
            <span className={styles.paginationText}>{currentImageIndex + 1} / {totalImages}</span>
            <button onClick={handleNextImage} className={styles.paginationBtn}>→</button>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default PlaceDetailPage;

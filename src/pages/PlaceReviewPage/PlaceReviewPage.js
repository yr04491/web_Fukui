import React from 'react';
import { useParams, Link } from 'react-router-dom';
import layoutStyles from '../../components/MainContent/commonPageLayout.module.css';
import styles from './PlaceReviewPage.module.css';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import Footer from '../../components/common/Footer';
import newwindowIcon from '../../assets/images/newwindow.png';

const PlaceReviewPage = () => {
  const { id } = useParams();

  const breadcrumbItems = [
    { label: 'TOP', path: '/' },
    { label: '居場所を探す', path: '/places' },
    { label: `みんなの居場所${id}`, path: `/places/${id}` }
  ];

  return (
    <div className={layoutStyles.pageContainer}>
      <Breadcrumbs items={breadcrumbItems} />
      
      <div className={styles.contentArea}>
        {/* タブナビゲーション */}
        <div className={styles.tabNav}>
          <Link to={`/places/${id}`} className={styles.tab}>
            <img src={newwindowIcon} alt="" className={styles.tabIcon} />
            居場所情報
          </Link>
          <div className={`${styles.tab} ${styles.tabActive}`}>
            <img src={newwindowIcon} alt="" className={styles.tabIcon} />
            口コミ
          </div>
        </div>

        <main className={styles.main}>
          <p className={styles.placeholder}>口コミを入力するページ</p>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default PlaceReviewPage;

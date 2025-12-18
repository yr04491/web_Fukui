import React from 'react';
import layoutStyles from '../../components/MainContent/commonPageLayout.module.css';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import Footer from '../../components/common/Footer';

const ReviewsPage = () => {
  const breadcrumbItems = [
    { label: 'TOP', path: '/' },
    { label: '口コミ一覧', path: '/reviews' }
  ];

  return (
    <div className={layoutStyles.pageContainer}>
      <Breadcrumbs items={breadcrumbItems} />
      
      <div className={layoutStyles.contentArea}>
        {/* メインコンテンツ（真っ白） */}
      </div>

      <Footer />
    </div>
  );
};

export default ReviewsPage;

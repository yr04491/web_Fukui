import React from 'react';
import layoutStyles from '../commonPageLayout.module.css';
import styles from './PlacesContent.module.css';
import Breadcrumbs from '../../common/Breadcrumbs';
import Footer from '../../common/Footer';
import PlaceCard from '../../common/PlaceCard/PlaceCard';
import dotlineImage from '../../../assets/images/dotline.png';
import SearchIcon from '../../../assets/icons/SearchIcon';
import FilterIcon from '../../../assets/icons/FilterIcon';

const PlacesContent = () => {
  const breadcrumbItems = [
    { label: 'TOP', path: '/' },
    { label: '居場所を探す', path: '/places' }
  ];

  return (
    <div className={layoutStyles.pageContainer}>
      <Breadcrumbs items={breadcrumbItems} />
      
      {/* 検索セクション */}
      <div className={styles.searchSection}>
        <h1 className={styles.searchTitle}>居場所を探す</h1>
        <img src={dotlineImage} alt="" className={styles.dotline} />
        
        <div className={styles.searchBox}>
          {/* 検索入力フィールド */}
          <div className={styles.searchInputWrapper}>
            <SearchIcon size={20} color="#999" />
            <input 
              type="text" 
              placeholder="調べたい内容を、キーワードで記入してください。"
              className={styles.searchInput}
            />
          </div>
          
          {/* ボタンエリア */}
          <div className={styles.buttonArea}>
            <button className={styles.filterButton}>
              <FilterIcon size={16} color="#88D3BC" />
              <span>絞り込み</span>
            </button>
            
            <button className={styles.searchButton}>
              <SearchIcon size={18} color="#fff" />
              <span>検索する</span>
            </button>
          </div>
        </div>
      </div>

      {/* 居場所ピックアップセクション */}
      <div className={styles.pickupSection}>
        <h2 className={styles.pickupTitle}>居場所ピックアップ</h2>
        <div className={styles.dividerLine}></div>
        <p className={styles.pickupDescription}>
          みんなの居場所から、お子さんや保護者の方に合う場所をみつけてみてください。
        </p>
        
        {/* 居場所カードグリッド */}
        <div className={styles.cardsGrid}>
          <PlaceCard cardId={1} />
          <PlaceCard cardId={2} />
          <PlaceCard cardId={3} />
          <PlaceCard cardId={1} />
          <PlaceCard cardId={2} />
          <PlaceCard cardId={3} />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PlacesContent;

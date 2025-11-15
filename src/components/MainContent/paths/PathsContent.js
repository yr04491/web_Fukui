import React from 'react';
import layoutStyles from '../commonPageLayout.module.css';
import styles from './PathsContent.module.css';
import Breadcrumbs from '../../common/Breadcrumbs';
import Footer from '../../common/Footer';
import PlaceCard from '../../common/PlaceCard/PlaceCard';
import dotlineImage from '../../../assets/images/dotline.png';
import SearchIcon from '../../../assets/icons/SearchIcon';
import FilterIcon from '../../../assets/icons/FilterIcon';

const PathsContent = () => {
  const breadcrumbItems = [
    { label: 'TOP', path: '/' },
    { label: '卒業後の進路を探す', path: '/paths' }
  ];

  return (
    <div className={layoutStyles.pageContainer}>
      <Breadcrumbs items={breadcrumbItems} />
      
      {/* 検索セクション */}
      <div className={styles.searchSection}>
        <h1 className={styles.searchTitle}>卒業後の進路を探す</h1>
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
              <FilterIcon size={16} color="#79B5EE" />
              <span>絞り込み</span>
            </button>
            
            <button className={styles.searchButton}>
              <SearchIcon size={18} color="#fff" />
              <span>検索する</span>
            </button>
          </div>
        </div>
      </div>

      {/* 進路ピックアップセクション */}
      <div className={styles.pickupSection}>
        <h2 className={styles.pickupTitle}>検索結果</h2>
        <div className={styles.dividerLine}></div>
        
        {/* 進路カードグリッド */}
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

export default PathsContent;

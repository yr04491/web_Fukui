import React, { useState } from 'react';
import layoutStyles from '../commonPageLayout.module.css';
import styles from './PlacesContent.module.css';
import Breadcrumbs from '../../common/Breadcrumbs';
import Footer from '../../common/Footer';
import PlaceCard from '../../common/PlaceCard/PlaceCard';
import FilterModal from '../../common/FilterModal';
import dotlineImage from '../../../assets/images/dotline.png';
import SearchIcon from '../../../assets/icons/SearchIcon';
import FilterIcon from '../../../assets/icons/FilterIcon';

const PlacesContent = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterCount, setFilterCount] = useState(0);

  const breadcrumbItems = [
    { label: 'TOP', path: '/' },
    { label: '居場所を探す', path: '/places' }
  ];

  const filterConfig = {
    selectedColor: '#88D3BC',
    buttonColor: '#88D3BC',
    categories: [
      {
        title: 'お子さんの学年から探す',
        options: ['小学生から', '中学生から', '高校生から', '卒業している場合']
      },
      {
        title: '状況から探す',
        options: ['進学したい', '専門的なことを学びたい', '一人で学習したい', 'オンラインで授業を受けたい', '学校行事に参加したい', '家以外の場所での居場所を見つけたい', '外部とコミュニケーションを取れる場所に行きたい', '不登校や子育てについて相談したい', '不登校や子育ての未来について見失わない', '不登校や子育てのイベントに参加したい', '友達を探したい']
      },
      {
        title: '施設の区分から探す',
        options: ['フリースクール', '塾', 'オンラインサポート', 'サークル', 'オルタナティブスクール', '習い事', 'イベント']
      }
    ]
  };

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
            <div className={styles.filterRow}>
              <button 
                className={styles.filterButton}
                onClick={() => setIsModalOpen(true)}
              >
                <FilterIcon size={16} color="#88D3BC" />
                <span>絞り込み{filterCount > 0 && `(${filterCount})`}</span>
              </button>
              <button 
                className={styles.clearButton}
                onClick={() => setFilterCount(0)}
              >
                クリア
              </button>
            </div>
            
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

      <FilterModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        filterConfig={filterConfig}
        onApply={setFilterCount}
      />

      <Footer />
    </div>
  );
};

export default PlacesContent;

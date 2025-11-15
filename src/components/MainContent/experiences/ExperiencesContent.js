import React, { useState } from 'react';
import layoutStyles from '../commonPageLayout.module.css'; // 共通CSS（外枠）
import styles from './ExperiencesContent.module.css';
import Breadcrumbs from '../../common/Breadcrumbs';
import Footer from '../../common/Footer';
import TweetCard from '../../common/TweetCard/TweetCard';
import FilterModal from '../../common/FilterModal';
import dotlineImage from '../../../assets/images/dotline.png';
import SearchIcon from '../../../assets/icons/SearchIcon';
import FilterIcon from '../../../assets/icons/FilterIcon';

const ExperiencesContent = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterCount, setFilterCount] = useState(0);

  const breadcrumbItems = [
    { label: 'TOP', path: '/' },
    { label: '体験談を探す', path: '/experiences' }
  ];

  const filterConfig = {
    selectedColor: '#EF9F94',
    buttonColor: '#EF9F94',
    categories: [
      {
        title: 'お子さんの学年から探す',
        options: ['小学生', '中学生', '高校生', '卒業生']
      },
      {
        title: 'きっかけから探す',
        options: ['不登校', '病気', 'いじめ', '発達障がい', 'その他']
      },
      {
        title: '状況から探す',
        options: ['自宅学習', '学校復帰', '進学', '就職', 'その他']
      },
      {
        title: '支援体験から探す',
        options: ['フリースクール', '適応指導教室', 'オンライン学習', '家庭教師', 'その他']
      }
    ]
  };

  return (
    <div className={layoutStyles.pageContainer}>
      <Breadcrumbs items={breadcrumbItems} />
      
      {/* 検索セクション */}
      <div className={styles.searchSection}>
        <h1 className={styles.searchTitle}>体験談を探す</h1>
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
            <button 
              className={styles.filterButton}
              onClick={() => setIsModalOpen(true)}
            >
              <FilterIcon size={16} color="#EF9F94" />
              <span>絞り込み{filterCount > 0 && `(${filterCount})`}</span>
            </button>
            
            <button className={styles.searchButton}>
              <SearchIcon size={18} color="#fff" />
              <span>検索する</span>
            </button>
          </div>
        </div>
      </div>

      {/* 体験談ピックアップセクション */}
      <div className={styles.pickupSection}>
        <h2 className={styles.pickupTitle}>体験談ピックアップ</h2>
        <div className={styles.dividerLine}></div>
        <p className={styles.pickupDescription}>
          みんなの体験談から、似ているところや参考にしたい情報をみつけてみてください。
        </p>
        
        {/* 体験談カードグリッド */}
        <div className={styles.cardsGrid}>
          <TweetCard cardId={1} />
          <TweetCard cardId={1} />
          <TweetCard cardId={2} />
          <TweetCard cardId={2} />
          <TweetCard cardId={3} />
          <TweetCard cardId={3} />
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

export default ExperiencesContent;

import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import layoutStyles from '../../components/MainContent/commonPageLayout.module.css';
import styles from './TweetSearchResults.module.css';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import Footer from '../../components/common/Footer';
import TweetCard from '../../components/common/TweetCard/TweetCard';
import FilterModal from '../../components/common/FilterModal';
import SearchIcon from '../../assets/icons/SearchIcon';
import FilterIcon from '../../assets/icons/FilterIcon';

/**
 * TweetSearchResults
 * - 現時点ではメインコンテンツは空のプレースホルダにする
 * - 将来的に絞り込み、ソート、ページネーション、検索クエリ反映などを実装予定
 */
const TweetSearchResults = () => {
  const location = useLocation();
  const [activeFilters, setActiveFilters] = useState(location.state?.filters || []);
  const [searchKeyword, setSearchKeyword] = useState(location.state?.keyword || '');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterCount, setFilterCount] = useState(location.state?.filters?.length || 0);
  
  const breadcrumbItems = [
    { label: 'TOP', path: '/' },
    { label: '体験談を探す', path: '/experiences' },
    { label: '検索結果', path: '/experiences/search' }
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

  const getDisplayTag = (uniqueTag) => {
    return uniqueTag.split('_').slice(1).join('_');
  };

  const removeFilter = (tagToRemove) => {
    setActiveFilters(prev => prev.filter(tag => tag !== tagToRemove));
    setFilterCount(prev => Math.max(0, prev - 1));
  };

  const removeKeyword = () => {
    setSearchKeyword('');
  };

  const handleApplyFilters = (count, filters) => {
    setFilterCount(count);
    setActiveFilters(filters);
  };

  const handleReSearch = () => {
    // 再検索処理（現時点ではカード表示を更新する想定）
    console.log('再検索:', { keyword: searchKeyword, filters: activeFilters });
  };

  return (
    <div className={layoutStyles.pageContainer}>
      <Breadcrumbs items={breadcrumbItems} />
      
      <div className={styles.contentArea}>
        {/* 検索エリア */}
        <div className={styles.searchSection}>
          <div className={styles.searchBox}>
            <div className={styles.searchInputWrapper}>
              <button className={styles.searchIconButton} onClick={handleReSearch}>
                <SearchIcon size={20} color="#999" />
              </button>
              <input 
                type="text" 
                placeholder="キーワードを入力して検索"
                className={styles.searchInput}
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleReSearch()}
              />
            </div>
            
            <div className={styles.filterArea}>
              <button 
                className={styles.filterButton}
                onClick={() => setIsModalOpen(true)}
              >
                <FilterIcon size={16} color="#EF9F94" />
                <span>絞り込み{filterCount > 0 && `(${filterCount})`}</span>
              </button>
              
              {searchKeyword && (
                <div className={styles.filterTag}>
                  <span>{searchKeyword}</span>
                  <button 
                    className={styles.tagRemove}
                    onClick={removeKeyword}
                  >
                    ×
                  </button>
                </div>
              )}
              
              {activeFilters.map((tag, index) => (
                <div key={index} className={styles.filterTag}>
                  <span>{getDisplayTag(tag)}</span>
                  <button 
                    className={styles.tagRemove}
                    onClick={() => removeFilter(tag)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 検索結果セクション */}
        <div className={styles.resultsSection}>
          <h2 className={styles.resultsTitle}>検索結果</h2>
          <div className={styles.dividerLine}></div>
          <p className={styles.resultsDescription}>
            みんなの体験談から、似ているところや参考にしたい情報をみつけてみてください。
          </p>
          
          {/* 体験談カードグリッド */}
          <div className={styles.cardsGrid}>
            <TweetCard cardId={1} />
            <TweetCard cardId={2} />
            <TweetCard cardId={3} />
            <TweetCard cardId={1} />
            <TweetCard cardId={2} />
          </div>
        </div>
      </div>

      <FilterModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        filterConfig={filterConfig}
        onApply={handleApplyFilters}
      />

      <Footer />
    </div>
  );
};

export default TweetSearchResults;

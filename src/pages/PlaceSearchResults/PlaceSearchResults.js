import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import layoutStyles from '../../components/MainContent/commonPageLayout.module.css';
import styles from './PlaceSearchResults.module.css';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import Footer from '../../components/common/Footer';
import PlaceCard from '../../components/common/PlaceCard/PlaceCard';
import FilterModal from '../../components/common/FilterModal';
import SearchIcon from '../../assets/icons/SearchIcon';
import FilterIcon from '../../assets/icons/FilterIcon';

/**
 * PlaceSearchResults
 * - 居場所検索結果ページ
 * - 将来的に絞り込み、ソート、ページネーション、検索クエリ反映などを実装予定
 */
const PlaceSearchResults = () => {
  const location = useLocation();
  const [activeFilters, setActiveFilters] = useState(location.state?.filters || []);
  const [searchKeyword, setSearchKeyword] = useState(location.state?.keyword || '');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterCount, setFilterCount] = useState(location.state?.filters?.length || 0);
  
  const breadcrumbItems = [
    { label: 'TOP', path: '/' },
    { label: '居場所をさがす', path: '/places' },
    { label: '検索結果', path: '/places/search' }
  ];

  const filterConfig = {
    selectedColor: '#88D3BC',
    buttonColor: '#88D3BC',
    categories: [
      {
        title: 'お子さんの学年からさがす',
        options: ['小学生から', '中学生から', '高校生から', '卒業している場合']
      },
      {
        title: '状況からさがす',
        options: ['進学したい', '専門的なことを学びたい', '一人で学習したい', 'オンラインで授業を受けたい', '学校行事に参加したい', '家以外の場所での居場所を見つけたい', '外部とコミュニケーションを取れる場所に行きたい', '不登校や子育てについて相談したい', '不登校や子育ての未来について見失わない', '不登校や子育てのイベントに参加したい', '友達をさがしたい']
      },
      {
        title: '施設の区分からさがす',
        options: ['フリースクール', '塾', 'オンラインサポート', 'サークル', 'オルタナティブスクール', '習い事', 'イベント']
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
                <FilterIcon size={16} color="#88D3BC" />
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
            みんなの居場所から、お子さんや保護者の方に合う場所をみつけてみてください。
          </p>
          
          {/* 居場所カードグリッド */}
          <div className={styles.cardsGrid}>
            <PlaceCard cardId={1} />
            <PlaceCard cardId={2} />
            <PlaceCard cardId={3} />
            <PlaceCard cardId={1} />
            <PlaceCard cardId={2} />
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

export default PlaceSearchResults;

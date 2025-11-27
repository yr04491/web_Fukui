import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import layoutStyles from '../commonPageLayout.module.css';
import styles from './ExperiencesSearchResultsContent.module.css';
import Breadcrumbs from '../../common/Breadcrumbs';
import Footer from '../../common/Footer';
import TweetCard from '../../common/TweetCard/TweetCard';
import FilterModal from '../../common/FilterModal';
import dotlineImage from '../../../assets/images/dotline.png';
import SearchIcon from '../../../assets/icons/SearchIcon';
import FilterIcon from '../../../assets/icons/FilterIcon';
import { searchExperiences } from '../../../utils/gasApi';

const ExperiencesSearchResultsContent = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterCount, setFilterCount] = useState(0);
  const [filters, setFilters] = useState({});
  
  // 検索結果の状態管理
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // URLパラメータから検索キーワードを取得
  const urlKeyword = searchParams.get('keyword') || '';

  const breadcrumbItems = [
    { label: 'TOP', path: '/' },
    { label: '体験談を探す', path: '/experiences' },
    { label: '検索結果', path: `/experiences/search?keyword=${urlKeyword}` }
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

  // 初回レンダリング時に検索を実行
  useEffect(() => {
    if (urlKeyword) {
      setSearchKeyword(urlKeyword);
      handleSearch(urlKeyword, filters);
    }
  }, [urlKeyword]);

  // 検索処理
  const handleSearch = async (keyword, currentFilters = {}) => {
    if (!keyword.trim()) {
      setError('検索キーワードを入力してください。');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const results = await searchExperiences(keyword, currentFilters);
      setSearchResults(results);
      
      if (results.length === 0) {
        setError('検索結果が見つかりませんでした。');
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('検索中にエラーが発生しました。しばらくしてから再度お試しください。');
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 検索ボタンクリック
  const handleSearchClick = () => {
    if (searchKeyword.trim()) {
      navigate(`/experiences/search?keyword=${encodeURIComponent(searchKeyword.trim())}`);
      handleSearch(searchKeyword, filters);
    }
  };

  // Enterキーでの検索
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearchClick();
    }
  };

  // フィルター適用
  const handleApplyFilters = (count, selectedFilters) => {
    setFilterCount(count);
    setFilters(selectedFilters);
    handleSearch(urlKeyword, selectedFilters);
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
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onKeyPress={handleKeyPress}
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
            
            <button 
              className={styles.searchButton}
              onClick={handleSearchClick}
              disabled={isLoading}
            >
              <SearchIcon size={18} color="#fff" />
              <span>{isLoading ? '検索中...' : '検索する'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 検索結果セクション */}
      <div className={styles.resultsSection}>
        <div className={styles.resultsHeader}>
          <h2 className={styles.resultsTitle}>
            "{urlKeyword}" の検索結果
            {!isLoading && searchResults.length > 0 && (
              <span className={styles.resultCount}>（{searchResults.length}件）</span>
            )}
          </h2>
          <div className={styles.dividerLine}></div>
        </div>

        {/* ローディング表示 */}
        {isLoading && (
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}></div>
            <p className={styles.loadingText}>検索中...</p>
          </div>
        )}

        {/* エラー表示 */}
        {error && !isLoading && (
          <div className={styles.errorContainer}>
            <p className={styles.errorText}>{error}</p>
            <button 
              className={styles.backButton}
              onClick={() => navigate('/experiences')}
            >
              体験談を探すページに戻る
            </button>
          </div>
        )}

        {/* 検索結果表示 */}
        {!isLoading && !error && searchResults.length > 0 && (
          <div className={styles.cardsGrid}>
            {searchResults.map((result, index) => (
              <TweetCard 
                key={result.id || index} 
                cardId={result.id || index}
                data={result}
              />
            ))}
          </div>
        )}
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

export default ExperiencesSearchResultsContent;

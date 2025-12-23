import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterCount, setFilterCount] = useState(0);
  const [filters, setFilters] = useState({});

  const handleApplyFilters = (count, selectedFilters) => {
    setFilterCount(count);
    setFilters(selectedFilters);
  };

  const handleClearFilters = () => {
    setFilterCount(0);
    setFilters({});
  };

  const breadcrumbItems = [
    { label: 'TOP', path: '/' },
    { label: '体験談を探す', path: '/experiences' }
  ];

  const filterConfig = {
    selectedColor: '#EF9F94',
    buttonColor: '#EF9F94',
    categories: [
      {
        title: '初めて不登校になった学年',
        options: ['小学校1年生', '小学校2年生', '小学校3年生', '小学校4年生', '小学校5年生', '小学校6年生', '中学校1年生', '中学校2年生', '中学校3年生']
      },
      {
        title: '不登校になったきっかけ',
        options: ['いじめ／友人関係', '勉強のつまずき', '発達特性・体調要因', '教師や学校との関係', 'はっきりとした原因が無い']
      },
      {
        title: '利用したサポートの種類',
        options: ['フリースクール', 'スクールカウンセラー', '校内サポートルーム', 'スクールソーシャルワーカー', '当事者の親の会', 'イベントの参加', 'ライフパートナー', '行政運営のフリースクール']
      }
    ]
  };

  // 検索ボタンクリック
  const handleSearchClick = () => {
    // キーワードまたは絞り込み条件がある場合に検索
    if (searchKeyword.trim() || filterCount > 0) {
      const keyword = searchKeyword.trim() || '*'; // キーワードが空の場合は「*」（全検索）
      const queryParams = new URLSearchParams();
      queryParams.set('keyword', keyword);
      
      // フィルター情報をURLパラメータに追加
      if (filterCount > 0) {
        queryParams.set('filters', JSON.stringify(filters));
      }
      
      navigate(`/experiences/search?${queryParams.toString()}`);
    }
  };

  // Enterキーでの検索
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearchClick();
    }
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
            <div className={styles.filterRow}>
              <button 
                className={styles.filterButton}
                onClick={() => setIsModalOpen(true)}
              >
                <FilterIcon size={16} color="#EF9F94" />
                <span>絞り込み{filterCount > 0 && `(${filterCount})`}</span>
              </button>
              <button 
                className={styles.clearButton}
                onClick={handleClearFilters}
              >
                クリア
              </button>
            </div>
            
            <button 
              className={styles.searchButton}
              onClick={handleSearchClick}
            >
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
        onApply={handleApplyFilters}
      />

      <Footer />
    </div>
  );
};

export default ExperiencesContent;

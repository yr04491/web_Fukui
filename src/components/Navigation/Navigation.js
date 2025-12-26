import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/Main.module.css';
import commonStyles from './NavigationCommon.module.css';
import NavigationHeader from './NavigationHeader';
import NavigationItem from './NavigationItem';
import { navigationItems, searchItems } from '../../data/navigationItems';

// メインの Navigation コンポーネント
const Navigation = () => {
  const navigate = useNavigate();

  // 検索項目クリックハンドラ
  const handleSearchItemClick = (item) => {
    console.log(`「${item}」がクリックされました`);
    if (item === '◯体験談をさがす') {
      navigate('/experiences');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    if (item === '◯居場所をさがす') {
      navigate('/places');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    if (item === '◯卒業後の進路をさがす') {
      navigate('/paths');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    // 実際のページ遷移処理
  };

  // フッタークリックハンドラ
  const handleFooterClick = () => {
    console.log("「プロジェクトと私たちについて」がクリックされました");
    // 運営/プロジェクトページへの遷移処理
    // window.location.href = '/about';
  };

  return (
    <div className={styles.navigation}>
      {/* ナビゲーションヘッダー */}
      <NavigationHeader isHamburger={false} />
      
      {/* ナビゲーション項目を囲むコンテナ - ハンバーガーメニューと同じ構造 */}
      <div className={styles.navItemsContainer}>
        {/* ナビゲーション項目 */}
        {navigationItems.map((item, index) => (
          <NavigationItem 
            key={index} 
            title={item.title} 
            subItems={item.subItems} 
            index={index}
            path={item.path} // 
          />
        ))}
      </div>

      {/* 探してみようセクション */}
      <div className={commonStyles.searchSection}>
        <div className={commonStyles.searchTitle}>探してみよう</div>
        <div className={commonStyles.dividerLine}></div>
        <div className={commonStyles.searchItems}>
          {searchItems.map((item, index) => (
            <div 
              key={index}
              className={commonStyles.searchItem}
              onClick={() => handleSearchItemClick(item)}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
      
      <div 
        className={commonStyles.navFooter}
        onClick={handleFooterClick}
        style={{ cursor: 'pointer' }}
      >
        プロジェクトと私たちについて
      </div>
    </div>
  );
};

export default Navigation;
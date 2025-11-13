import React from 'react';
import styles from '../../styles/Main.module.css';
import commonStyles from './NavigationCommon.module.css';
import NavigationHeader from './NavigationHeader';
import NavigationItem from './NavigationItem';
import { navigationItems } from '../../data/navigationItems';

// メインの Navigation コンポーネント
const Navigation = () => {

  // フッタークリックハンドラ
  const handleFooterClick = () => {
    console.log("「運営/プロジェクトについて」がクリックされました");
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
          />
        ))}
      </div>
      
      <div 
        className={commonStyles.navFooter}
        onClick={handleFooterClick}
        style={{ cursor: 'pointer' }}
      >
        運営/プロジェクトについて
      </div>
    </div>
  );
};

export default Navigation;

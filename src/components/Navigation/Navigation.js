import React from 'react';
import styles from '../../styles/Main.module.css';
import commonStyles from './NavigationCommon.module.css';
import NavigationHeader from './NavigationHeader';
import NavigationItem from './NavigationItem';

// メインの Navigation コンポーネント
const Navigation = () => {
  // ナビゲーション項目
  const navItems = [
    {
      title: 'まずどうする？',
      subItems: ['おうちの人が焦らないヒント']
    },
    {
      title: '学校に相談',
      subItems: ['学校にある支援の種類']
    },
    {
      title: '行政が行う公的支援',
      subItems: ['公的機関の支援の種類']
    },
    {
      title: 'まだまだある！\nみんなの居場所',
      subItems: ['こどもの居場所', '保護者の居場所']
    },
    {
      title: '中学卒業のこと',
      subItems: ['定時制高校', '通信制高校', '広域通信制サポート校']
    },
    {
      title: 'みんなで知恵を\n出し合おう！',
      subItems: ['当事者の体験談', '専門家のQ&A']
    }
  ];

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
        {navItems.map((item, index) => (
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

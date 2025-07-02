import React from 'react';
import styles from '../../styles/Main.module.css';
import hamburgerstyles from './HamburgerMenu.module.css';

// 共通のNavigationHeaderコンポーネント
const NavigationHeader = ({ isHamburger = false }) => {
  // ハンバーガーメニューとメインナビで適用するスタイルを分ける
  const headerStyles = isHamburger ? hamburgerstyles : styles;

  // タップ/クリック時の処理
  const handleLogoClick = () => {
    // ホームページやメインページに遷移する処理
    console.log('ロゴがクリックされました');
    // 実際の遷移処理はこのようになります
    // window.location.href = '/'; または
    // history.push('/');
  };

  const handleTitleClick = () => {
    console.log('タイトルがクリックされました');
    // 例: プロジェクト概要ページに遷移
    // window.location.href = '/about';
  };

  return (
    <div className={headerStyles.navHeader}>
      <p 
        className={headerStyles.navHeaderTitle}
        onClick={handleTitleClick}
        style={{ cursor: 'pointer' }}
      >
        当事者たちでつくる、不登校情報サイト
      </p>
      
      <div 
        className={headerStyles.navLogo}
        onClick={handleLogoClick}
        style={{ cursor: 'pointer' }}
      ></div>
      
      <div 
        className={headerStyles.navHeaderSubtitle}
        onClick={handleTitleClick}
        style={{ cursor: 'pointer' }}
      >
        福井県版
      </div>
    </div>
  );
};

export default NavigationHeader;

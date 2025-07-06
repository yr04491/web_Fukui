import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/Main.module.css';
import hamburgerstyles from './HamburgerMenu.module.css';

// 共通のNavigationHeaderコンポーネント
const NavigationHeader = ({ isHamburger = false }) => {
  const navigate = useNavigate();
  
  // ハンバーガーメニューとメインナビで適用するスタイルを分ける
  const headerStyles = isHamburger ? hamburgerstyles : styles;

  // タップ/クリック時の処理
  const handleLogoClick = () => {
    // ホームページに遷移する処理
    console.log('ロゴがクリックされました - ホームページに遷移');
    navigate('/');
  };

  const handleTitleClick = () => {
    console.log('タイトルがクリックされました - ホームページに遷移');
    // タイトルクリック時もホームページに遷移
    navigate('/');
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

import React from 'react';
import { useNavigate } from 'react-router-dom';
import commonStyles from './NavigationCommon.module.css';

// 共通のNavigationHeaderコンポーネント
const NavigationHeader = ({ isHamburger = false }) => {
  const navigate = useNavigate();

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
    <div className={commonStyles.navHeader}>
      <p 
        className={commonStyles.navHeaderTitle}
        onClick={handleTitleClick}
        style={{ cursor: 'pointer' }}
      >
        当事者たちでつくる、不登校情報サイト
      </p>
      
      <div 
        className={commonStyles.navLogo}
        onClick={handleLogoClick}
        style={{ cursor: 'pointer' }}
      ></div>
      
      <div 
        className={commonStyles.navHeaderSubtitle}
        onClick={handleTitleClick}
        style={{ cursor: 'pointer' }}
      >
        福井県版
      </div>
    </div>
  );
};

export default NavigationHeader;
